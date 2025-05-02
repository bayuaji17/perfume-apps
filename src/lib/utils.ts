import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatDate(date: string | Date): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return parsedDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatCurrency(amount: number | string): string {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(numericAmount);
}

const concentrationMap: Record<string, string> = {
  edp: "Eau de Parfum",
  edc: "Eau de Cologne",
  edt: "Eau de Toilette",
};

export const mapConcentration = (key: string) => concentrationMap[key] || key;

export const categoryPerfumes = [
  { id: "edt", label: "Eau de Toilette" },
  { id: "edc", label: "Eau de Cologne" },
  { id: "edp", label: "Eau de Parfum" },
];
export const gender = [
  { gender: "unisex" },
  { gender: "female" },
  { gender: "male" },
];
