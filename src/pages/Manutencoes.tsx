import { useState } from "react";
import { Search, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { maintenances as mockMaintenances, laboratories } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Manutencoes() {
  const { isAdmin, isTecnico } = useAuth();
  const { toast } = useToast();
  const [maintenances, setMaintenances] = useState(mockMaintenances);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const canCloseMaintenance = isAdmin || isTecnico;

  const filtered = maintenances.filter((m) => {
    const matchesSearch = m.equipmentName.toLowerCase().includes(search.toLowerCase()) || m.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    const matchesType = typeFilter === "all" || m.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCloseMaintenance = (id: string) => {
    setMaintenances((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: "concluida" as const, completedDate: new Date().toISOString() }
          : m
      )
    );
    toast({ title: "Sucesso", description: "Manutenção concluída com sucesso" });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Manutenções</h1>
        <p className="text-sm text-muted-foreground mt-1">Acompanhe todas as manutenções preventivas e corretivas</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar equipamento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="em_andamento">Em Andamento</SelectItem>
              <SelectItem value="atrasada">Atrasada</SelectItem>
              <SelectItem value="concluida">Concluída</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              <SelectItem value="preventiva">Preventiva</SelectItem>
              <SelectItem value="corretiva">Corretiva</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards list */}
      <div className="space-y-3">
        {filtered.map((m) => {
          const lab = laboratories.find((l) => l.id === m.labId);
          return (
            <div key={m.id} className="p-4 sm:p-5 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-card-foreground text-sm sm:text-base">{m.equipmentName}</h3>
                    <StatusBadge status={m.type} />
                    <StatusBadge status={m.status} />
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">{m.description}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                    <span>Lab: {lab?.name}</span>
                    <span>Resp: {m.responsible}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 border-t border-border sm:border-0 sm:pt-0">
                  <div className="sm:text-right">
                    <p className="text-xs text-muted-foreground">Agendada</p>
                    <p className={cn("text-sm font-semibold", m.status === "atrasada" ? "text-destructive" : "text-card-foreground")}>
                      {new Date(m.scheduledDate).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  {m.completedDate && (
                    <div className="sm:text-right">
                      <p className="text-xs text-muted-foreground">Concluída</p>
                      <p className="text-sm font-semibold text-success">{new Date(m.completedDate).toLocaleDateString("pt-BR")}</p>
                    </div>
                  )}
                  {canCloseMaintenance && (m.status === "pendente" || m.status === "em_andamento") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCloseMaintenance(m.id)}
                      className="flex items-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Concluir
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="p-8 text-center text-muted-foreground rounded-xl border border-border bg-card">Nenhuma manutenção encontrada.</div>
        )}
      </div>
    </div>
  );
}
