import { useState } from "react";
import { DoseCard } from "./DoseCard";
import { DoseSection } from "./DoseSection";
import { DoseSnoozeDrawer } from "./DoseSnoozeDrawer";
import {
  Sun,
  Sunset,
  CheckCircle,
  Moon,
  PackageOpen,
  Sunrise,
  AlertCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { useDoses } from "../hooks/useDoses";
import {
  format,
  parseISO,
  getHours,
  isBefore,
  isYesterday,
  isToday,
  differenceInCalendarDays,
} from "date-fns";

import { Tables } from "@/types/database.types";
import { MedicineIconType } from "@/features/reminders/utils/medicine-icons";

export type DoseWithReminder = Tables<"dose_events"> & {
  reminders: Tables<"reminders"> | null;
};

interface DailyDoseListProps {
  selectedDate: Date;
}

const DoseListGroup = ({
  doses,
  renderItem,
}: {
  doses: DoseWithReminder[];
  renderItem: (dose: DoseWithReminder) => React.ReactNode;
}) => {
  const [showAll, setShowAll] = useState(false);

  if (doses.length === 0) return null;

  const visibleDoses = showAll ? doses : doses.slice(0, 3);

  return (
    <>
      {visibleDoses.map((dose) => renderItem(dose))}
      {doses.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm font-medium text-[#054A91] dark:text-[#81A4CD] mt-2 mb-1 hover:underline text-center w-full"
        >
          {showAll ? "Ver menos" : `Ver más (${doses.length - 3})`}
        </button>
      )}
    </>
  );
};

export function DailyDoseList({ selectedDate }: DailyDoseListProps) {
  const { doses, isLoading, takeDose, skipDose, snoozeDose } =
    useDoses(selectedDate);
  const [snoozeDoseId, setSnoozeDoseId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 h-full">
        <Loader2 className="w-8 h-8 animate-spin text-[#054A91]" />
      </div>
    );
  }

  if (!doses || doses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
          <PackageOpen className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Sin dosis programadas
        </h3>
        <p className="text-sm text-gray-500 max-w-xs mt-2">
          No hay medicamentos programados para este día.
        </p>
      </div>
    );
  }

  // Grouping Logic
  const overdue: DoseWithReminder[] = [];
  const earlyMorning: DoseWithReminder[] = [];
  const morning: DoseWithReminder[] = [];
  const afternoon: DoseWithReminder[] = [];
  const night: DoseWithReminder[] = [];
  const taken: DoseWithReminder[] = [];
  const skipped: DoseWithReminder[] = [];

  // Helper for safe date formatting
  const safeFormat = (
    dateStr: string | null | undefined,
    fmt: string = "hh:mm a",
  ) => {
    if (!dateStr) return undefined;
    try {
      return format(parseISO(dateStr), fmt);
    } catch {
      console.error("Invalid date:", dateStr);
      return "--:--";
    }
  };

  const now = new Date();

  doses.forEach((dose) => {
    if (dose.status === "taken") {
      taken.push(dose);
      return;
    }
    if (dose.status === "skipped") {
      skipped.push(dose);
      return;
    }

    try {
      const date = parseISO(dose.scheduled_at);

      // Check for Overdue (Pending & Before Now)
      if (dose.status === "pending" && isBefore(date, now)) {
        overdue.push(dose);
        return;
      }

      const hour = getHours(date);

      if (hour >= 0 && hour < 6) {
        // 00:00 to 05:59
        earlyMorning.push(dose);
      } else if (hour >= 6 && hour < 12) {
        // 06:00 to 11:59
        morning.push(dose);
      } else if (hour >= 12 && hour < 19) {
        // 12:00 to 18:59
        afternoon.push(dose);
      } else {
        // 19:00 to 23:59
        night.push(dose);
      }
    } catch {
      console.warn("Error parsing scheduled_at for dose:", dose.id);
    }
  });

  const renderDoseCard = (dose: DoseWithReminder) => {
    let dateLabel: string | undefined;

    if (overdue.includes(dose)) {
      const date = parseISO(dose.scheduled_at);
      if (isYesterday(date)) {
        dateLabel = "Ayer";
      } else if (!isToday(date)) {
        const days = differenceInCalendarDays(now, date);
        dateLabel = `Hace ${days} días`;
      }
    }

    return (
      <DoseCard
        key={dose.id}
        id={dose.reminder_id}
        time={safeFormat(dose.scheduled_at) || "--:--"}
        medicine={dose.reminders?.medicine_name || "Medicamento desconocido"}
        status={dose.status as "pending" | "taken" | "skipped"}
        variant={overdue.includes(dose) ? "overdue" : "default"}
        icon={(dose.reminders?.medicine_icon || "capsule") as MedicineIconType}
        takenTime={safeFormat(dose.taken_at)}
        skippedTime={safeFormat(dose.taken_at)}
        dateLabel={dateLabel}
        onTake={() => takeDose(dose.id)}
        onSkip={() => skipDose(dose.id)}
        onSnooze={() => setSnoozeDoseId(dose.id)}
      />
    );
  };

  return (
    <div className="flex flex-col gap-2 px-4 py-2">
      {overdue.length > 0 && (
        <DoseSection
          title="Vencidas"
          variant="overdue"
          icon={<AlertCircle className="w-5 h-5" />}
        >
          <DoseListGroup doses={overdue} renderItem={renderDoseCard} />
        </DoseSection>
      )}

      {/* TODO: Add Overdue Section here if we implement fetching overdue from past days */}

      {earlyMorning.length > 0 && (
        <DoseSection
          title="Madrugada"
          variant="morning" // Reusing morning style for now, or could define a new one
          icon={<Sunrise className="w-5 h-5" />}
        >
          <DoseListGroup doses={earlyMorning} renderItem={renderDoseCard} />
        </DoseSection>
      )}

      {morning.length > 0 && (
        <DoseSection
          title="Mañana"
          variant="morning"
          icon={<Sun className="w-5 h-5" />}
        >
          <DoseListGroup doses={morning} renderItem={renderDoseCard} />
        </DoseSection>
      )}

      {afternoon.length > 0 && (
        <DoseSection
          title="Tarde"
          variant="afternoon"
          icon={<Sunset className="w-5 h-5" />}
        >
          <DoseListGroup doses={afternoon} renderItem={renderDoseCard} />
        </DoseSection>
      )}

      {night.length > 0 && (
        <DoseSection
          title="Noche"
          variant="night"
          icon={<Moon className="w-5 h-5" />}
        >
          <DoseListGroup doses={night} renderItem={renderDoseCard} />
        </DoseSection>
      )}

      {taken.length > 0 && (
        <DoseSection
          title="Tomadas"
          variant="taken"
          icon={<CheckCircle className="w-5 h-5" />}
        >
          <DoseListGroup doses={taken} renderItem={renderDoseCard} />
        </DoseSection>
      )}

      {skipped.length > 0 && (
        <DoseSection
          title="Omitidas"
          variant="skipped"
          icon={<XCircle className="w-5 h-5" />}
        >
          <DoseListGroup doses={skipped} renderItem={renderDoseCard} />
        </DoseSection>
      )}

      <DoseSnoozeDrawer
        open={!!snoozeDoseId}
        onOpenChange={(open) => !open && setSnoozeDoseId(null)}
        onSnooze={(date) => {
          if (snoozeDoseId) {
            snoozeDose({ doseId: snoozeDoseId, date });
          }
        }}
      />
    </div>
  );
}
