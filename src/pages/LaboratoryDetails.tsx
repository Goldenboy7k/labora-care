import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, ArrowLeft, Package, Wrench, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/StatusBadge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { laboratories, equipment, maintenances } from "@/data/mockData";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const statusConfig = {
  operacional: { label: "Operacional", variant: "default" as const },
  em_manutencao: { label: "Em Manutenção", variant: "secondary" as const },
  inativo: { label: "Inativo", variant: "destructive" as const },
};

export default function LaboratoryDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEquipment, setNewEquipment] = useState({
    name: "",
    brand: "",
    model: "",
    serialNumber: "",
    status: "operacional" as const,
    acquisitionDate: "",
  });

  const lab = laboratories.find((l) => l.id === id);
  if (!lab) {
    return <div>Laboratório não encontrado</div>;
  }

  const labEquipment = equipment.filter((eq) => eq.labId === id);
  const labMaintenances = maintenances.filter((m) => m.labId === id);

  const handleAddEquipment = () => {
    setIsAddDialogOpen(true);
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

    // Forçar re-render (em uma app real, o estado seria gerenciado globalmente)
    window.location.reload();
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
        <Button onClick={handleAddEquipment}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Equipamento
        </Button>
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
    </div>
  );
}