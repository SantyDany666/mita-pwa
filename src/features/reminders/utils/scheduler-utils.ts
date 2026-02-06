import {
  addHours,
  addDays,
  addWeeks,
  addMonths,
  isBefore,
  setHours,
  setMinutes,
} from "date-fns";

export interface ScheduleConfig {
  frequency: string; // "8h", "days:Mon,Tue", "cycle:21days"
  startTime: string; // "08:00"
  // Potentially complex multi-time support could be added here later
}

/**
 * Generates an array of Date objects for scheduled doses within a window.
 */
export const generateDoseSchedule = (
  config: ScheduleConfig,
  startDate: Date,
  windowEnd: Date, // Usually startDate + 30 days, or End Date of treatment
): Date[] => {
  const doses: Date[] = [];
  const start = new Date(startDate);

  // Parse base start time
  const [startHour, startMinute] = config.startTime.split(":").map(Number);

  // Normalize start date with time if needed, but usually we iterate
  let current = new Date(start);

  // Ensure we start counting correctly.
  // If startDate is in the past, we might generate past doses too (which is fine, they'll be filtered or marked taken if creating from logs)

  // 1. INTERVAL MODE (e.g. "8h")
  if (config.frequency.endsWith("h") && !config.frequency.includes("days")) {
    const hours = parseInt(config.frequency.replace("h", ""));
    // Set initial time
    current = setMinutes(setHours(current, startHour), startMinute);

    while (isBefore(current, windowEnd)) {
      doses.push(new Date(current));
      current = addHours(current, hours);
    }
  }

  // 2. SPECIFIC DAYS MODE (e.g. "days:Mon,Wed")
  else if (config.frequency.startsWith("days:")) {
    const targetDays = config.frequency.replace("days:", "").split(",");
    const dayMap: Record<string, number> = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    };
    const targetDayNums = targetDays
      .map((d) => dayMap[d])
      .filter((n) => n !== undefined);

    // Normalize start time on current day
    current = setMinutes(setHours(current, startHour), startMinute);

    // Iterate day by day
    // Safety break: 365 iterations max to prevent infinite loops if window is huge
    let iterations = 0;
    while (isBefore(current, windowEnd) && iterations < 365) {
      if (targetDayNums.includes(current.getDay())) {
        doses.push(new Date(current));
      }
      current = addDays(current, 1);
      iterations++;
    }
  }

  // 3. CYCLIC MODE (e.g. "cycle:21days")
  else if (config.frequency.startsWith("cycle:")) {
    // "cycle:21days" -> Every 21 days
    // "cycle:2weeks" -> Every 14 days
    const match = config.frequency
      .replace("cycle:", "")
      .match(/^(\d+)(days|weeks|months)$/);
    if (match) {
      const num = parseInt(match[1]);
      const unit = match[2];

      current = setMinutes(setHours(current, startHour), startMinute);

      while (isBefore(current, windowEnd)) {
        doses.push(new Date(current));

        if (unit === "days") current = addDays(current, num);
        else if (unit === "weeks") current = addWeeks(current, num);
        else if (unit === "months") current = addMonths(current, num);
      }
    }
  }

  // 4. DAILY (Fallback or explicit "24h")
  // Usually handled by Interval loop above if format is "24h"
  // But if format is just "daily" (legacy?)

  return doses;
};
