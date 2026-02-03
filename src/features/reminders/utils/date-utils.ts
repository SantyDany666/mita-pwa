import { format, isToday, isTomorrow, startOfToday } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Returns a user-friendly label for a date string (YYYY-MM-DD).
 * Examples: "Hoy", "Mañana", "Lun 12 Oct"
 */
export function getSmartDateLabel(dateStr: string): string {
  if (!dateStr) return "Seleccionar fecha";

  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (isToday(date)) {
    return "Hoy";
  }

  if (isTomorrow(date)) {
    return "Mañana";
  }

  const formatted = format(date, "EEE d MMM", { locale: es });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

/**
 * Returns today's date in YYYY-MM-DD format
 */
export function getTodayString(): string {
  return format(startOfToday(), "yyyy-MM-dd");
}

/**
 * Returns tomorrow's date in YYYY-MM-DD format
 */
export function getTomorrowString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return format(tomorrow, "yyyy-MM-dd");
}
