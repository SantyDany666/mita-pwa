export type DurationMode = "forever" | "days" | "date";

export const parseLocalDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const getEstimate = (
  frequency: string,
  durationValue: number,
  durationUnit: "days",
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
  // If unit is days, simply multiply
  if (durationUnit === "days") {
    return Math.floor(dosesPerDay * durationValue);
  }

  return 0;
};

export const getDaysFromDate = (targetDate: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);

  const utc1 = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const utc2 = Date.UTC(
    target.getFullYear(),
    target.getMonth(),
    target.getDate(),
  );

  const diffTime = utc2 - utc1;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
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

  if (val.startsWith("days:")) {
    const days = val.replace("days:", "");
    return `Durante ${days} días`;
  }

  if (val.startsWith("date:")) {
    const dateStr = val.replace("date:", "");
    const date = parseLocalDate(dateStr);
    return `Hasta el ${formatDate(date)}`;
  }

  return val;
};
