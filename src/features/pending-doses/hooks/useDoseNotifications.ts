import { useEffect, useRef } from "react";
import { notificationService } from "@/services/notification.service";
import { DoseWithReminder } from "../components/DailyDoseList";
import { isAfter, parseISO, addMinutes } from "date-fns";
import type { PluginListenerHandle } from "@capacitor/core";

/**
 * Simple string hashing to generate a unique integer ID for notifications
 * compatible with Capacitor Local Notifications.
 */
const hashString = (str: string): number => {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash); // Ensure positive ID
};

interface UseDoseNotificationsProps {
  doses: DoseWithReminder[];
  onTake: (doseId: string) => void;
  onSkip: (doseId: string) => void;
  onSnooze: (params: { doseId: string; date: Date }) => void;
  onOpenSnooze?: (doseId: string) => void;
}

export const useDoseNotifications = ({
  doses,
  onTake,
  onSkip,
  onSnooze,
  onOpenSnooze,
}: UseDoseNotificationsProps) => {
  // 0. Use Refs to keep handlers stable without re-running effects
  const handlersRef = useRef({ onTake, onSkip, onSnooze, onOpenSnooze });

  useEffect(() => {
    handlersRef.current = { onTake, onSkip, onSnooze, onOpenSnooze };
  }, [onTake, onSkip, onSnooze, onOpenSnooze]);

  // 1. Initialize Service & Listeners (Run once)
  useEffect(() => {
    let listenerHandle: PluginListenerHandle | undefined;

    const init = async () => {
      await notificationService.initialize();

      listenerHandle = await notificationService.onAction(
        (notificationAction) => {
          const { actionId, notification } = notificationAction;
          const doseId = notification.extra?.doseId;

          if (!doseId) return;

          // Access latest handlers from ref
          const { onTake, onSkip, onSnooze, onOpenSnooze } =
            handlersRef.current;

          switch (actionId) {
            case "take":
              onTake(doseId);
              break;
            case "skip":
              onSkip(doseId);
              break;
            case "snooze":
              // Prioritize opening the UI Drawer if handler is available
              if (onOpenSnooze) {
                onOpenSnooze(doseId);
              } else {
                // Fallback: Default snooze (15m) if no UI handler exists
                onSnooze({ doseId, date: addMinutes(new Date(), 15) });
              }
              break;
            case "tap":
              // Handle tap if needed (e.g. navigate to specific dose)
              break;
            default:
              break;
          }
        },
      );
    };

    init();

    return () => {
      // Clean up listener if possible
      if (listenerHandle) {
        listenerHandle.remove();
      }
    };
  }, []); // Run only once on mount

  // 2. Schedule Notifs for Future Doses
  useEffect(() => {
    const scheduleFutureDoses = async () => {
      const now = new Date();

      for (const dose of doses) {
        if (!dose.scheduled_at) continue;
        const scheduledDate = parseISO(dose.scheduled_at);

        // Only schedule if pending and in the future (plus buffer)
        if (dose.status === "pending" && isAfter(scheduledDate, now)) {
          const notificationId = hashString(dose.id);
          const medicineName = dose.reminders?.medicine_name || "Medicamento";

          await notificationService.scheduleDose({
            id: notificationId,
            title: "Hora de tu medicamento 💊",
            body: `Es hora de tomar ${medicineName}`,
            scheduleAt: scheduledDate,
            extra: { doseId: dose.id },
          });
        }
      }
    };

    if (doses.length > 0) {
      scheduleFutureDoses();
    }
  }, [doses]);
};
