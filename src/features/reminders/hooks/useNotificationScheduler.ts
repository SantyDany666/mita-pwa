import { useEffect, useRef } from "react";
import { App } from "@capacitor/app";
import { useQuery } from "@tanstack/react-query";
import { addDays, parseISO, isAfter } from "date-fns";
import { useProfileStore } from "@/store/profile.store";
import { doseService } from "@/features/reminders/services/dose.service";
import { useDoseMutations } from "@/features/reminders/hooks/useDoseMutations";
import { notificationService } from "@/services/notification.service";
import { toast } from "sonner";
import { useUIStore } from "@/store/ui.store";

import { hashString } from "@/utils/scheduler.utils";

const STALE_TIME = 5 * 60 * 1000; // 5 minutes

export const useNotificationScheduler = () => {
  const { currentProfile } = useProfileStore();

  const isMounted = useRef(false);

  // 1. Query Pending Doses (30 Days Window)
  const { data: pendingDoses = [], refetch } = useQuery({
    queryKey: ["scheduler-pending-doses", currentProfile?.id],
    queryFn: async () => {
      if (!currentProfile) return [];
      const now = new Date();
      const end = addDays(now, 30);

      const allDoses = await doseService.getByDateRange(
        currentProfile.id,
        now,
        end,
      );

      return allDoses.filter((d) => d.status === "pending");
    },
    enabled: !!currentProfile,
    staleTime: STALE_TIME,
    refetchOnWindowFocus: true, // Refetch when app comes to foreground (web)
  });

  // 2. Handle App State Changes (Background -> Foreground)
  useEffect(() => {
    const listener = App.addListener("appStateChange", ({ isActive }) => {
      if (isActive) {
        refetch();
      }
    });

    return () => {
      listener.then((l) => l.remove());
    };
  }, [refetch]);

  // 3. The Core Scheduler Logic
  useEffect(() => {
    if (!currentProfile || pendingDoses.length === 0) return;

    const syncNotifications = async () => {
      try {
        await notificationService.initialize();

        // A. Get currently scheduled IDs
        const scheduledIds = await notificationService.getScheduledIds();

        // B. Calculate Valid IDs (From our 30-day pending list)
        const validDoseIds = new Set(pendingDoses.map((d) => hashString(d.id)));

        // C. Cancel Invalid/Stale Notifications
        const idsToCancel = Array.from(scheduledIds).filter(
          (id) => !validDoseIds.has(id),
        );

        if (idsToCancel.length > 0) {
          await notificationService.cancelBatch(idsToCancel);
        }

        // D. Schedule New Notifications (7 Day Window)
        const now = new Date();
        const scheduleLimit = addDays(now, 7);

        const dosesToSchedule = pendingDoses.filter((dose) => {
          const doseDate = parseISO(dose.scheduled_at);
          const nId = hashString(dose.id);

          // Conditions:
          // 1. Not already scheduled
          // 2. In the future (allow small buffer for "now")
          // 3. Within 7 days limit
          return (
            !scheduledIds.has(nId) &&
            isAfter(doseDate, now) &&
            !isAfter(doseDate, scheduleLimit)
          );
        });

        if (dosesToSchedule.length > 0) {
          for (const dose of dosesToSchedule) {
            const nId = hashString(dose.id);
            const medicineName = dose.reminders?.medicine_name || "Medicamento";
            const doseAmount = dose.reminders?.dose
              ? `${dose.reminders.dose} ${dose.reminders.unit}`
              : "";

            await notificationService.scheduleDose({
              id: nId,
              title: `Hora de tu ${medicineName} 💊`,
              body: doseAmount ? `Toma ${doseAmount}` : `Es hora de tu dosis`,
              scheduleAt: parseISO(dose.scheduled_at),
              extra: { doseId: dose.id, medicineName },
            });
          }
        }
      } catch (error) {
        console.error("Scheduler Sync Error:", error);
      }
    };

    syncNotifications();
  }, [pendingDoses, currentProfile]);

  // 4. Global Action Listeners
  const { takeDose, skipDose, snoozeDose, undoDose } = useDoseMutations();
  const { setSnoozeDoseId } = useUIStore();

  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;

    const setupListeners = async () => {
      await notificationService.onAction(async (notificationAction) => {
        const { actionId, notification } = notificationAction;
        const doseId = notification.extra?.doseId;
        const medicineName = notification.extra?.medicineName || "Medicamento";

        if (!doseId) return;

        try {
          if (actionId === "take") {
            await takeDose(doseId);
            toast.success(`Dosis de ${medicineName} tomada`, {
              action: {
                label: "Deshacer",
                onClick: async () => {
                  await undoDose(doseId);
                },
              },
              duration: 4000,
            });
          } else if (actionId === "skip") {
            await skipDose(doseId);
            toast.info(`Dosis de ${medicineName} omitida`, {
              action: {
                label: "Deshacer",
                onClick: async () => {
                  await undoDose(doseId);
                },
              },
              duration: 4000,
            });
          } else if (actionId === "snooze") {
            setSnoozeDoseId(doseId);
          }
        } catch (error) {
          console.error("Failed to process notification action:", error);
          toast.error("Error al procesar la acción");
        }
      });
    };

    setupListeners();
  }, [takeDose, skipDose, snoozeDose, undoDose, setSnoozeDoseId]);
};
