import { useState, useEffect } from "react";
import { Package, Zap, Cpu, Wind, Truck, Building, FlaskConical, Plus, Trash2, Edit, ChevronDown, ChevronUp, Ticket } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { equipmentService } from "@/services/equipment-service";
import { laboratoryService } from "@/services/laboratory-service";
import { maintenanceService } from "@/services/maintenance-service";
import { useToast } from "@/hooks/use-toast";
import { Equipment, Laboratory, Maintenance } from "@/models/types";

const labIcons: Record<string, React.ElementType> = {
  Zap,
  Cpu,
  Wind,
  Truck,
  Wrench: Package,
  FlaskConical,
  Building,
};

interface ExpandedLab {
  [key: string]: boolean;
}

type EquipmentFormData = {
  name: string;
  brand: string;
  model: string;
  serial_number: string;
  lab_id: string;
  status: Equipment["status"];
  acquisition_date: string;
};

export default function Laboratorios() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [expandedLabs, setExpandedLabs] = useState<ExpandedLab>({});
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketType, setTicketType] = useState<"preventiva" | "corretiva" | "emergencial">("corretiva");
  const [ticketDescription, setTicketDescription] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [selectedLabForAdd, setSelectedLabForAdd] = useState<string>("");
  const [formData, setFormData] = useState<{
    name: string;
    brand: string;
    model: string;
    serial_number: string;
    lab_id: string;
    status: Equipment["status"];
    acquisition_date: string;
  }>({
    name: "",
    brand: "",
    model: "",
    serial_number: "",
    lab_id: "",
    status: "operacional",
    acquisition_date: "",
  });

  const fetchData = async () => {
    try {
      const [labs, eq, maint] = await Promise.all([
        laboratoryService.getAll(),
        equipmentService.getAll(),
        maintenanceService.getAll(),
      ]);
      setLaboratories(labs);
      setEquipment(eq);
      setMaintenances(maint);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({ title: "Erro", description: "Falha ao carregar dados", variant: "destructive" });
    }
  };

  

  function toggleLabExpand(labId: string) {
    setExpandedLabs((prev) => ({
      ...prev,
      [labId]: !prev[labId],
    }));
  }

  const handleCreateTicket = (equipmentId: string) => {
    setSelectedEquipment(equipmentId);
    setShowTicketForm(true);
  };

  const handleAddEquipment = (labId: string) => {
    setSelectedLabForAdd(labId);
    setFormData({
      name: "",
      brand: "",
      model: "",
      serial_number: "",
      lab_id: labId,
      status: "operacional",
      acquisition_date: "",
    });
    setShowAddDialog(true);
  };

  const handleEditEquipment = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setFormData({
      name: equipment.name,
      brand: equipment.brand,
      model: equipment.model,
      serial_number: equipment.serial_number,
      lab_id: equipment.lab_id,
      status: equipment.status,
      acquisition_date: equipment.acquisition_date || "",
    });
    setShowEditDialog(true);
  };

  const handleDeleteEquipment = async (equipmentId: string) => {
    if (confirm("Tem certeza que deseja excluir este equipamento?")) {
      try {
        await equipmentService.delete(equipmentId);
        toast({ title: "Sucesso", description: "Equipamento excluído com sucesso" });
        fetchData();
      } catch (error) {
        console.error("Error deleting equipment:", error);
        toast({ title: "Erro", description: "Falha ao excluir equipamento", variant: "destructive" });
      }
    }
  };

  const handleSubmitEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEquipment) {
        await equipmentService.update(editingEquipment.id, formData);
        toast({ title: "Sucesso", description: "Equipamento atualizado com sucesso" });
      } else {
        await equipmentService.create(formData);
        toast({ title: "Sucesso", description: "Equipamento criado com sucesso" });
      }
      setShowAddDialog(false);
      setShowEditDialog(false);
      setEditingEquipment(null);
      fetchData();
    } catch (error) {
      console.error("Error saving equipment:", error);
      toast({ title: "Erro", description: "Falha ao salvar equipamento", variant: "destructive" });
    }
  };

  const submitTicket = () => {
    if (selectedEquipment && ticketDescription.trim()) {
      const selectedEq = equipment.find((e) => e.id === selectedEquipment);
      if (selectedEq) {
        alert(`✅ Chamado de manutenção aberto!\n\nEquipamento: ${selectedEq.name}\nTipo: ${ticketType}\nDescrição: ${ticketDescription}`);
        setShowTicketForm(false);
        setSelectedEquipment(null);
        setTicketDescription("");
        setTicketType("corretiva");
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Laboratórios</h1>
        <p className="text-sm text-muted-foreground mt-1">Gerenciamento dos laboratórios e equipamentos do SENAI Alagoinhas</p>
      </div>

      <div className="space-y-3">
        {laboratories.map((lab) => {
          const labEquipment = equipment.filter((e) => e.lab_id === lab.id);
          const isExpanded = expandedLabs[lab.id];
          const Icon = labIcons[lab.icon] || Package;
          const operationalCount = labEquipment.filter((e) => e.status === "operacional").length;
          const labMaintenances = maintenances.filter((m) => m.lab_id === lab.id);
          const pendingMaint = labMaintenances.filter((m) => m.status === "pendente" || m.status === "em_andamento").length;

          return (
            <div key={lab.id} className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
              <button
                onClick={() => toggleLabExpand(lab.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="rounded-lg bg-primary/10 p-2.5 shrink-0">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <h3 className="font-semibold text-sm sm:text-base text-card-foreground">{lab.name}</h3>
                    <div className="flex items-center gap-2 flex-wrap mt-1 text-xs text-muted-foreground">
                      <span>{labEquipment.length} equipamentos</span>
                      <span>•</span>
                      <span className="text-green-600">{operationalCount} operacionais</span>
                      {pendingMaint > 0 && (
                        <><span className="text-yellow-600">• {pendingMaint} pendentes</span></>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddEquipment(lab.id);
                      }}
                      className="shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-border divide-y divide-border bg-muted/30">
                  {labEquipment.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/50 text-left text-xs uppercase font-bold text-muted-foreground">
                            <th className="px-4 py-3">Equipamento</th>
                            <th className="px-4 py-3">Marca/Modelo</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Última Manutenção</th>
                            <th className="px-4 py-3 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {labEquipment.map((eq) => {
                            const eqMaint = maintenances.filter((m) => m.equipment_id === eq.id);
                            const lastMaint = eqMaint.find((m) => m.status === "concluida")?.completed_date || eq.last_maintenance;
                            
                            return (
                              <tr key={eq.id} className="border-t border-border hover:bg-muted/40 transition-colors">
                                <td className="px-4 py-3 font-medium">{eq.name}</td>
                                <td className="px-4 py-3 text-muted-foreground">{eq.brand} {eq.model}</td>
                                <td className="px-4 py-3"><StatusBadge status={eq.status} /></td>
                                <td className="px-4 py-3 text-muted-foreground text-xs">
                                  {lastMaint ? new Date(lastMaint).toLocaleDateString("pt-BR") : "—"}
                                </td>
                                <td className="px-4 py-3 text-right space-x-1">
                                  <Button size="sm" variant="outline" onClick={() => handleCreateTicket(eq.id)}>
                                    <Ticket className="w-3 h-3" />
                                  </Button>
                                  {isAdmin && (
                                    <>
                                      <Button size="sm" variant="outline" onClick={() => handleEditEquipment(eq)}>
                                        <Edit className="w-3 h-3" />
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={() => handleDeleteEquipment(eq.id)} className="text-destructive">
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">Nenhum equipamento cadastrado.</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Adicionar */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Adicionar Equipamento</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmitEquipment} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand">Marca</Label>
                <Input id="brand" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="model">Modelo</Label>
                <Input id="model" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} required />
              </div>
            </div>
            <div>
              <Label htmlFor="serial_number">Número de Série</Label>
              <Input id="serial_number" value={formData.serial_number} onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as Equipment["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operacional">Operacional</SelectItem>
                    <SelectItem value="em_manutencao">Em Manutenção</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="acquisition_date">Data de Aquisição</Label>
                <Input id="acquisition_date" type="date" value={formData.acquisition_date} onChange={(e) => setFormData({ ...formData, acquisition_date: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>Cancelar</Button>
              <Button type="submit">Adicionar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Editar */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Editar Equipamento</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmitEquipment} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nome</Label>
              <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            {/* O Copilot gerou as mesmas estruturas para os dois modais, mantendo conforme solicitado */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-brand">Marca</Label>
                <Input id="edit-brand" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="edit-model">Modelo</Label>
                <Input id="edit-model" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} required />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Chamado - Onde estava o erro */}
      {showTicketForm && selectedEquipment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#003366]">Abrir Chamado de Manutenção</h2>
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-bold uppercase text-slate-500">Tipo</Label>
                <select
                  title="Tipo de manutenção"
                  value={ticketType}
                  onChange={(e) => setTicketType(e.target.value as "preventiva" | "corretiva" | "emergencial")}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="preventiva">Preventiva</option>
                  <option value="corretiva">Corretiva</option>
                  <option value="emergencial">Emergencial</option>
                </select>
              </div>
              <div>
                <Label className="text-xs font-bold uppercase text-slate-500">Descrição</Label>
                <textarea
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  placeholder="Descreva o problema..."
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm min-h-[100px]"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="ghost" onClick={() => setShowTicketForm(false)}>Cancelar</Button>
              <Button onClick={submitTicket} className="bg-[#003366] hover:bg-[#004488]">Abrir Chamado</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}