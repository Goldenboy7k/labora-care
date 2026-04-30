export interface Laboratory {
  id: string;
  name: string;
  icon: string;
  equipment_count: number;
  pending_maintenance: number;
  overdue_maintenance: number;
}

export interface Equipment {
  id: string;
  name: string;
  brand: string;
  model: string;
  serial_number: string;
  lab_id: string;
  status: "operacional" | "em_manutencao" | "inativo";
  acquisition_date: string;
  last_maintenance: string | null;
}

export interface Maintenance {
  id: string;
  equipment_id: string;
  equipment_name: string;
  lab_id: string;
  type: "preventiva" | "corretiva";
  status: "pendente" | "em_andamento" | "concluida" | "atrasada";
  scheduled_date: string;
  completed_date: string | null;
  description: string;
  responsible: string;
}

export const laboratories: Laboratory[] = [
  { id: "eletrotecnica", name: "Eletrotécnica", icon: "Zap", equipment_count: 24, pending_maintenance: 3, overdue_maintenance: 1 },
  { id: "automacao", name: "Automação", icon: "Cpu", equipment_count: 18, pending_maintenance: 2, overdue_maintenance: 0 },
  { id: "pneumatica", name: "Pneumática", icon: "Wind", equipment_count: 15, pending_maintenance: 1, overdue_maintenance: 1 },
  { id: "logistica", name: "Logística", icon: "Truck", equipment_count: 12, pending_maintenance: 0, overdue_maintenance: 0 },
  { id: "usinagem", name: "Usinagem", icon: "Wrench", equipment_count: 20, pending_maintenance: 4, overdue_maintenance: 2 },
  { id: "quimica", name: "Química", icon: "FlaskConical", equipment_count: 30, pending_maintenance: 2, overdue_maintenance: 0 },
  { id: "predial", name: "Predial Elétrica", icon: "Building", equipment_count: 16, pending_maintenance: 1, overdue_maintenance: 1 },
];

export const equipment: Equipment[] = [
  { id: "eq-001", name: "Multímetro Digital", brand: "Fluke", model: "117", serial_number: "SN-2024-001", lab_id: "eletrotecnica", status: "operacional", acquisition_date: "2022-03-15", last_maintenance: "2025-11-20" },
  { id: "eq-002", name: "Osciloscópio", brand: "Tektronix", model: "TBS1052C", serial_number: "SN-2024-002", lab_id: "eletrotecnica", status: "operacional", acquisition_date: "2021-08-10", last_maintenance: "2025-10-05" },
  { id: "eq-003", name: "Fonte de Alimentação", brand: "Minipa", model: "MPL-3305M", serial_number: "SN-2024-003", lab_id: "eletrotecnica", status: "em_manutencao", acquisition_date: "2020-01-22", last_maintenance: "2025-09-18" },
  { id: "eq-004", name: "CLP Siemens S7-1200", brand: "Siemens", model: "S7-1200", serial_number: "SN-2024-004", lab_id: "automacao", status: "operacional", acquisition_date: "2023-05-12", last_maintenance: "2026-01-10" },
  { id: "eq-005", name: "Torno CNC", brand: "Romi", model: "GL 240M", serial_number: "SN-2024-005", lab_id: "usinagem", status: "em_manutencao", acquisition_date: "2019-11-30", last_maintenance: "2025-08-22" },
  { id: "eq-006", name: "Bancada Pneumática", brand: "Festo", model: "MPS-PA", serial_number: "SN-2024-006", lab_id: "pneumatica", status: "operacional", acquisition_date: "2022-07-18", last_maintenance: "2025-12-01" },
  { id: "eq-007", name: "Espectrofotômetro", brand: "Shimadzu", model: "UV-1900i", serial_number: "SN-2024-007", lab_id: "quimica", status: "operacional", acquisition_date: "2023-02-28", last_maintenance: "2026-01-15" },
  { id: "eq-008", name: "Fresadora CNC", brand: "Romi", model: "D 800", serial_number: "SN-2024-008", lab_id: "usinagem", status: "inativo", acquisition_date: "2018-06-10", last_maintenance: "2025-05-30" },
  { id: "eq-009", name: "Quadro de Comando", brand: "WEG", model: "QC-200", serial_number: "SN-2024-009", lab_id: "predial", status: "operacional", acquisition_date: "2021-09-05", last_maintenance: "2025-11-12" },
  { id: "eq-010", name: "Empilhadeira Elétrica", brand: "Yale", model: "ERP16VT", serial_number: "SN-2024-010", lab_id: "logistica", status: "operacional", acquisition_date: "2022-12-01", last_maintenance: "2026-02-01" },
];

export const maintenances: Maintenance[] = [
  { id: "mt-001", equipment_id: "eq-001", equipment_name: "Multímetro Digital", lab_id: "eletrotecnica", type: "preventiva", status: "pendente", scheduled_date: "2026-03-15", completed_date: null, description: "Calibração semestral do equipamento", responsible: "Carlos Silva" },
  { id: "mt-002", equipment_id: "eq-003", equipment_name: "Fonte de Alimentação", lab_id: "eletrotecnica", type: "corretiva", status: "em_andamento", scheduled_date: "2026-02-28", completed_date: null, description: "Reparo no regulador de tensão", responsible: "André Santos" },
  { id: "mt-003", equipment_id: "eq-005", equipment_name: "Torno CNC", lab_id: "usinagem", type: "corretiva", status: "atrasada", scheduled_date: "2026-02-10", completed_date: null, description: "Substituição do eixo principal", responsible: "Roberto Lima" },
  { id: "mt-004", equipment_id: "eq-006", equipment_name: "Bancada Pneumática", lab_id: "pneumatica", type: "preventiva", status: "pendente", scheduled_date: "2026-03-20", completed_date: null, description: "Verificação de vedações e conexões", responsible: "Lucas Oliveira" },
  { id: "mt-005", equipment_id: "eq-008", equipment_name: "Fresadora CNC", lab_id: "usinagem", type: "corretiva", status: "atrasada", scheduled_date: "2026-01-25", completed_date: null, description: "Diagnóstico de falha no painel eletrônico", responsible: "Roberto Lima" },
  { id: "mt-006", equipment_id: "eq-002", equipment_name: "Osciloscópio", lab_id: "eletrotecnica", type: "preventiva", status: "concluida", scheduled_date: "2026-01-20", completed_date: "2026-01-18", description: "Calibração e verificação de ponteiras", responsible: "Carlos Silva" },
  { id: "mt-007", equipment_id: "eq-004", equipment_name: "CLP Siemens S7-1200", lab_id: "automacao", type: "preventiva", status: "pendente", scheduled_date: "2026-04-01", completed_date: null, description: "Atualização de firmware e backup de programa", responsible: "Fernanda Costa" },
  { id: "mt-008", equipment_id: "eq-009", equipment_name: "Quadro de Comando", lab_id: "predial", type: "preventiva", status: "atrasada", scheduled_date: "2026-02-15", completed_date: null, description: "Inspeção termográfica e reaperto de conexões", responsible: "Marcos Almeida" },
  { id: "mt-009", equipment_id: "eq-007", equipment_name: "Espectrofotômetro", lab_id: "quimica", type: "preventiva", status: "pendente", scheduled_date: "2026-03-25", completed_date: null, description: "Calibração com padrões de referência", responsible: "Ana Beatriz" },
  { id: "mt-010", equipment_id: "eq-010", equipment_name: "Empilhadeira Elétrica", lab_id: "logistica", type: "preventiva", status: "concluida", scheduled_date: "2026-02-01", completed_date: "2026-02-01", description: "Revisão de bateria e sistema hidráulico", responsible: "Paulo Henrique" },
];
