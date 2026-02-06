import { RemindersLayout } from "../components/RemindersLayout";
import { ReminderCard } from "../components/ReminderCard";
import { useReminders } from "../hooks/useReminders";
import { getFrequencyLabel } from "../utils/frequency-utils";
import { MedicineIconType } from "../utils/medicine-icons";
import { ScheduleConfig } from "../utils/scheduler-utils";
import { Loader2, PackageOpen } from "lucide-react";
import { useReminderActions } from "../hooks/useReminderActions";

export function RemindersPage() {
  const { reminders, isLoading } = useReminders();
  const { pauseReminder, resumeReminder, finishReminder } =
    useReminderActions();

  if (isLoading) {
    return (
      <RemindersLayout>
        <div className="flex items-center justify-center p-8 h-full">
          <Loader2 className="w-8 h-8 animate-spin text-[#054A91]" />
        </div>
      </RemindersLayout>
    );
  }

  const active = reminders.filter((r) => r.status === "active");
  const paused = reminders.filter((r) => r.status === "paused");
  const finished = reminders.filter((r) => r.status === "finished");

  return (
    <RemindersLayout>
      <div className="px-4 py-4 flex flex-col gap-6 pb-24 relative min-h-full">
        {reminders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center opacity-60">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
              <PackageOpen className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500">
              No tienes recordatorios creados aún.
            </p>
          </div>
        )}

        {/* Active Section */}
        {active.length > 0 && (
          <div>
            <h3 className="text-[#054A91] dark:text-[#81A4CD] text-lg font-bold leading-tight tracking-[-0.015em] pb-3">
              Activos
            </h3>
            <div className="flex flex-col gap-3">
              {active.map((reminder) => {
                const freq = (
                  reminder.schedule_config as unknown as ScheduleConfig
                )?.frequency;
                return (
                  <ReminderCard
                    key={reminder.id}
                    id={reminder.id}
                    medicineName={reminder.medicine_name}
                    dose={reminder.dose.toString()}
                    unit={reminder.unit}
                    frequency={getFrequencyLabel(freq)}
                    status="active"
                    icon={
                      (reminder.medicine_icon as MedicineIconType) || "capsule"
                    }
                    onPause={() => pauseReminder(reminder.id)}
                    onFinish={() => finishReminder(reminder.id)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Paused Section */}
        {paused.length > 0 && (
          <div>
            <h3 className="text-[#3E7CB1] dark:text-[#81A4CD] text-lg font-bold leading-tight tracking-[-0.015em] pb-3 pt-2">
              Pausados
            </h3>
            <div className="flex flex-col gap-3">
              {paused.map((reminder) => {
                const freq = (
                  reminder.schedule_config as unknown as ScheduleConfig
                )?.frequency;
                return (
                  <ReminderCard
                    key={reminder.id}
                    id={reminder.id}
                    medicineName={reminder.medicine_name}
                    dose={reminder.dose.toString()}
                    unit={reminder.unit}
                    frequency={getFrequencyLabel(freq)}
                    status="paused"
                    icon={
                      (reminder.medicine_icon as MedicineIconType) || "capsule"
                    }
                    onResume={() => resumeReminder(reminder.id)}
                    onFinish={() => finishReminder(reminder.id)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Finished Section */}
        {finished.length > 0 && (
          <div>
            <h3 className="text-gray-500 dark:text-gray-400 text-lg font-bold leading-tight tracking-[-0.015em] pb-3 pt-2">
              Finalizados
            </h3>
            <div className="flex flex-col gap-3">
              {finished.map((reminder) => {
                const freq = (
                  reminder.schedule_config as unknown as ScheduleConfig
                )?.frequency;
                return (
                  <ReminderCard
                    key={reminder.id}
                    id={reminder.id}
                    medicineName={reminder.medicine_name}
                    dose={reminder.dose.toString()}
                    unit={reminder.unit}
                    frequency={getFrequencyLabel(freq)}
                    status="finished"
                    endDate={
                      reminder.end_date
                        ? new Date(reminder.end_date).toLocaleDateString()
                        : undefined
                    }
                    icon={
                      (reminder.medicine_icon as MedicineIconType) || "capsule"
                    }
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </RemindersLayout>
  );
}
