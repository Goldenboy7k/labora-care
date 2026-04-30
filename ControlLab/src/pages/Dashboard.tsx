import { useEffect, useState } from "react";
import { Package, Wrench, AlertTriangle, CheckCircle } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import KpiCard from "@/components/KpiCard";
import StatusBadge from "@/components/StatusBadge";
import { equipmentService } from "@/services/equipment-service";
import { maintenanceService } from "@/services/maintenance-service";
import { laboratoryService } from "@/services/laboratory-service";
import { supabase } from "@/integrations/supabase/client";
import { Equipment, Maintenance, Laboratory } from "@/models/types";
import { cn } from "@/lib/utils";

// Cores que contrastam bem no fundo azul marinho
const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#ef4444"];

export default function Dashboard() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [eqData, maintData, labData] = await Promise.all([
        equipmentService.getAll(),
        maintenanceService.getAll(),
        laboratoryService.getAll(),
      ]);
      setEquipment(eqData);
      setMaintenances(maintData);
      setLaboratories(labData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const equipmentSubscription = supabase
      .channel('equipment_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'equipment' }, () => {
        fetchData();
      })
      .subscribe();

    const maintenanceSubscription = supabase
      .channel('maintenance_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'maintenance' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      equipmentSubscription.unsubscribe();
      maintenanceSubscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const totalEquipment = equipment.length;
  const operational = equipment.filter((e) => e.status === "operacional").length;
  const pendingMaint = maintenances.filter((m) => m.status === "pendente" || m.status === "em_andamento").length;
  const overdueMaint = maintenances.filter((m) => m.status === "atrasada").length;

  const recentMaintenances = maintenances
    .filter((m) => m.status !== "concluida")
    .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime())
    .slice(0, 5);

  const equipmentStatusData = [
    { name: "Operacional", value: equipment.filter((e) => e.status === "operacional").length },
    { name: "Em Manutenção", value: equipment.filter((e) => e.status === "em_manutencao").length },
    { name: "Inativo", value: equipment.filter((e) => e.status === "inativo").length },
  ];

  const labDistributionData = laboratories.map((lab) => ({
    name: lab.name,
    equipamentos: equipment.filter((e) => e.lab_id === lab.id).length,
  }));

  const maintenanceStatusData = [
    { name: "Concluída", value: maintenances.filter((m) => m.status === "concluida").length },
    { name: "Pendente", value: maintenances.filter((m) => m.status === "pendente").length },
    { name: "Em Andamento", value: maintenances.filter((m) => m.status === "em_andamento").length },
    { name: "Atrasada", value: maintenances.filter((m) => m.status === "atrasada").length },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* Header Original */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Visão geral dos laboratórios do SENAI Alagoinhas</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard title="Total de Equipamentos" value={totalEquipment} subtitle={`${operational} operacionais`} icon={Package} />
        <KpiCard title="Manutenções Pendentes" value={pendingMaint} subtitle="preventivas e corretivas" icon={Wrench} variant="warning" />
        <KpiCard title="Manutenções Atrasadas" value={overdueMaint} subtitle="atenção imediata" icon={AlertTriangle} variant="danger" />
        <KpiCard title="Concluídas este Mês" value={maintenances.filter((m) => m.status === "concluida").length} subtitle="dentro do prazo" icon={CheckCircle} variant="success" />
      </div>

      {/* Seção de Gráficos com Estilo Azul Escuro */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfico Status Equipamentos */}
        <div className="rounded-[20px] bg-[#002147] shadow-xl p-6 border-none">
          <h2 className="text-base sm:text-lg font-bold text-white mb-4">Status dos Equipamentos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={equipmentStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                stroke="none"
              >
                {equipmentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#002147', border: 'none', borderRadius: '10px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico Status Manutenções */}
        <div className="rounded-[20px] bg-[#002147] shadow-xl p-6 border-none">
          <h2 className="text-base sm:text-lg font-bold text-white mb-4">Status das Manutenções</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={maintenanceStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                stroke="none"
              >
                {maintenanceStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#002147', border: 'none', borderRadius: '10px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Equipamentos por Laboratório */}
      <div className="rounded-[20px] border border-border bg-card shadow-sm p-6">
        <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Equipamentos por Laboratório</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={labDistributionData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Bar dataKey="equipamentos" fill="#002147" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Próximas Manutenções */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Próximas Manutenções</h2>
        <div className="space-y-3">
          {recentMaintenances.map((m) => (
            <div key={m.id} className="p-3 sm:p-4 rounded-[15px] border border-border bg-card shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-xs sm:text-sm text-card-foreground">{m.equipment_name}</p>
                <StatusBadge status={m.status} />
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{m.description}</p>
              <div className="flex items-center justify-between mt-3">
                <StatusBadge status={m.type} />
                <span className={cn("text-[10px] sm:text-xs font-medium", m.status === "atrasada" ? "text-destructive" : "text-muted-foreground")}>
                  {new Date(m.scheduled_date).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}