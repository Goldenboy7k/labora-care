import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "warning" | "danger" | "success";
}

const variantStyles = {
  default: "bg-card border-border",
  warning: "bg-card border-l-4 border-l-warning border-t-border border-r-border border-b-border",
  danger: "bg-card border-l-4 border-l-destructive border-t-border border-r-border border-b-border",
  success: "bg-card border-l-4 border-l-success border-t-border border-r-border border-b-border",
};

const iconVariantStyles = {
  default: "bg-secondary text-primary",
  warning: "bg-warning/10 text-warning",
  danger: "bg-destructive/10 text-destructive",
  success: "bg-success/10 text-success",
};

export default function KpiCard({ title, value, subtitle, icon: Icon, variant = "default" }: KpiCardProps) {
  return (
    <div className={cn("rounded-xl border p-5 shadow-sm", variantStyles[variant])}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-card-foreground">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={cn("rounded-lg p-2.5", iconVariantStyles[variant])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
