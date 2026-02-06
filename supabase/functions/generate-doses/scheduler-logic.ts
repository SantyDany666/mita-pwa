import {
  addHours,
  addDays,
  addWeeks,
  addMonths,
  isBefore,
  setHours,
  setMinutes,
} from "npm:date-fns@2.30.0";

export interface ScheduleConfig {
  frequency: string;
  startTime: string;
}

export const generateDoseSchedule = (
  config: ScheduleConfig,
  startDate: Date,
  windowEnd: Date,
): Date[] => {
  const doses: Date[] = [];
  const start = new Date(startDate);
  const [startHour, startMinute] = config.startTime.split(":").map(Number);

  let current = new Date(start);

  if (config.frequency.endsWith("h") && !config.frequency.includes("days")) {
    const hours = parseInt(config.frequency.replace("h", ""));
    current = setMinutes(setHours(current, startHour), startMinute);
    while (isBefore(current, windowEnd)) {
      doses.push(new Date(current));
      current = addHours(current, hours);
    }
  } else if (config.frequency.startsWith("days:")) {
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
    current = setMinutes(setHours(current, startHour), startMinute);
    let iterations = 0;
    while (isBefore(current, windowEnd) && iterations < 365) {
      if (targetDayNums.includes(current.getDay())) {
        doses.push(new Date(current));
      }
      current = addDays(current, 1);
      iterations++;
    }
  } else if (config.frequency.startsWith("cycle:")) {
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
  return doses;
};
