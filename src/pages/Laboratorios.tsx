import { useNavigate } from "react-router-dom";
import { Package, Zap, Cpu, Wind, Truck, Wrench, FlaskConical, Building } from "lucide-react";
import { laboratories, equipment, maintenances } from "@/data/mockData";

const labIcons: Record<string, React.ElementType> = {
  Zap,
  Cpu,
  Wind,
  Truck,
  Wrench,
  FlaskConical,
  Building,
};

export default function Laboratorios() {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Laboratórios</h1>
        <p className="text-sm text-muted-foreground mt-1">Visualize os laboratórios e acesse seus equipamentos.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {laboratories.map((lab) => {
          const Icon = labIcons[lab.icon] || Package;
          const labEquipment = equipment.filter((eq) => eq.labId === lab.id);
          const labMaintenances = maintenances.filter((m) => m.labId === lab.id);
          const pendingCount = labMaintenances.filter((m) => m.status === "pendente" || m.status === "em_andamento").length;
          const overdueCount = labMaintenances.filter((m) => m.status === "atrasada").length;

          return (
            <button
              key={lab.id}
              onClick={() => navigate(`/laboratorio/${lab.id}`)}
              className="text-left rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="rounded-lg bg-primary/10 p-2 shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{lab.name}</p>
                    <p className="text-xs text-muted-foreground">{labEquipment.length} equipamentos</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 text-xs">
                <span className="rounded-full px-2 py-1 bg-primary/10 text-primary">{pendingCount} pendentes</span>
                <span className="rounded-full px-2 py-1 bg-destructive/10 text-destructive">{overdueCount} atrasadas</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
