import { supabase } from "@/lib/supabase";

export interface CreateMoodLogParams {
  userId: string;
  profileId: string;
  moodValue: number;
  note?: string;
}

class MoodService {
  async createMoodLog({ userId, profileId, moodValue, note }: CreateMoodLogParams): Promise<void> {
    const { error } = await supabase.from("mood_logs").insert({
      user_id: userId,
      profile_id: profileId,
      mood_value: moodValue,
      note: note || null,
    });

    if (error) {
      console.error("Error inserting mood log:", error);
      throw error;
    }
  }

  async getByDateRange(profileId: string, start: Date, end: Date) {
    const { data, error } = await supabase
      .from("mood_logs")
      .select("*")
      .eq("profile_id", profileId)
      .gte("created_at", start.toISOString())
      .lte("created_at", end.toISOString())
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }
}

export const moodService = new MoodService();
