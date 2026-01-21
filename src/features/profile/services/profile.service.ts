import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";
import { ProfileData } from "../schemas/profile-schemas";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const profileService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data;
  },

  async createProfile(profileData: ProfileData) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado");

    // Parse DD/MM/YYYY to Date format (YYYY-MM-DD)
    const [day, month, year] = profileData.dob.split("/").map(Number);
    const dob = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const payload = {
      user_id: user.id,
      name: profileData.name,
      dob,
      gender: profileData.gender,
      weight: profileData.weight ? Number(profileData.weight) : null,
      height: profileData.height ? Number(profileData.height) : null,
      allergies: profileData.allergies || null,
      additional_info: profileData.additional_info || null,
    };

    const { data, error } = await supabase
      .from("profiles")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
