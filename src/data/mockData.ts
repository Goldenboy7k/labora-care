export interface Laboratory {
  id: string;
  name: string;
  icon: string;
  equipmentCount: number;
  pendingMaintenance: number;
  overdueMaintenance: number;
}

export interface Equipment {
  id: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  labId: string;
  status: "operacional" | "em_manutencao" | "inativo";
  acquisitionDate: string;
  lastMaintenance: string | null;
}

export interface Maintenance {
  id: string;
  equipmentId: string;
  equipmentName: string;
  labId: string;
  type: "preventiva" | "corretiva";
  status: "pendente" | "em_andamento" | "concluida" | "atrasada";
  scheduledDate: string;
  completedDate: string | null;
  description: string;
  responsible: string;
}

export const laboratories: Laboratory[] = [
  { id: "eletrotecnica", name: "Eletrotécnica", icon: "Zap", equipmentCount: 24, pendingMaintenance: 3, overdueMaintenance: 1 },
  { id: "automacao", name: "Automação", icon: "Cpu", equipmentCount: 18, pendingMaintenance: 2, overdueMaintenance: 0 },
  { id: "pneumatica", name: "Pneumática", icon: "Wind", equipmentCount: 15, pendingMaintenance: 1, overdueMaintenance: 1 },
  { id: "logistica", name: "Logística", icon: "Truck", equipmentCount: 12, pendingMaintenance: 0, overdueMaintenance: 0 },
  { id: "usinagem", name: "Usinagem", icon: "Wrench", equipmentCount: 20, pendingMaintenance: 4, overdueMaintenance: 2 },
  { id: "quimica", name: "Química", icon: "FlaskConical", equipmentCount: 30, pendingMaintenance: 2, overdueMaintenance: 0 },
  { id: "predial", name: "Predial Elétrica", icon: "Building", equipmentCount: 16, pendingMaintenance: 1, overdueMaintenance: 1 },
];

export const equipment: Equipment[] = [
  { id: "eq-001", name: "Multímetro Digital", brand: "Fluke", model: "117", serialNumber: "SN-2024-001", labId: "eletrotecnica", status: "operacional", acquisitionDate: "2022-03-15", lastMaintenance: "2025-11-20" },
  { id: "eq-002", name: "Osciloscópio", brand: "Tektronix", model: "TBS1052C", serialNumber: "SN-2024-002", labId: "eletrotecnica", status: "operacional", acquisitionDate: "2021-08-10", lastMaintenance: "2025-10-05" },
  { id: "eq-003", name: "Fonte de Alimentação", brand: "Minipa", model: "MPL-3305M", serialNumber: "SN-2024-003", labId: "eletrotecnica", status: "em_manutencao", acquisitionDate: "2020-01-22", lastMaintenance: "2025-09-18" },
  { id: "eq-004", name: "CLP Siemens S7-1200", brand: "Siemens", model: "S7-1200", serialNumber: "SN-2024-004", labId: "automacao", status: "operacional", acquisitionDate: "2023-05-12", lastMaintenance: "2026-01-10" },
  { id: "eq-005", name: "Torno CNC", brand: "Romi", model: "GL 240M", serialNumber: "SN-2024-005", labId: "usinagem", status: "em_manutencao", acquisitionDate: "2019-11-30", lastMaintenance: "2025-08-22" },
  { id: "eq-006", name: "Bancada Pneumática", brand: "Festo", model: "MPS-PA", serialNumber: "SN-2024-006", labId: "pneumatica", status: "operacional", acquisitionDate: "2022-07-18", lastMaintenance: "2025-12-01" },
  { id: "eq-007", name: "Espectrofotômetro", brand: "Shimadzu", model: "UV-1900i", serialNumber: "SN-2024-007", labId: "quimica", status: "operacional", acquisitionDate: "2023-02-28", lastMaintenance: "2026-01-15" },
  { id: "eq-008", name: "Fresadora CNC", brand: "Romi", model: "D 800", serialNumber: "SN-2024-008", labId: "usinagem", status: "inativo", acquisitionDate: "2018-06-10", lastMaintenance: "2025-05-30" },
  { id: "eq-009", name: "Quadro de Comando", brand: "WEG", model: "QC-200", serialNumber: "SN-2024-009", labId: "predial", status: "operacional", acquisitionDate: "2021-09-05", lastMaintenance: "2025-11-12" },
  { id: "eq-010", name: "Empilhadeira Elétrica", brand: "Yale", model: "ERP16VT", serialNumber: "SN-2024-010", labId: "logistica", status: "operacional", acquisitionDate: "2022-12-01", lastMaintenance: "2026-02-01" },
];

export const maintenances: Maintenance[] = [
  { id: "mt-001", equipmentId: "eq-001", equipmentName: "Multímetro Digital", labId: "eletrotecnica", type: "preventiva", status: "pendente", scheduledDate: "2026-03-15", completedDate: null, description: "Calibração semestral do equipamento", responsible: "Carlos Silva" },
  { id: "mt-002", equipmentId: "eq-003", equipmentName: "Fonte de Alimentação", labId: "eletrotecnica", type: "corretiva", status: "em_andamento", scheduledDate: "2026-02-28", completedDate: null, description: "Reparo no regulador de tensão", responsible: "André Santos" },
  { id: "mt-003", equipmentId: "eq-005", equipmentName: "Torno CNC", labId: "usinagem", type: "corretiva", status: "atrasada", scheduledDate: "2026-02-10", completedDate: null, description: "Substituição do eixo principal", responsible: "Roberto Lima" },
  { id: "mt-004", equipmentId: "eq-006", equipmentName: "Bancada Pneumática", labId: "pneumatica", type: "preventiva", status: "pendente", scheduledDate: "2026-03-20", completedDate: null, description: "Verificação de vedações e conexões", responsible: "Lucas Oliveira" },
  { id: "mt-005", equipmentId: "eq-008", equipmentName: "Fresadora CNC", labId: "usinagem", type: "corretiva", status: "atrasada", scheduledDate: "2026-01-25", completedDate: null, description: "Diagnóstico de falha no painel eletrônico", responsible: "Roberto Lima" },
  { id: "mt-006", equipmentId: "eq-002", equipmentName: "Osciloscópio", labId: "eletrotecnica", type: "preventiva", status: "concluida", scheduledDate: "2026-01-20", completedDate: "2026-01-18", description: "Calibração e verificação de ponteiras", responsible: "Carlos Silva" },
  { id: "mt-007", equipmentId: "eq-004", equipmentName: "CLP Siemens S7-1200", labId: "automacao", type: "preventiva", status: "pendente", scheduledDate: "2026-04-01", completedDate: null, description: "Atualização de firmware e backup de programa", responsible: "Fernanda Costa" },
  { id: "mt-008", equipmentId: "eq-009", equipmentName: "Quadro de Comando", labId: "predial", type: "preventiva", status: "atrasada", scheduledDate: "2026-02-15", completedDate: null, description: "Inspeção termográfica e reaperto de conexões", responsible: "Marcos Almeida" },
  { id: "mt-009", equipmentId: "eq-007", equipmentName: "Espectrofotômetro", labId: "quimica", type: "preventiva", status: "pendente", scheduledDate: "2026-03-25", completedDate: null, description: "Calibração com padrões de referência", responsible: "Ana Beatriz" },
  { id: "mt-010", equipmentId: "eq-010", equipmentName: "Empilhadeira Elétrica", labId: "logistica", type: "preventiva", status: "concluida", scheduledDate: "2026-02-01", completedDate: "2026-02-01", description: "Revisão de bateria e sistema hidráulico", responsible: "Paulo Henrique" },
];
