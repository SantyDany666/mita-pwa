import { createClient } from "npm:@supabase/supabase-js@2";
import { addDays, isBefore, parseISO } from "npm:date-fns@2.30.0";
import { generateDoseSchedule, ScheduleConfig } from "./scheduler-logic.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          persistSession: false,
        },
      },
    );

    // 1. Fetch active reminders
    const { data: reminders, error: remindersError } = await supabaseClient
      .from("reminders")
      .select("*")
      .eq("status", "active");

    if (remindersError) {
      console.error("Error fetching reminders:", remindersError);
      throw remindersError;
    }

    const thresholdDate = addDays(new Date(), 7);
    const results = [];

    for (const reminder of reminders) {
      // 2. Get latest dose event
      const { data: latestDose, error: doseError } = await supabaseClient
        .from("dose_events")
        .select("scheduled_at")
        .eq("reminder_id", reminder.id)
        .order("scheduled_at", { ascending: false })
        .limit(1)
        .single();

      if (doseError && doseError.code !== "PGRST116") {
        console.error(`Error fetching doses for ${reminder.id}`, doseError);
        continue;
      }

      // Determine where the known schedule ends
      let scheduleHead = latestDose
        ? parseISO(latestDose.scheduled_at)
        : parseISO(reminder.start_date);

      // If schedule head is in the past (e.g. reminder resumed but no future doses), use NOW.
      // But typically we want to strictly follow the last dose to maintain cycle consistency.
      // If latest dose was ages ago (e.g. paused for months), we might want to reset to NOW.
      // For "active" reminders, we assume they are being taken.

      // Check if regeneration is needed (if head < threshold)
      if (isBefore(scheduleHead, thresholdDate)) {
        console.log(
          `Regenerating doses for ${reminder.medicine_name} (${reminder.id})`,
        );

        // Window Start: Head + 1 minute (to avoid dupes)
        // Actually, logic usually starts search from Head.
        // We really want: Start generating from max(Head, Now).
        // If the user has missed doses in the past, we don't necessarily want to backfill them?
        // Or do we? The requirement says "infinite reminders running out".
        // Let's assume we want to keep the schedule alive.

        // If Head is way in the past, treat it as "resuming from now".
        // If Head is near future, append from Head.

        const now = new Date();
        const generationStart = isBefore(scheduleHead, now)
          ? now
          : scheduleHead;

        // Generate for next 30 days
        const windowEnd = addDays(generationStart, 30);

        // Check for End Date cap
        let finalEnd = windowEnd;
        if (reminder.end_date) {
          const endDate = parseISO(reminder.end_date);
          if (isBefore(endDate, windowEnd)) {
            finalEnd = endDate;
          }
        }

        // If finalEnd <= generationStart, it's finished/expired.
        // Should we mark it finished? Maybe not automatically here.
        if (!isBefore(generationStart, finalEnd)) {
          continue;
        }

        const config = reminder.schedule_config as unknown as ScheduleConfig;
        const newDoses = generateDoseSchedule(
          config,
          generationStart,
          finalEnd,
        );

        // Filter out strictly past doses (safety)
        // And strictly after existing head (to avoid dupes if generationStart was Head)
        const validDoses = newDoses.filter(
          (d) =>
            d > now && (!latestDose || d > parseISO(latestDose.scheduled_at)),
        );

        if (validDoses.length > 0) {
          const eventsToInsert = validDoses.map((date) => ({
            reminder_id: reminder.id,
            user_id: reminder.user_id,
            profile_id: reminder.profile_id,
            scheduled_at: date.toISOString(),
            status: "pending",
          }));

          const { error: insertError } = await supabaseClient
            .from("dose_events")
            .insert(eventsToInsert);

          if (insertError) {
            console.error(
              `Failed to insert doses for ${reminder.id}`,
              insertError,
            );
            results.push({
              id: reminder.id,
              status: "error",
              error: insertError,
            });
          } else {
            results.push({
              id: reminder.id,
              status: "updated",
              count: eventsToInsert.length,
            });
          }
        } else {
          results.push({
            id: reminder.id,
            status: "skipped_no_doses_generated",
          });
        }
      } else {
        results.push({ id: reminder.id, status: "skipped_sufficient_doses" });
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
