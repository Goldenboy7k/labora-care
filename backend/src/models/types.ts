export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'technician' | 'operator';
  createdAt: string;
}

export interface Laboratory {
  id: string;
  name: string;
  icon: string;
  equipmentCount: number;
  pendingMaintenance: number;
  overdueMaintenance: number;
  createdAt: string;
}

export interface Equipment {
  id: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  labId: string;
  status: 'operacional' | 'em_manutencao' | 'inativo';
  acquisitionDate: string;
  lastMaintenance: string | null;
  createdAt: string;
}

export interface Maintenance {
  id: string;
  equipmentId: string;
  equipmentName: string;
  labId: string;
  type: 'preventiva' | 'corretiva';
  status: 'pendente' | 'em_andamento' | 'concluida' | 'atrasada';
  scheduledDate: string;
  completedDate: string | null;
  description: string;
  responsible: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
