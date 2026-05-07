import type { WasteType } from "../db/wasteRecords";

export const WASTE_LABELS: Record<WasteType, string> = {
  plastic: "Plástico",
  paper: "Papel",
  metal: "Metal",
  glass: "Vidrio",
};

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateFull(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
