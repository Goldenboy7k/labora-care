import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, ArrowLeft, Package, Wrench, AlertTriangle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/StatusBadge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { laboratories, equipment, maintenances, type Equipment, Maintenance } from "@/data/mockData";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

type EquipmentStatus = "operacional" | "em_manutencao" | "inativo";
type MaintenanceType = "preventiva" | "corretiva" | "emergencial";

const statusConfig = {
  operacional: { label: "Operacional", variant: "default" as const },
  em_manutencao: { label: "Em Manutenção", variant: "secondary" as const },
  inativo: { label: "Inativo", variant: "destructive" as const },
};

export default function LaboratoryDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isTecnico, isAdmin, user } = useAuth();
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [newEquipment, setNewEquipment] = useState({
    name: "",
    brand: "",
    model: "",
    serialNumber: "",
    status: "operacional" as EquipmentStatus,
    acquisitionDate: "",
  });
  const [newRequest, setNewRequest] = useState({
    equipmentId: "",
    type: "preventiva" as MaintenanceType,
    description: "",
  });
  const [, setRefreshToggle] = useState(false);

  const lab = laboratories.find((l) => l.id === id);
  if (!lab) {
    return <div>Laboratório não encontrado</div>;
  }

  const labEquipment = equipment.filter((eq) => eq.labId === id);
  const labMaintenances = maintenances.filter((m) => m.labId === id);

  const handleAddEquipment = () => {
    setIsAddDialogOpen(true);
  };

  const handleOpenRequest = () => {
    setIsRequestDialogOpen(true);
  };

  const handleSaveEquipment = () => {
    if (!newEquipment.name || !newEquipment.brand || !newEquipment.model || !newEquipment.serialNumber || !newEquipment.acquisitionDate) {
      return;
    }

    const equipmentToAdd = {
      id: `eq-${Date.now()}`,
      name: newEquipment.name,
      brand: newEquipment.brand,
      model: newEquipment.model,
      serialNumber: newEquipment.serialNumber,
      labId: id!,
      status: newEquipment.status,
      acquisitionDate: newEquipment.acquisitionDate,
      lastMaintenance: null,
    };

    // Em uma aplicação real, isso seria enviado para o backend
    equipment.push(equipmentToAdd);

    // Reset form
    setNewEquipment({
      name: "",
      brand: "",
      model: "",
      serialNumber: "",
      status: "operacional",
      acquisitionDate: "",
    });
    setIsAddDialogOpen(false);

    // Forçar re-render local, sem resetar os dados do mock
    setRefreshToggle((current) => !current);
  };

  const handleSaveRequest = () => {
    if (!newRequest.equipmentId || !newRequest.description) {
      return;
    }

    const selectedEq = equipment.find(eq => eq.id === newRequest.equipmentId);
    if (!selectedEq) return;

    // Atualiza o status do equipamento para refletir a manutenção aberta
    selectedEq.status = "em_manutencao";
    selectedEq.lastMaintenance = new Date().toISOString().split('T')[0];

    const requestToAdd: Maintenance = {
      id: `mnt-${Date.now()}`,
      equipmentId: newRequest.equipmentId,
      equipmentName: selectedEq.name,
      labId: id!,
      type: newRequest.type,
      status: "pendente",
      scheduledDate: new Date().toISOString().split('T')[0],
      completedDate: null,
      description: newRequest.description,
      responsible: user?.email || "Usuário",
    };

    // Em uma aplicação real, isso seria enviado para o backend
    maintenances.push(requestToAdd);

    // Reset form
    setNewRequest({
      equipmentId: "",
      type: "preventiva",
      description: "",
    });
    setIsRequestDialogOpen(false);

    // Forçar re-render local, sem resetar os dados do mock
    setRefreshToggle((current) => !current);
  };

  const handleEditEquipment = (equipmentId: string) => {
    // TODO: Implement edit equipment modal/form
    console.log("Editar equipamento", equipmentId);
  };

  const handleDeleteEquipment = (equipmentId: string) => {
    // TODO: Implement delete confirmation
    console.log("Excluir equipamento", equipmentId);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">{lab.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {lab.equipmentCount} equipamentos • {lab.pendingMaintenance} manutenções pendentes • {lab.overdueMaintenance} atrasadas
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {isTecnico || isAdmin ? (
          <Button onClick={handleAddEquipment}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Equipamento
          </Button>
        ) : (
          <Button onClick={handleOpenRequest}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Abrir Chamado
          </Button>
        )}
      </div>

      {/* Equipment Grid */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Equipamentos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {labEquipment.map((eq) => (
            <Card key={eq.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-sm font-medium">{eq.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {eq.brand} {eq.model}
                    </CardDescription>
                  </div>
                  <Badge variant={statusConfig[eq.status].variant} className="text-xs">
                    {statusConfig[eq.status].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p><strong>Série:</strong> {eq.serialNumber}</p>
                  <p><strong>Aquisição:</strong> {new Date(eq.acquisitionDate).toLocaleDateString("pt-BR")}</p>
                  {eq.lastMaintenance && (
                    <p><strong>Última Manutenção:</strong> {new Date(eq.lastMaintenance).toLocaleDateString("pt-BR")}</p>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => handleEditEquipment(eq.id)}>
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteEquipment(eq.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {labEquipment.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum equipamento cadastrado neste laboratório</p>
          </div>
        )}
      </div>

      {/* Maintenance Summary */}
      {labMaintenances.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Manutenções Recentes</h2>
          <div className="space-y-3">
            {labMaintenances.slice(0, 5).map((m) => (
              <Card key={m.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{m.equipmentName}</p>
                      <p className="text-xs text-muted-foreground">{m.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={m.type} />
                      <StatusBadge status={m.status} />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(m.scheduledDate).toLocaleDateString("pt-BR")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add Equipment Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Equipamento</DialogTitle>
            <DialogDescription>
              Adicione um novo equipamento ao laboratório {lab.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={newEquipment.name}
                onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="brand" className="text-right">
                Marca
              </Label>
              <Input
                id="brand"
                value={newEquipment.brand}
                onChange={(e) => setNewEquipment({ ...newEquipment, brand: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model" className="text-right">
                Modelo
              </Label>
              <Input
                id="model"
                value={newEquipment.model}
                onChange={(e) => setNewEquipment({ ...newEquipment, model: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serial" className="text-right">
                Número de Série
              </Label>
              <Input
                id="serial"
                value={newEquipment.serialNumber}
                onChange={(e) => setNewEquipment({ ...newEquipment, serialNumber: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={newEquipment.status} onValueChange={(value: EquipmentStatus) => setNewEquipment({ ...newEquipment, status: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operacional">Operacional</SelectItem>
                  <SelectItem value="em_manutencao">Em Manutenção</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="acquisition" className="text-right">
                Data de Aquisição
              </Label>
              <Input
                id="acquisition"
                type="date"
                value={newEquipment.acquisitionDate}
                onChange={(e) => setNewEquipment({ ...newEquipment, acquisitionDate: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveEquipment}>
              Salvar Equipamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Open Request Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Abrir Chamado de Manutenção</DialogTitle>
            <DialogDescription>
              Solicite manutenção para um equipamento do laboratório {lab.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="equipment" className="text-right">
                Equipamento
              </Label>
              <Select value={newRequest.equipmentId} onValueChange={(value) => setNewRequest({ ...newRequest, equipmentId: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione um equipamento" />
                </SelectTrigger>
                <SelectContent>
                  {labEquipment.map((eq) => (
                    <SelectItem key={eq.id} value={eq.id}>
                      {eq.name} - {eq.brand} {eq.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Tipo de Manutenção
              </Label>
              <Select value={newRequest.type} onValueChange={(value: MaintenanceType) => setNewRequest({ ...newRequest, type: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preventiva">Preventiva</SelectItem>
                  <SelectItem value="corretiva">Corretiva</SelectItem>
                  <SelectItem value="emergencial">Emergencial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="description"
                value={newRequest.description}
                onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                placeholder="Descreva o problema ou necessidade de manutenção..."
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveRequest}>
              Abrir Chamado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}