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
}

export const moodService = new MoodService();
