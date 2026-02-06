import { supabase } from "@/lib/supabase";
import { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";

export type Reminder = Tables<"reminders">;
export type ReminderInsert = TablesInsert<"reminders">;
export type ReminderUpdate = TablesUpdate<"reminders">;

export const reminderService = {
  /**
   * Get all active reminders for a specific profile
   */
  getAllByProfile: async (profileId: string): Promise<Reminder[]> => {
    const { data, error } = await supabase
      .from("reminders")
      .select("*")
      .eq("profile_id", profileId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get all active SOS reminders
   */
  getSosReminders: async (profileId: string): Promise<Reminder[]> => {
    const { data, error } = await supabase
      .from("reminders")
      .select("*")
      .eq("profile_id", profileId)
      .is("deleted_at", null)
      .neq("status", "finished")
      // Check JSON field schedule_config->frequency.
      // Note: Arrow operator ->> returns text.
      .eq("schedule_config->>frequency", "sos")
      .order("medicine_name", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get a single reminder by ID
   */
  getById: async (id: string): Promise<Reminder | null> => {
    const { data, error } = await supabase
      .from("reminders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create a new reminder
   */
  create: async (reminder: ReminderInsert): Promise<Reminder> => {
    const { data, error } = await supabase
      .from("reminders")
      .insert(reminder)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update an existing reminder
   * Note: This usually triggers a regeneration of future doses
   */
  update: async (id: string, updates: ReminderUpdate): Promise<Reminder> => {
    const { data, error } = await supabase
      .from("reminders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update status (Pause / Finish / Resume)
   */
  updateStatus: async (
    id: string,
    status: "active" | "paused" | "finished",
  ): Promise<Reminder> => {
    const { data, error } = await supabase
      .from("reminders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Soft delete a reminder
   */
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("reminders")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
  },
};
