import { useState } from "react";
import { PendingDosesLayout } from "../components/PendingDosesLayout";
import { CalendarStrip } from "../components/CalendarStrip";
import { DailyDoseList } from "../components/DailyDoseList";
import { startOfDay, isToday, isTomorrow, isYesterday, format } from "date-fns";
import { es } from "date-fns/locale";

import { useDoses } from "../hooks/useDoses";
import { useDoseNotifications } from "../hooks/useDoseNotifications";

import { DoseSnoozeDrawer } from "../components/DoseSnoozeDrawer";

export function PendingDosesPage() {
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [snoozeDoseId, setSnoozeDoseId] = useState<string | null>(null);

  // Setup Notifications (Always bind to Today to ensure reminders are scheduled)
  const {
    doses: todayDoses,
    takeDose,
    skipDose,
    snoozeDose,
  } = useDoses(new Date());

  useDoseNotifications({
    doses: todayDoses,
    onTake: takeDose,
    onSkip: skipDose,
    onSnooze: (params) => snoozeDose(params),
    onOpenSnooze: (id) => setSnoozeDoseId(id),
  });

  const getHeaderTitle = (date: Date) => {
    if (isToday(date)) return "Hoy";
    if (isTomorrow(date)) return "Mañana";
    if (isYesterday(date)) return "Ayer";
    return format(date, "EEEE, d 'de' MMMM", { locale: es });
  };

  return (
    <PendingDosesLayout
      title={getHeaderTitle(selectedDate)}
      headerContent={
        <CalendarStrip
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      }
    >
      <div className="bg-white dark:bg-gray-900 min-h-full">
        {/* List Area */}
        <div className="pb-20">
          <DailyDoseList
            selectedDate={selectedDate}
            onSetSnoozeDoseId={setSnoozeDoseId}
          />
        </div>
      </div>

      <DoseSnoozeDrawer
        open={!!snoozeDoseId}
        onOpenChange={(open) => !open && setSnoozeDoseId(null)}
        onSnooze={(date) => {
          if (snoozeDoseId) {
            snoozeDose({ doseId: snoozeDoseId, date });
          }
        }}
      />
    </PendingDosesLayout>
  );
}
