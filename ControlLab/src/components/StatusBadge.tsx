import { cn } from "@/lib/utils";

type StatusType = "operacional" | "em_manutencao" | "inativo" | "pendente" | "em_andamento" | "concluida" | "atrasada" | "preventiva" | "corretiva" | "emergencial";

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  operacional: { label: "Operacional", className: "bg-success/10 text-success" },
  em_manutencao: { label: "Em Manutenção", className: "bg-warning/10 text-warning" },
  inativo: { label: "Inativo", className: "bg-destructive/10 text-destructive" },
  pendente: { label: "Pendente", className: "bg-secondary text-secondary-foreground" },
  em_andamento: { label: "Em Andamento", className: "bg-warning/10 text-warning" },
  concluida: { label: "Concluída", className: "bg-success/10 text-success" },
  atrasada: { label: "Atrasada", className: "bg-destructive/10 text-destructive" },
  preventiva: { label: "Preventiva", className: "bg-primary/10 text-primary" },
  corretiva: { label: "Corretiva", className: "bg-warning/10 text-warning" },
  emergencial: { label: "Emergencial", className: "bg-destructive/10 text-destructive" },
};

export default function StatusBadge({ status }: { status: StatusType }) {
  const config = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", config.className)}>
      {config.label}
    </span>
  );
}
