


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";






CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."dose_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "reminder_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "scheduled_at" timestamp with time zone NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "taken_at" timestamp with time zone,
    "is_rescheduled" boolean DEFAULT false,
    "profile_id" "uuid",
    CONSTRAINT "dose_events_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'taken'::"text", 'skipped'::"text"])))
);


ALTER TABLE "public"."dose_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mood_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "profile_id" "uuid",
    "mood_value" smallint NOT NULL,
    "note" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "mood_logs_mood_value_check" CHECK ((("mood_value" >= 1) AND ("mood_value" <= 5)))
);


ALTER TABLE "public"."mood_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "dob" "date" NOT NULL,
    "gender" "text" NOT NULL,
    "weight" numeric,
    "height" numeric,
    "allergies" "text",
    "additional_info" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reminders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "medicine_name" "text" NOT NULL,
    "dose" "text" NOT NULL,
    "unit" "text" NOT NULL,
    "medicine_icon" "text" NOT NULL,
    "schedule_config" "jsonb" NOT NULL,
    "start_date" "date" NOT NULL,
    "end_date" "date",
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "stock_config" "jsonb",
    "indications" "text",
    "deleted_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "profile_id" "uuid" NOT NULL,
    CONSTRAINT "reminders_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'paused'::"text", 'finished'::"text"])))
);


ALTER TABLE "public"."reminders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."symptom_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "profile_id" "uuid",
    "symptom" "text" NOT NULL,
    "intensity" smallint NOT NULL,
    "note" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "symptom_logs_intensity_check" CHECK ((("intensity" >= 1) AND ("intensity" <= 5)))
);


ALTER TABLE "public"."symptom_logs" OWNER TO "postgres";


ALTER TABLE ONLY "public"."dose_events"
    ADD CONSTRAINT "dose_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mood_logs"
    ADD CONSTRAINT "mood_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reminders"
    ADD CONSTRAINT "reminders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."symptom_logs"
    ADD CONSTRAINT "symptom_logs_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_dose_events_profile_id" ON "public"."dose_events" USING "btree" ("profile_id");



CREATE INDEX "idx_dose_events_reminder" ON "public"."dose_events" USING "btree" ("reminder_id");



CREATE INDEX "idx_dose_events_user_scheduled" ON "public"."dose_events" USING "btree" ("user_id", "scheduled_at");



CREATE INDEX "idx_reminders_profile_id" ON "public"."reminders" USING "btree" ("profile_id");



ALTER TABLE ONLY "public"."dose_events"
    ADD CONSTRAINT "dose_events_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."dose_events"
    ADD CONSTRAINT "dose_events_reminder_id_fkey" FOREIGN KEY ("reminder_id") REFERENCES "public"."reminders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."dose_events"
    ADD CONSTRAINT "dose_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mood_logs"
    ADD CONSTRAINT "mood_logs_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mood_logs"
    ADD CONSTRAINT "mood_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reminders"
    ADD CONSTRAINT "reminders_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reminders"
    ADD CONSTRAINT "reminders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."symptom_logs"
    ADD CONSTRAINT "symptom_logs_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."symptom_logs"
    ADD CONSTRAINT "symptom_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Users can delete their own mood logs" ON "public"."mood_logs" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own symptom logs" ON "public"."symptom_logs" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own mood logs" ON "public"."mood_logs" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own profile" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own reminders" ON "public"."reminders" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own symptom logs" ON "public"."symptom_logs" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own dose events" ON "public"."dose_events" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own mood logs" ON "public"."mood_logs" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own reminders" ON "public"."reminders" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own symptom logs" ON "public"."symptom_logs" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own mood logs" ON "public"."mood_logs" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own reminders" ON "public"."reminders" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own symptom logs" ON "public"."symptom_logs" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."dose_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mood_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reminders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."symptom_logs" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";








GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



































































































































































































GRANT ALL ON TABLE "public"."dose_events" TO "anon";
GRANT ALL ON TABLE "public"."dose_events" TO "authenticated";
GRANT ALL ON TABLE "public"."dose_events" TO "service_role";



GRANT ALL ON TABLE "public"."mood_logs" TO "anon";
GRANT ALL ON TABLE "public"."mood_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."mood_logs" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."reminders" TO "anon";
GRANT ALL ON TABLE "public"."reminders" TO "authenticated";
GRANT ALL ON TABLE "public"."reminders" TO "service_role";



GRANT ALL ON TABLE "public"."symptom_logs" TO "anon";
GRANT ALL ON TABLE "public"."symptom_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."symptom_logs" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































