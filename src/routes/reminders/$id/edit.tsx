import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { ReminderForm } from "@/features/reminders/components/ReminderForm";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { reminderService } from "@/features/reminders/services/reminder.service";
import { ReminderFormValues } from "@/features/reminders/utils/validation";
import { ScheduleConfig, StockConfig } from "@/features/reminders/types";
import { MedicineIconType } from "@/features/reminders/utils/medicine-icons";

const reminderQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["reminders", id],
    queryFn: () => reminderService.getById(id),
  });

export const Route = createFileRoute("/reminders/$id/edit")({
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
  component: EditReminderRoute,
});

function EditReminderRoute() {
  const { id } = Route.useParams();
  const { data: reminder } = useSuspenseQuery(reminderQueryOptions(id));

  if (!reminder) return null;

  const schedule = reminder.schedule_config as unknown as ScheduleConfig;
  const stock = reminder.stock_config as unknown as StockConfig;

  const initialValues: Partial<ReminderFormValues> = {
    name: reminder.medicine_name,
    dose: reminder.dose.toString(),
    unit: reminder.unit,
    medicineIcon: reminder.medicine_icon as MedicineIconType,
    frequency: schedule?.frequency || "",
    startTime: schedule?.startTime || "08:00",
    startDate: reminder.start_date.split("T")[0],
    duration: schedule?.duration || "forever",
    inventory: {
      stock: stock?.stock || 0,
      stockAlertEnabled: stock?.stockAlertEnabled || false,
      stockThreshold: stock?.stockThreshold || 0,
    },
    indications: reminder.indications || "",
  };

  return (
    <ReminderForm
      mode="edit"
      initialValues={initialValues}
      reminderId={reminder.id}
    />
  );
}
