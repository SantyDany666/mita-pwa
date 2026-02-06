import { addDays, addWeeks, addMonths, subDays } from "date-fns";

export type DurationMode = "forever" | "fixed" | "date";

export const parseLocalDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const getEstimate = (
  frequency: string,
  durationValue: number,
  durationUnit: "days" | "weeks" | "months",
): number => {
  if (!frequency || !durationValue) return 0;

  let dosesPerDay = 0;

  // Daily: "8h" -> 24/8 = 3
  if (frequency.endsWith("h") && !frequency.includes("days")) {
    const hours = parseInt(frequency.replace("h", ""));
    if (!isNaN(hours) && hours > 0) {
      dosesPerDay = 24 / hours;
    }
  }
  // Weekdays: "days:Mon,Wed" -> 2 days a week -> 2/7 doses per day avg
  else if (frequency.startsWith("days:")) {
    const count = frequency.replace("days:", "").split(",").length;
    dosesPerDay = count / 7;
  }
  // Cyclic: "cycle:2weeks" -> 1 dose every 14 days -> 1/14 per day
  else if (frequency.startsWith("cycle:")) {
    const match = frequency
      .replace("cycle:", "")
      .match(/^(\d+)(days|weeks|months)$/);
    if (match) {
      const num = parseInt(match[1]);
      const unit = match[2];
      let daysInCycle = num;
      if (unit === "weeks") daysInCycle = num * 7;
      if (unit === "months") daysInCycle = num * 30; // approx
      dosesPerDay = 1 / daysInCycle;
    }
  }

  // Calculate total
  let totalDays = 0;
  if (durationUnit === "days") totalDays = durationValue;
  else if (durationUnit === "weeks") totalDays = durationValue * 7;
  else if (durationUnit === "months") totalDays = durationValue * 30;

  if (totalDays > 0) {
    return Math.floor(dosesPerDay * totalDays);
  }

  return 0;
};

export const getDaysFromDate = (targetDate: Date, startDate?: Date): number => {
  const start = startDate ? new Date(startDate) : new Date();
  start.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);

  const utc1 = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const utc2 = Date.UTC(
    target.getFullYear(),
    target.getMonth(),
    target.getDate(),
  );

  const diffTime = utc2 - utc1;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  // Add 1 to make it inclusive (start day + diff)
  // e.g. Start Jan 1, Target Jan 5. Diff is 4 days. Inclusive count is 5 days.
  return diffDays >= 0 ? diffDays + 1 : 0;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const getDurationLabel = (val: string): string => {
  if (!val) return "Seleccionar duración";

  if (val === "forever") return "Inicia hoy, sin fecha de fin";

  if (val.startsWith("weeks:")) {
    const weeks = val.replace("weeks:", "");
    return `Durante ${weeks} ${parseInt(weeks) === 1 ? "semana" : "semanas"}`;
  }

  if (val.startsWith("months:")) {
    const months = val.replace("months:", "");
    return `Durante ${months} ${parseInt(months) === 1 ? "mes" : "meses"}`;
  }

  if (val.startsWith("days:")) {
    const days = val.replace("days:", "");
    return `Durante ${days} ${parseInt(days) === 1 ? "día" : "días"}`;
  }

  if (val.startsWith("date:")) {
    const dateStr = val.replace("date:", "");
    const date = parseLocalDate(dateStr);
    return `Hasta el ${formatDate(date)}`;
  }

  return val;
};

export const calculateEndDate = (
  startDate: string | Date,
  duration: string,
): Date | null => {
  if (!duration || duration === "forever") return null;

  const start =
    typeof startDate === "string" ? parseLocalDate(startDate) : startDate;

  if (duration.startsWith("date:")) {
    return parseLocalDate(duration.replace("date:", ""));
  }

  // For periods (days, weeks, months), the End Date is inclusive.
  // So "1 day" duration means End Date = Start Date.
  // "5 days" means End Date = Start + 4 days.

  if (duration.startsWith("days:")) {
    const days = parseInt(duration.replace("days:", ""));
    // If days=1, add 0. If days=5, add 4.
    return addDays(start, Math.max(0, days - 1));
  }

  if (duration.startsWith("weeks:")) {
    const weeks = parseInt(duration.replace("weeks:", ""));
    return subDays(addWeeks(start, weeks), 1);
  }

  if (duration.startsWith("months:")) {
    const months = parseInt(duration.replace("months:", ""));
    return subDays(addMonths(start, months), 1);
  }

  return null;
};
