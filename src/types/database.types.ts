export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      dose_events: {
        Row: {
          id: string;
          is_rescheduled: boolean | null;
          profile_id: string | null;
          reminder_id: string;
          scheduled_at: string;
          status: string;
          taken_at: string | null;
          user_id: string;
        };
        Insert: {
          id?: string;
          is_rescheduled?: boolean | null;
          profile_id?: string | null;
          reminder_id: string;
          scheduled_at: string;
          status?: string;
          taken_at?: string | null;
          user_id: string;
        };
        Update: {
          id?: string;
          is_rescheduled?: boolean | null;
          profile_id?: string | null;
          reminder_id?: string;
          scheduled_at?: string;
          status?: string;
          taken_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "dose_events_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "dose_events_reminder_id_fkey";
            columns: ["reminder_id"];
            isOneToOne: false;
            referencedRelation: "reminders";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          additional_info: string | null;
          allergies: string | null;
          created_at: string;
          dob: string;
          gender: string;
          height: number | null;
          id: string;
          name: string;
          updated_at: string;
          user_id: string;
          weight: number | null;
        };
        Insert: {
          additional_info?: string | null;
          allergies?: string | null;
          created_at?: string;
          dob: string;
          gender: string;
          height?: number | null;
          id?: string;
          name: string;
          updated_at?: string;
          user_id: string;
          weight?: number | null;
        };
        Update: {
          additional_info?: string | null;
          allergies?: string | null;
          created_at?: string;
          dob?: string;
          gender?: string;
          height?: number | null;
          id?: string;
          name?: string;
          updated_at?: string;
          user_id?: string;
          weight?: number | null;
        };
        Relationships: [];
      };
      reminders: {
        Row: {
          created_at: string | null;
          deleted_at: string | null;
          dose: string;
          end_date: string | null;
          id: string;
          indications: string | null;
          medicine_icon: string;
          medicine_name: string;
          profile_id: string | null;
          schedule_config: Json;
          start_date: string;
          status: string;
          stock_config: Json | null;
          unit: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          deleted_at?: string | null;
          dose: string;
          end_date?: string | null;
          id?: string;
          indications?: string | null;
          medicine_icon: string;
          medicine_name: string;
          profile_id?: string | null;
          schedule_config: Json;
          start_date: string;
          status?: string;
          stock_config?: Json | null;
          unit: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          deleted_at?: string | null;
          dose?: string;
          end_date?: string | null;
          id?: string;
          indications?: string | null;
          medicine_icon?: string;
          medicine_name?: string;
          profile_id?: string | null;
          schedule_config?: Json;
          start_date?: string;
          status?: string;
          stock_config?: Json | null;
          unit?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reminders_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
