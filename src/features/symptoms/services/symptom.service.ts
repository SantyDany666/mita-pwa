import { supabase } from "@/lib/supabase";

export interface CreateSymptomLogParams {
  userId: string;
  profileId: string;
  symptom: string;
  intensity: number;
  note?: string;
}

class SymptomService {
  async createSymptomLog({
    userId,
    profileId,
    symptom,
    intensity,
    note,
  }: CreateSymptomLogParams): Promise<void> {
    const { error } = await supabase.from("symptom_logs").insert({
      user_id: userId,
      profile_id: profileId,
      symptom,
      intensity,
      note: note || null,
    });

    if (error) {
      console.error("Error inserting symptom log:", error);
      throw error;
    }
  }

  async getByDateRange(profileId: string, start: Date, end: Date) {
    const { data, error } = await supabase
      .from("symptom_logs")
      .select("*")
      .eq("profile_id", profileId)
      .gte("created_at", start.toISOString())
      .lte("created_at", end.toISOString())
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }
}

export const symptomService = new SymptomService();
