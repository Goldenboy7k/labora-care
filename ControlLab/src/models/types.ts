export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'technician' | 'operator';
  createdAt?: string;
}

export interface Laboratory {
  id: string;
  name: string;
  icon: string;
  equipment_count: number;
  pending_maintenance: number;
  overdue_maintenance: number;
  created_at?: string;
}

export interface Equipment {
  id: string;
  name: string;
  brand: string;
  model: string;
  serial_number: string;
  lab_id: string;
  status: 'operacional' | 'em_manutencao' | 'inativo';
  acquisition_date: string;
  last_maintenance: string | null;
  created_at?: string;
}

export interface Maintenance {
  id: string;
  equipment_id: string;
  equipment_name: string;
  lab_id: string;
  type: 'preventiva' | 'corretiva';
  status: 'pendente' | 'em_andamento' | 'concluida' | 'atrasada';
  scheduled_date: string;
  completed_date: string | null;
  description: string;
  responsible: string;
  created_at?: string;
  updated_at?: string;
}
