import { useState, useEffect, useCallback } from "react";
import { Search, Plus, CheckCircle, FileDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import StatusBadge from "@/components/StatusBadge";
import { maintenanceService } from "@/services/maintenance-service";
import { equipmentService } from "@/services/equipment-service";
import { laboratoryService } from "@/services/laboratory-service";
import { useAuth } from "@/hooks/useAuth";
import { Maintenance, Equipment, Laboratory } from "@/models/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { downloadMaintenancePdf } from "@/lib/maintenance-pdf";

export default function Manutencoes() {
  const { isAdmin, isTecnico, user } = useAuth();
  const { toast } = useToast();
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<{
    equipment_id: string;
    equipment_name: string;
    lab_id: string;
    type: Maintenance["type"];
    scheduled_date: string;
    description: string;
  }>({
    equipment_id: "",
    equipment_name: "",
    lab_id: "",
    type: "preventiva",
    scheduled_date: "",
    description: "",
  });

  const fetchData = useCallback(async () => {
    try {
      const [maintData, eqData, labData] = await Promise.all([
        maintenanceService.getAll(),
        equipmentService.getAll(),
        laboratoryService.getAll(),
      ]);
      setMaintenances(maintData);
      setEquipment(eqData);
      setLaboratories(labData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({ title: "Erro", description: "Falha ao carregar dados", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const filtered = maintenances.filter((m) => {
    const desc = (m.description ?? "").toLowerCase();
    const matchesSearch =
      m.equipment_name.toLowerCase().includes(search.toLowerCase()) || desc.includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    const matchesType = typeFilter === "all" || m.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedEquipment = equipment.find(eq => eq.id === formData.equipment_id);
      if (!selectedEquipment) return;

      await maintenanceService.create({
        ...formData,
        equipment_name: selectedEquipment.name,
        lab_id: selectedEquipment.lab_id,
        responsible: user?.email || "Usuário",
      });
      toast({ title: "Sucesso", description: "Manutenção criada com sucesso" });
      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error creating maintenance:", error);
      toast({ title: "Erro", description: "Falha ao criar manutenção", variant: "destructive" });
    }
  };

  const handleCloseMaintenance = async (id: string, withPdf = false) => {
    const completedDate = new Date().toISOString();
    const current = maintenances.find((x) => x.id === id);
    try {
      await maintenanceService.update(id, {
        status: "concluida",
        completed_date: completedDate,
      });
      if (withPdf && current) {
        const lab = laboratories.find((l) => l.id === current.lab_id);
        try {
          await downloadMaintenancePdf(
            { ...current, status: "concluida", completed_date: completedDate },
            lab?.name ?? current.lab_id
          );
          toast({ title: "Sucesso", description: "Manutenção concluída e PDF baixado." });
        } catch (pdfErr) {
          console.error(pdfErr);
          toast({
            title: "Manutenção concluída",
            description: "A ordem foi fechada, mas o PDF não pôde ser gerado. Use \"Gerar PDF\" no card.",
            variant: "destructive",
          });
        }
      } else {
        toast({ title: "Sucesso", description: "Manutenção concluída com sucesso" });
      }
      fetchData();
    } catch (error) {
      console.error("Error closing maintenance:", error);
      toast({ title: "Erro", description: "Falha ao concluir manutenção", variant: "destructive" });
    }
  };

  const handleGeneratePdf = async (m: Maintenance) => {
    const lab = laboratories.find((l) => l.id === m.lab_id);
    try {
      await downloadMaintenancePdf(m, lab?.name ?? m.lab_id);
      toast({ title: "PDF", description: "Relatório da manutenção gerado." });
    } catch (e) {
      console.error(e);
      toast({ title: "Erro", description: "Não foi possível gerar o PDF.", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({
      equipment_id: "",
      equipment_name: "",
      lab_id: "",
      type: "preventiva",
      scheduled_date: "",
      description: "",
    });
  };

  const canCreateMaintenance = true; // All authenticated users can create maintenance
  const canCloseMaintenance = isAdmin || isTecnico; // Technicians and admins can close

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
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Manutenções</h1>
        <p className="text-sm text-muted-foreground mt-1">Acompanhe todas as manutenções preventivas e corretivas</p>
      </div>

      {/* Filters and Create Button */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
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
          {canCreateMaintenance && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setDialogOpen(true)} className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Manutenção
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Nova Manutenção</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="equipment_id">Equipamento</Label>
                    <Select value={formData.equipment_id} onValueChange={(value) => setFormData({ ...formData, equipment_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um equipamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipment.map((eq) => (
                          <SelectItem key={eq.id} value={eq.id}>{eq.name} ({eq.serial_number})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Tipo</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            type: value === "corretiva" ? "corretiva" : "preventiva",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="preventiva">Preventiva</SelectItem>
                          <SelectItem value="corretiva">Corretiva</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="scheduled_date">Data Agendada</Label>
                      <Input
                        id="scheduled_date"
                        type="date"
                        value={formData.scheduled_date}
                        onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Descreva a manutenção necessária..."
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      Criar Manutenção
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Cards list */}
      <div className="space-y-3">
        {filtered.map((m) => {
          const lab = laboratories.find((l) => l.id === m.lab_id);
          return (
            <div key={m.id} className="p-4 sm:p-5 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-card-foreground text-sm sm:text-base">{m.equipment_name}</h3>
                    <StatusBadge status={m.type} />
                    <StatusBadge status={m.status} />
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">{m.description ?? "—"}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                    <span>Lab: {lab?.name}</span>
                    <span>Resp: {m.responsible}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 border-t border-border sm:border-0 sm:pt-0">
                  <div className="sm:text-right">
                    <p className="text-xs text-muted-foreground">Agendada</p>
                    <p className={cn("text-sm font-semibold", m.status === "atrasada" ? "text-destructive" : "text-card-foreground")}>
                      {new Date(m.scheduled_date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  {m.completed_date && (
                    <div className="sm:text-right">
                      <p className="text-xs text-muted-foreground">Concluída</p>
                      <p className="text-sm font-semibold text-success">{new Date(m.completed_date).toLocaleDateString("pt-BR")}</p>
                    </div>
                  )}
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    {m.status === "concluida" && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleGeneratePdf(m)}
                        className="flex items-center gap-1"
                      >
                        <FileDown className="w-4 h-4" />
                        Gerar PDF
                      </Button>
                    )}
                    {canCloseMaintenance && (m.status === "pendente" || m.status === "em_andamento") && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCloseMaintenance(m.id, false)}
                          className="flex items-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Concluir
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleCloseMaintenance(m.id, true)}
                          className="flex items-center gap-1"
                        >
                          <FileDown className="w-4 h-4" />
                          Concluir e gerar PDF
                        </Button>
                      </>
                    )}
                  </div>
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
