import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { ReminderDetail } from "@/features/reminders/components/ReminderDetail";
import { reminderService } from "@/features/reminders/services/reminder.service";
import { getFrequencyLabel } from "@/features/reminders/utils/frequency-utils";
import { getDurationLabel } from "@/features/reminders/utils/duration-utils";
import { getSmartDateLabel } from "@/features/reminders/utils/date-utils";
import { MedicineIconType } from "@/features/reminders/utils/medicine-icons";
import { useReminderActions } from "@/features/reminders/hooks/useReminderActions";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ScheduleConfig, StockConfig } from "@/features/reminders/types";

const reminderQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["reminders", id],
    queryFn: () => reminderService.getById(id),
  });

export const Route = createFileRoute("/reminders/$id/")({
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({
        to: "/welcome",
      });
    }
  },
  loader: async ({ context, params }) => {
    const { queryClient } = context;
    const reminder = await queryClient.ensureQueryData(
      reminderQueryOptions(params.id),
    );

    if (!reminder) {
      throw redirect({
        to: "/reminders",
      });
    }
  },
  component: ReminderDetailRoute,
});

function ReminderDetailRoute() {
  const { id } = Route.useParams();
  const { data: reminder } = useSuspenseQuery(reminderQueryOptions(id));
  const actions = useReminderActions();

  if (!reminder) return null;

  const scheduleConfig = reminder.schedule_config as unknown as ScheduleConfig;
  const stockConfig = reminder.stock_config as unknown as StockConfig;

  // Transform data for the UI
  const uiData = {
    id: reminder.id,
    name: reminder.medicine_name,
    status: reminder.status as "active" | "paused" | "finished",
    dose: reminder.dose.toString(),
    unit: reminder.unit,
    frequency: getFrequencyLabel(scheduleConfig?.frequency),
    duration: getDurationLabel(scheduleConfig?.duration || "forever"),
    startDateLabel: getSmartDateLabel(reminder.start_date),
    startTime: scheduleConfig?.startTime || "08:00",
    indications: reminder.indications || "",
    stock: stockConfig?.stock,
    icon: (reminder.medicine_icon as MedicineIconType) || "capsule",
  };

  return (
    <ReminderDetail
      {...uiData}
      onPause={() => actions.pauseReminder(uiData.id)}
      onResume={() => actions.resumeReminder(uiData.id)}
      onFinish={() => actions.finishReminder(uiData.id)}
      onReactivate={() => actions.reactivateReminder(uiData.id)}
      onDelete={() => actions.deleteReminder(uiData.id)}
    />
  );
}
