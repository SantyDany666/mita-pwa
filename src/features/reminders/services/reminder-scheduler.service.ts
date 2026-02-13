import { addDays, parseISO, format, isBefore } from "date-fns";
import {
  reminderService,
  ReminderInsert,
  ReminderUpdate,
} from "./reminder.service";
import { doseService } from "./dose.service";
import { generateDoseSchedule, ScheduleConfig } from "../utils/scheduler-utils";
import { supabase } from "@/lib/supabase";

/**
 * Orchestrator service that handles the Logic + Data persistence
 * for Reminders and their associated Dose Events.
 */
export const reminderSchedulerService = {
  /**
   * Create a new reminder and generate initial doses (Rolling Window: 30 days)
   */
  createReminder: async (
    reminderData: ReminderInsert,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _doseLogs?: Record<string, "taken" | "skipped">, // Historical logs - TODO: Implement log matching logic
  ) => {
    // 1. Create the Reminder
    const reminder = await reminderService.create(reminderData);

    // 2. Determine Generation Window
    // Start: config.start_date
    // End must be relative to START DATE, not Today.
    // This allows future reminders to successfully generate their first 30 days.
    const startDate = parseISO(reminder.start_date);
    const windowEnd = addDays(startDate, 30); // Generate for 30 days starting from Start Date

    // Cap at end_date if it exists
    let finalEnd = windowEnd;
    if (reminder.end_date) {
      const endDate = parseISO(reminder.end_date);
      if (endDate < windowEnd) {
        finalEnd = endDate;
      }
    }

    // Ensure we include the end of the last day by moving to the next day's start (exclusive upper bound)
    finalEnd = addDays(finalEnd, 1);

    // 3. Generate Dates
    const config = reminder.schedule_config as unknown as ScheduleConfig;
    const doseDates = generateDoseSchedule(config, startDate, finalEnd);

    // 4. Prepare Dose Events
    // Check against doseLogs to mark past doses as taken/skipped
    const eventsToInsert = doseDates.map((date) => {
      let status: "pending" | "taken" | "skipped" = "pending";
      let takenAt: string | null = null;

      if (_doseLogs) {
        // Match key format from DailyConfig: "yyyy-MM-dd'T'HH:mm"
        const key = format(date, "yyyy-MM-dd'T'HH:mm");
        if (_doseLogs[key]) {
          status = _doseLogs[key];
          if (status === "taken") {
            takenAt = date.toISOString();
            // Ensure status is valid for DB (tables types might restrict this)
            // If DB only accepts 'pending'|'taken'|'skipped', this is fine.
          }
        }
      }

      return {
        reminder_id: reminder.id,
        user_id: reminder.user_id,
        profile_id: reminder.profile_id,
        scheduled_at: date.toISOString(),
        status,
        taken_at: takenAt,
      };
    });

    if (eventsToInsert.length > 0) {
      const { error } = await supabase
        .from("dose_events")
        .insert(eventsToInsert);
      if (error) throw error;
    }

    return reminder;
  },

  /**
   * Update a reminder and regenerate future doses
   */
  updateReminder: async (id: string, updates: ReminderUpdate) => {
    // 1. Update the Reminder
    const reminder = await reminderService.update(id, updates);

    // 2. Clean up future pending doses
    await doseService.deleteFuturePending(id);

    // 3. Regenerate from NOW -> +30 days
    if (reminder.status !== "active") return reminder; // Don't generate if paused/finished

    const now = new Date();
    // Use StartDate as base if it's in the future, otherwise use Now
    const startDate = parseISO(reminder.start_date);
    const generationStart = isBefore(startDate, now) ? now : startDate;

    const windowEnd = addDays(generationStart, 30);

    let finalEnd = windowEnd;
    if (reminder.end_date) {
      const endDate = parseISO(reminder.end_date);
      if (endDate < windowEnd) {
        finalEnd = endDate;
      }
    }

    // Ensure we include the end of the last day by moving to the next day's start (exclusive upper bound)
    finalEnd = addDays(finalEnd, 1);

    // 4. Generate Dates
    const config = reminder.schedule_config as unknown as ScheduleConfig;
    const doseDates = generateDoseSchedule(config, generationStart, finalEnd);

    // Filter out doses strictly in the past (tolerance of 1 minute)
    // This prevents generating a dose for "Today 8:00 AM" if it is currently "Today 3:00 PM"
    const validDoses = doseDates.filter((d) => d > addDays(new Date(), -1)); // Simple check, refine if needed

    const eventsToInsert = validDoses
      .filter((date) => date > now) // Strict check: only future doses
      .map((date) => ({
        reminder_id: reminder.id,
        user_id: reminder.user_id,
        profile_id: reminder.profile_id,
        scheduled_at: date.toISOString(),
        status: "pending",
      }));

    if (eventsToInsert.length > 0) {
      const { error } = await supabase
        .from("dose_events")
        .insert(eventsToInsert);
      if (error) throw error;
    }

    return reminder;
  },

  /**
   * Pause a reminder: Update status + Delete future pending doses
   */
  pauseReminder: async (id: string) => {
    await reminderService.updateStatus(id, "paused");
    await doseService.deleteFuturePending(id);
  },

  /**
   * Finish a reminder: Update status + Delete future pending doses
   */
  finishReminder: async (id: string) => {
    await reminderService.updateStatus(id, "finished");
    await doseService.deleteFuturePending(id);
  },

  /**
   * Resume a reminder: Update status + Regenerate from Now
   */
  resumeReminder: async (id: string) => {
    const reminder = await reminderService.updateStatus(id, "active");

    // Regenerate
    const now = new Date();
    // Use StartDate if future, otherwise Now
    const startDate = parseISO(reminder.start_date);
    const generationStart = isBefore(startDate, now) ? now : startDate;

    const windowEnd = addDays(generationStart, 30);

    let finalEnd = windowEnd;
    if (reminder.end_date) {
      const endDate = parseISO(reminder.end_date);
      if (endDate < windowEnd) {
        finalEnd = endDate;
      }
    }

    // Ensure we include the end of the last day by moving to the next day's start (exclusive upper bound)
    finalEnd = addDays(finalEnd, 1);

    const config = reminder.schedule_config as unknown as ScheduleConfig;
    const doseDates = generateDoseSchedule(config, generationStart, finalEnd);

    const eventsToInsert = doseDates
      .filter((date) => date > now) // Strict check: only future doses
      .map((date) => ({
        reminder_id: reminder.id,
        user_id: reminder.user_id,
        profile_id: reminder.profile_id,
        scheduled_at: date.toISOString(),
        status: "pending",
      }));

    if (eventsToInsert.length > 0) {
      const { error } = await supabase
        .from("dose_events")
        .insert(eventsToInsert);
      if (error) throw error;
    }
  },

  /**
   * Delete a reminder (Soft Delete) + Delete future pending doses
   */
  deleteReminder: async (id: string) => {
    await reminderService.delete(id);
    await doseService.deleteFuturePending(id);
  },
};
