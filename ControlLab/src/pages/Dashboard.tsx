import { Package, Wrench, AlertTriangle, CheckCircle, Zap, Cpu, Wind, Truck, Building, FlaskConical } from "lucide-react";
import KpiCard from "@/components/KpiCard";
import StatusBadge from "@/components/StatusBadge";
import { laboratories, equipment, maintenances } from "@/data/mockData";
import { cn } from "@/lib/utils";

const labIcons: Record<string, React.ElementType> = {
  Zap, Cpu, Wind, Truck, Wrench, FlaskConical, Building,
};

export default function Dashboard() {
  const totalEquipment = equipment.length;
  const operational = equipment.filter((e) => e.status === "operacional").length;
  const pendingMaint = maintenances.filter((m) => m.status === "pendente" || m.status === "em_andamento").length;
  const overdueMaint = maintenances.filter((m) => m.status === "atrasada").length;

  const recentMaintenances = maintenances
    .filter((m) => m.status !== "concluida")
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    .slice(0, 5);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* Header */}
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

      {/* Labs Grid + Recent Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Labs */}
        <div className="lg:col-span-2">
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Laboratórios</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {laboratories.map((lab) => {
              const Icon = labIcons[lab.icon] || Package;
              return (
                <div key={lab.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                  <div className="rounded-lg bg-primary/10 p-2 sm:p-2.5 shrink-0">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs sm:text-sm text-card-foreground truncate">{lab.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{lab.equipmentCount} equipamentos</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {lab.overdueMaintenance > 0 && (
                      <span className="text-[9px] sm:text-[10px] font-bold text-destructive bg-destructive/10 rounded-full px-1.5 sm:px-2 py-0.5">
                        {lab.overdueMaintenance} atrasada{lab.overdueMaintenance > 1 ? "s" : ""}
                      </span>
                    )}
                    {lab.pendingMaintenance > 0 && (
                      <span className="text-[9px] sm:text-[10px] font-bold text-warning bg-warning/10 rounded-full px-1.5 sm:px-2 py-0.5">
                        {lab.pendingMaintenance} pendente{lab.pendingMaintenance > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Maintenance */}
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Próximas Manutenções</h2>
          <div className="space-y-3">
            {recentMaintenances.map((m) => (
              <div key={m.id} className="p-3 sm:p-4 rounded-xl border border-border bg-card shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-xs sm:text-sm text-card-foreground">{m.equipmentName}</p>
                  <StatusBadge status={m.status} />
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{m.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <StatusBadge status={m.type} />
                  <span className={cn("text-[10px] sm:text-xs font-medium", m.status === "atrasada" ? "text-destructive" : "text-muted-foreground")}>
                    {new Date(m.scheduledDate).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
