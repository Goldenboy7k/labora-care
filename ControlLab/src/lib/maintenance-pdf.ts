import type { Maintenance } from "@/models/types";

/** Helvetica in jsPDF does not render all Portuguese glyphs reliably. */
function pdfSafeText(text: unknown): string {
  const s = text == null ? "" : String(text);
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function typeLabel(type: Maintenance["type"]): string {
  return type === "preventiva" ? "Preventiva" : "Corretiva";
}

function statusLabel(status: Maintenance["status"]): string {
  const map: Record<Maintenance["status"], string> = {
    pendente: "Pendente",
    em_andamento: "Em andamento",
    atrasada: "Atrasada",
    concluida: "Concluida",
  };
  return map[status] ?? String(status);
}

function formatDateTime(iso: string | null): string {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(iso);
  }
}

function formatDateOnly(iso: string): string {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    return d.toLocaleDateString("pt-BR");
  } catch {
    return String(iso);
  }
}

/**
 * Gera e baixa um PDF com o registro da manutenção (ordem de serviço concluída).
 * Carrega jsPDF sob demanda para não bloquear o carregamento inicial da aplicação.
 */
export async function downloadMaintenancePdf(
  maintenance: Maintenance,
  laboratoryName: string
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 18;
  const pageW = doc.internal.pageSize.getWidth();
  const maxTextW = pageW - margin * 2;
  let y = 18;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text(pdfSafeText("Labora Care - Relatorio de manutencao"), margin, y);
  y += 9;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(pdfSafeText("Ordem de servico / manutencao realizada"), margin, y);
  y += 10;

  doc.setFontSize(9);
  const rows: [string, string][] = [
    ["ID", maintenance.id],
    ["Equipamento", maintenance.equipment_name ?? ""],
    ["Laboratorio", laboratoryName || maintenance.lab_id || ""],
    ["Tipo", typeLabel(maintenance.type)],
    ["Status", statusLabel(maintenance.status)],
    ["Data agendada", formatDateOnly(maintenance.scheduled_date)],
    ["Data conclusao", formatDateTime(maintenance.completed_date)],
    ["Responsavel", maintenance.responsible || "-"],
  ];

  doc.setFont("helvetica", "bold");
  for (const [label, value] of rows) {
    doc.text(pdfSafeText(`${label}:`), margin, y);
    doc.setFont("helvetica", "normal");
    const wrapped = doc.splitTextToSize(pdfSafeText(value), maxTextW - 42);
    doc.text(wrapped, margin + 40, y);
    y += Math.max(6, wrapped.length * 5);
    doc.setFont("helvetica", "bold");
  }

  y += 4;
  doc.setFont("helvetica", "bold");
  doc.text(pdfSafeText("Descricao do servico:"), margin, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  const descLines = doc.splitTextToSize(pdfSafeText(maintenance.description ?? "-"), maxTextW);
  doc.text(descLines, margin, y);
  y += descLines.length * 5 + 8;

  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text(
    pdfSafeText(`Documento gerado em ${formatDateTime(new Date().toISOString())}`),
    margin,
    doc.internal.pageSize.getHeight() - 12
  );

  const rawId = maintenance.id ?? "manutencao";
  const fileSlug = String(rawId).replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 24) || "manutencao";
  doc.save(`manutencao-${fileSlug}.pdf`);
}
