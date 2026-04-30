import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import StatusBadge from "@/components/StatusBadge";
import { equipmentService } from "@/services/equipment-service";
import { laboratoryService } from "@/services/laboratory-service";
import { useAuth } from "@/hooks/useAuth";
import { Equipment, Laboratory } from "@/models/types";
import { useToast } from "@/hooks/use-toast";

export default function Inventario() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [search, setSearch] = useState("");
  const [labFilter, setLabFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    serial_number: "",
    lab_id: "",
    status: "operacional" as const,
    acquisition_date: "",
  });

  const fetchData = async () => {
    try {
      const [eqData, labData] = await Promise.all([
        equipmentService.getAll(),
        laboratoryService.getAll(),
      ]);
      setEquipment(eqData);
      setLaboratories(labData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({ title: "Erro", description: "Falha ao carregar dados", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = equipment.filter((eq) => {
    const matchesSearch = eq.name.toLowerCase().includes(search.toLowerCase()) || eq.serial_number.toLowerCase().includes(search.toLowerCase());
    const matchesLab = labFilter === "all" || eq.lab_id === labFilter;
    return matchesSearch && matchesLab;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEquipment) {
        await equipmentService.update(editingEquipment.id, formData);
        toast({ title: "Sucesso", description: "Equipamento atualizado com sucesso" });
      } else {
        await equipmentService.create(formData);
        toast({ title: "Sucesso", description: "Equipamento criado com sucesso" });
      }
      setDialogOpen(false);
      setEditingEquipment(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving equipment:", error);
      toast({ title: "Erro", description: "Falha ao salvar equipamento", variant: "destructive" });
    }
  };

  const handleEdit = (eq: Equipment) => {
    setEditingEquipment(eq);
    setFormData({
      name: eq.name,
      brand: eq.brand,
      model: eq.model,
      serial_number: eq.serial_number,
      lab_id: eq.lab_id,
      status: eq.status,
      acquisition_date: eq.acquisition_date || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este equipamento?")) {
      try {
        await equipmentService.delete(id);
        toast({ title: "Sucesso", description: "Equipamento excluído com sucesso" });
        fetchData();
      } catch (error) {
        console.error("Error deleting equipment:", error);
        toast({ title: "Erro", description: "Falha ao excluir equipamento", variant: "destructive" });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      brand: "",
      model: "",
      serial_number: "",
      lab_id: "",
      status: "operacional",
      acquisition_date: "",
    });
  };

  const openCreateDialog = () => {
    setEditingEquipment(null);
    resetForm();
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Inventário de Equipamentos</h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie todos os ativos dos laboratórios</p>
      </div>

      {/* Filters and Add Button */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
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
        {isAdmin && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Equipamento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingEquipment ? "Editar Equipamento" : "Novo Equipamento"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brand">Marca</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Modelo</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="serial_number">Número de Série</Label>
                  <Input
                    id="serial_number"
                    value={formData.serial_number}
                    onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lab_id">Laboratório</Label>
                  <Select value={formData.lab_id} onValueChange={(value) => setFormData({ ...formData, lab_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um laboratório" />
                    </SelectTrigger>
                    <SelectContent>
                      {laboratories.map((lab) => (
                        <SelectItem key={lab.id} value={lab.id}>{lab.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="operacional">Operacional</SelectItem>
                        <SelectItem value="em_manutencao">Em Manutenção</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="acquisition_date">Data de Aquisição</Label>
                    <Input
                      id="acquisition_date"
                      type="date"
                      value={formData.acquisition_date}
                      onChange={(e) => setFormData({ ...formData, acquisition_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingEquipment ? "Atualizar" : "Criar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
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
                {isAdmin && <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Ações</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((eq) => {
                const lab = laboratories.find((l) => l.id === eq.lab_id);
                return (
                  <tr key={eq.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-card-foreground">{eq.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{eq.brand} {eq.model}</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{eq.serial_number}</td>
                    <td className="px-4 py-3 text-muted-foreground">{lab?.name}</td>
                    <td className="px-4 py-3"><StatusBadge status={eq.status} /></td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {eq.last_maintenance ? new Date(eq.last_maintenance).toLocaleDateString("pt-BR") : "—"}
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(eq)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(eq.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    )}
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
          const lab = laboratories.find((l) => l.id === eq.lab_id);
          return (
            <div key={eq.id} className="p-4 rounded-xl border border-border bg-card shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-sm text-card-foreground">{eq.name}</h3>
                <StatusBadge status={eq.status} />
              </div>
              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                <p>{eq.brand} {eq.model}</p>
                <p className="font-mono">{eq.serial_number}</p>
                <p>{lab?.name}</p>
                <p>Última manut.: {eq.last_maintenance ? new Date(eq.last_maintenance).toLocaleDateString("pt-BR") : "—"}</p>
              </div>
              {isAdmin && (
                <div className="flex gap-2 mt-3">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(eq)} className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(eq.id)} className="flex-1">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              )}
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
