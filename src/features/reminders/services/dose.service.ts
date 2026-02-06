import { supabase } from "@/lib/supabase";
import { Tables, TablesUpdate, Json } from "@/types/database.types";

export type DoseEvent = Tables<"dose_events">;
export type DoseEventUpdate = TablesUpdate<"dose_events">;

export const doseService = {
  /**
   * Get doses for a specific profile and date range
   */
  getByDateRange: async (
    profileId: string,
    start: Date,
    end: Date,
  ): Promise<(DoseEvent & { reminders: Tables<"reminders"> | null })[]> => {
    const { data, error } = await supabase
      .from("dose_events")
      .select("*, reminders(*)")
      .eq("profile_id", profileId)
      .gte("scheduled_at", start.toISOString())
      .lte("scheduled_at", end.toISOString())
      .order("scheduled_at", { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Get, pending doses before a specific date (Overdue)
   */
  getOverduePending: async (
    profileId: string,
    beforeDate: Date,
  ): Promise<(DoseEvent & { reminders: Tables<"reminders"> | null })[]> => {
    const { data, error } = await supabase
      .from("dose_events")
      .select("*, reminders(*)")
      .eq("profile_id", profileId)
      .eq("status", "pending")
      .lt("scheduled_at", beforeDate.toISOString())
      .order("scheduled_at", { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Mark a dose as taken and update inventory if applicable
   */
  markAsTaken: async (doseId: string): Promise<void> => {
    const now = new Date().toISOString();

    // 1. Get the dose and its reminder to check inventory
    const { data: dose, error: fetchError } = await supabase
      .from("dose_events")
      .select("*, reminders(*)")
      .eq("id", doseId)
      .single();

    if (fetchError || !dose) throw fetchError || new Error("Dose not found");

    // 2. Optimistic update of dose status
    const { error: updateError } = await supabase
      .from("dose_events")
      .update({
        status: "taken",
        taken_at: now,
      })
      .eq("id", doseId);

    if (updateError) throw updateError;

    // 3. Handle Inventory Decrement
    const reminder = dose.reminders;
    if (
      reminder &&
      reminder.stock_config &&
      typeof reminder.stock_config === "object"
    ) {
      // Cast safely since we know the shape from our schema analysis
      // But for DB types it's Json.
      const stockConfig = reminder.stock_config as {
        stock?: number;
        warningThreshold?: number;
      };

      if (
        stockConfig.stock !== undefined &&
        stockConfig.stock !== null &&
        stockConfig.stock > 0
      ) {
        const newStock = stockConfig.stock - 1;
        const newConfig = { ...stockConfig, stock: newStock };

        await supabase
          .from("reminders")
          .update({ stock_config: newConfig as unknown as Json })
          .eq("id", reminder.id);
      }
    }
  },

  /**
   * Mark a dose as skipped
   */
  markAsSkipped: async (id: string): Promise<void> => {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from("dose_events")
      .update({
        status: "skipped",
        taken_at: now, // Use taken_at to track when it was skipped
      })
      .eq("id", id);

    if (error) throw error;
  },

  /**
   * Snooze a dose (Reschedule)
   */
  snoozeDose: async (doseId: string, newDate: Date): Promise<void> => {
    const { error } = await supabase
      .from("dose_events")
      .update({
        scheduled_at: newDate.toISOString(),
        is_rescheduled: true,
      })
      .eq("id", doseId);

    if (error) throw error;
  },

  /**
   * Delete future pending doses for a specific reminder
   * Used when Pausing, Finishing, or Editing a reminder
   */
  deleteFuturePending: async (reminderId: string): Promise<void> => {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from("dose_events")
      .delete()
      .eq("reminder_id", reminderId)
      .eq("status", "pending")
      .gt("scheduled_at", now);

    if (error) throw error;
  },

  /**
   * Create and immediately take an SOS dose
   */
  createSosDose: async (
    reminderId: string,
    profileId: string,
  ): Promise<void> => {
    const now = new Date().toISOString();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    // 1. Get Reminder for Stock Config
    const { data: reminder, error: remError } = await supabase
      .from("reminders")
      .select("stock_config")
      .eq("id", reminderId)
      .single();

    if (remError || !reminder)
      throw remError || new Error("Reminder not found");

    // 2. Insert Dose Event
    const { error: insertError } = await supabase.from("dose_events").insert({
      reminder_id: reminderId,
      profile_id: profileId,
      user_id: user.id,
      scheduled_at: now,
      taken_at: now,
      status: "taken",
    });

    if (insertError) throw insertError;

    // 3. Handle Inventory Decrement
    if (reminder.stock_config && typeof reminder.stock_config === "object") {
      const stockConfig = reminder.stock_config as {
        stock?: number;
        warningThreshold?: number;
      };

      if (
        stockConfig.stock !== undefined &&
        stockConfig.stock !== null &&
        stockConfig.stock > 0
      ) {
        const newStock = stockConfig.stock - 1;
        const newConfig = { ...stockConfig, stock: newStock };

        await supabase
          .from("reminders")
          .update({ stock_config: newConfig as unknown as Json })
          .eq("id", reminderId);
      }
    }
  },
};
