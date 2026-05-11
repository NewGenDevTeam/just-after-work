import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string) {
  if (!dateStr) return "";

  let date: Date;

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    // dd/mm/yyyy — ACF text field format (e.g. "03/04/2026" → Apr 3 2026)
    const [day, month, year] = dateStr.split("/").map(Number);
    date = new Date(year, month - 1, day);
  } else if (/^\d{8}$/.test(dateStr)) {
    // YYYYMMDD — ACF date picker format (e.g. "20260403" → Apr 3 2026)
    date = new Date(+dateStr.slice(0, 4), +dateStr.slice(4, 6) - 1, +dateStr.slice(6, 8));
  } else {
    // ISO 8601 or WP default date string
    date = new Date(dateStr);
  }

  if (isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
