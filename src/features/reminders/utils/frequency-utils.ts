export type FrequencyMode = "daily" | "weekdays" | "cyclic" | "sos";

export const INTERVAL_OPTIONS = [
  { label: "Cada 4 h", value: "4h", detail: "6 veces al día" },
  { label: "Cada 6 h", value: "6h", detail: "4 veces al día" },
  { label: "Cada 8 h", value: "8h", detail: "3 veces al día" },
  { label: "Cada 12 h", value: "12h", detail: "2 veces al día" },
  { label: "Cada 24 h", value: "24h", detail: "1 vez al día" },
];

export const WEEK_DAYS = [
  { label: "L", value: "Mon", full: "Lunes" },
  { label: "M", value: "Tue", full: "Martes" },
  { label: "X", value: "Wed", full: "Miércoles" },
  { label: "J", value: "Thu", full: "Jueves" },
  { label: "V", value: "Fri", full: "Viernes" },
  { label: "S", value: "Sat", full: "Sábado" },
  { label: "D", value: "Sun", full: "Domingo" },
];

export const getFrequencyLabel = (val: string): string => {
  if (!val) return "Seleccionar frecuencia";
  if (val === "sos") return "Solo si es necesario";

  // Daily intervals (e.g. "4h", "24h")
  if (val.endsWith("h") && !val.includes("days")) {
    const hours = val.replace("h", "");
    return `Cada ${hours} horas`;
  }

  // Weekdays (e.g. "days:Mon,Wed")
  if (val.startsWith("days:")) {
    const daysStr = val.replace("days:", "");
    const days = daysStr.split(",");
    const labels = days.map(
      (d) => WEEK_DAYS.find((w) => w.value === d)?.label || d,
    );
    return labels.join(", ");
  }

  // Cyclic (e.g. "cycle:2weeks")
  if (val.startsWith("cycle:")) {
    const content = val.replace("cycle:", ""); // "2weeks"
    const match = content.match(/^(\d+)(days|weeks|months)$/);
    if (match) {
      const numRaw = match[1];
      const unit = match[2];
      const num = parseInt(numRaw);

      const unitMap: Record<string, string> = {
        days: "días",
        weeks: "semanas",
        months: "meses",
      };

      let unitLabel = unitMap[unit];

      if (num === 1) {
        if (unit === "days") unitLabel = "día";
        else if (unit === "weeks") unitLabel = "semana";
        else if (unit === "months") unitLabel = "mes";
      }

      return `Cada ${num} ${unitLabel}`;
    }
    return val;
  }

  // Fallback
  const known = INTERVAL_OPTIONS.find((opt) => opt.value === val);
  return known ? known.label : val;
};
