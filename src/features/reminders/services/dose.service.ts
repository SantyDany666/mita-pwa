import { supabase } from "@/lib/supabase";
import { Tables, TablesUpdate, Json } from "@/types/database.types";

export type DoseEvent = Tables<"dose_events">;
export type DoseEventUpdate = TablesUpdate<"dose_events">;

export const doseService = {
  /**
   * Get a specific dose event by ID, including its reminder data.
   */
  getById: async (
    doseId: string,
  ): Promise<DoseEvent & { reminders: Tables<"reminders"> | null }> => {
    const { data, error } = await supabase
      .from("dose_events")
      .select("*, reminders(*)")
      .eq("id", doseId)
      .single();

    if (error) throw error;
    if (!data) throw new Error("Dose not found");
    return data;
  },

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
   * Get past doses that are either pending (Overdue)
   * or were resolved (taken/skipped) today.
   */
  getPastDosesRelevantToday: async (
    profileId: string,
    startOfToday: Date,
  ): Promise<(DoseEvent & { reminders: Tables<"reminders"> | null })[]> => {
    const { data, error } = await supabase
      .from("dose_events")
      .select("*, reminders(*)")
      .eq("profile_id", profileId)
      .lt("scheduled_at", startOfToday.toISOString())
      .or(
        `status.eq.pending,and(status.in.(taken,skipped),taken_at.gte.${startOfToday.toISOString()})`,
      )
      .order("scheduled_at", { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Mark a dose as taken and update inventory if applicable.
   * Modulo returning an alert trigger object if stock gets dangerously low.
   */
  markAsTaken: async (
    doseId: string,
  ): Promise<{
    triggerInventoryAlert: boolean;
    medicineName?: string;
    remainingStock?: number;
  }> => {
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
        stockThreshold?: number;
        stockAlertEnabled?: boolean;
        lowStockAlertSent?: boolean;
      };

      if (
        stockConfig.stock !== undefined &&
        stockConfig.stock !== null &&
        stockConfig.stock > 0
      ) {
        const newStock = stockConfig.stock - 1;

        let shouldTriggerAlert = false;
        let newAlertSentFlag = stockConfig.lowStockAlertSent || false;

        // Check against threshold if alert is enabled
        if (
          stockConfig.stockAlertEnabled &&
          stockConfig.stockThreshold !== undefined &&
          newStock <= stockConfig.stockThreshold &&
          !stockConfig.lowStockAlertSent
        ) {
          shouldTriggerAlert = true;
          newAlertSentFlag = true; // Mark as sent to avoid spam
        }

        const newConfig = {
          ...stockConfig,
          stock: newStock,
          lowStockAlertSent: newAlertSentFlag,
        };

        await supabase
          .from("reminders")
          .update({ stock_config: newConfig as unknown as Json })
          .eq("id", reminder.id);

        if (shouldTriggerAlert) {
          return {
            triggerInventoryAlert: true,
            medicineName: reminder.medicine_name,
            remainingStock: newStock,
          };
        }
      }
    }

    return { triggerInventoryAlert: false };
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
   * Revert a dose status to pending (Undo Take/Skip)
   * Handles stock restoration if it was taken.
   */
  markAsPending: async (doseId: string): Promise<void> => {
    // 1. Get the current dose state to check if we need to restore stock
    const { data: dose, error: fetchError } = await supabase
      .from("dose_events")
      .select("*, reminders(*)")
      .eq("id", doseId)
      .single();

    if (fetchError || !dose) throw fetchError || new Error("Dose not found");

    // 2. Restore stock if it was "taken" and has stock config
    if (dose.status === "taken") {
      const reminder = dose.reminders;
      if (
        reminder &&
        reminder.stock_config &&
        typeof reminder.stock_config === "object"
      ) {
        const stockConfig = reminder.stock_config as {
          stock?: number;
          warningThreshold?: number;
        };

        if (stockConfig.stock !== undefined && stockConfig.stock !== null) {
          const newStock = stockConfig.stock + 1; // Increment stock
          const newConfig = { ...stockConfig, stock: newStock };

          await supabase
            .from("reminders")
            .update({ stock_config: newConfig as unknown as Json })
            .eq("id", reminder.id);
        }
      }
    }

    // 3. Update dose status to pending
    const { error: updateError } = await supabase
      .from("dose_events")
      .update({
        status: "pending",
        taken_at: null,
      })
      .eq("id", doseId);

    if (updateError) throw updateError;
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
  ): Promise<{
    triggerInventoryAlert: boolean;
    medicineName?: string;
    remainingStock?: number;
  }> => {
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
        stockThreshold?: number;
        stockAlertEnabled?: boolean;
        lowStockAlertSent?: boolean;
      };

      if (
        stockConfig.stock !== undefined &&
        stockConfig.stock !== null &&
        stockConfig.stock > 0
      ) {
        const newStock = stockConfig.stock - 1;

        let shouldTriggerAlert = false;
        let newAlertSentFlag = stockConfig.lowStockAlertSent || false;

        // Check against threshold if alert is enabled
        if (
          stockConfig.stockAlertEnabled &&
          stockConfig.stockThreshold !== undefined &&
          newStock <= stockConfig.stockThreshold &&
          !stockConfig.lowStockAlertSent
        ) {
          shouldTriggerAlert = true;
          newAlertSentFlag = true; // Mark as sent to avoid spam
        }

        const newConfig = {
          ...stockConfig,
          stock: newStock,
          lowStockAlertSent: newAlertSentFlag,
        };

        await supabase
          .from("reminders")
          .update({ stock_config: newConfig as unknown as Json })
          .eq("id", reminderId);

        if (shouldTriggerAlert) {
          // Because reminder single select does not return medicine_name in original code,
          // We need an additional fetch or just return standard "Medicamento"
          const { data: reminderData } = await supabase
            .from("reminders")
            .select("medicine_name")
            .eq("id", reminderId)
            .single();

          return {
            triggerInventoryAlert: true,
            medicineName: reminderData?.medicine_name || "Medicamento",
            remainingStock: newStock,
          };
        }
      }
    }

    return { triggerInventoryAlert: false };
  },
};
