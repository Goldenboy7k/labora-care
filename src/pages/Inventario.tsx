import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/StatusBadge";
import { equipment, laboratories } from "@/data/mockData";

export default function Inventario() {
  const [search, setSearch] = useState("");
  const [labFilter, setLabFilter] = useState("all");

  const filtered = equipment.filter((eq) => {
    const matchesSearch = eq.name.toLowerCase().includes(search.toLowerCase()) || eq.serialNumber.toLowerCase().includes(search.toLowerCase());
    const matchesLab = labFilter === "all" || eq.labId === labFilter;
    return matchesSearch && matchesLab;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Inventário de Equipamentos</h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie todos os ativos dos laboratórios</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou série..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={labFilter} onValueChange={setLabFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Laboratório" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Labs</SelectItem>
            {laboratories.map((lab) => (
              <SelectItem key={lab.id} value={lab.id}>{lab.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Equipamento</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Marca / Modelo</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Nº Série</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Laboratório</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Última Manutenção</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((eq) => {
                const lab = laboratories.find((l) => l.id === eq.labId);
                return (
                  <tr key={eq.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-card-foreground">{eq.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{eq.brand} {eq.model}</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{eq.serialNumber}</td>
                    <td className="px-4 py-3 text-muted-foreground">{lab?.name}</td>
                    <td className="px-4 py-3"><StatusBadge status={eq.status} /></td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {eq.lastMaintenance ? new Date(eq.lastMaintenance).toLocaleDateString("pt-BR") : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">Nenhum equipamento encontrado.</div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((eq) => {
          const lab = laboratories.find((l) => l.id === eq.labId);
          return (
            <div key={eq.id} className="p-4 rounded-xl border border-border bg-card shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-sm text-card-foreground">{eq.name}</h3>
                <StatusBadge status={eq.status} />
              </div>
              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                <p>{eq.brand} {eq.model}</p>
                <p className="font-mono">{eq.serialNumber}</p>
                <p>{lab?.name}</p>
                <p>Última manut.: {eq.lastMaintenance ? new Date(eq.lastMaintenance).toLocaleDateString("pt-BR") : "—"}</p>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="p-8 text-center text-muted-foreground rounded-xl border border-border bg-card">Nenhum equipamento encontrado.</div>
        )}
      </div>
    </div>
  );
}
