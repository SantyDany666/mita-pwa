import {
  LocalNotifications,
  ActionPerformed,
} from "@capacitor/local-notifications";
import { Capacitor } from "@capacitor/core";

export class NotificationService {
  private static readonly CHANNEL_ID = "dose_reminders";
  private static readonly ACTION_TYPE_ID = "DOSE_ACTIONS";

  /**
   * Initializes the notification service.
   * Requests permissions and registers action types.
   */
  async initialize(): Promise<void> {
    try {
      const { display } = await LocalNotifications.requestPermissions();

      if (display === "granted") {
        if (Capacitor.isNativePlatform()) {
          await this.registerActionTypes();
          await this.createChannel();
        }
      }
    } catch (error) {
      console.error("Failed to initialize notifications:", error);
    }
  }

  /**
   * Registers the interactive action buttons for the notifications.
   */
  private async registerActionTypes() {
    await LocalNotifications.registerActionTypes({
      types: [
        {
          id: NotificationService.ACTION_TYPE_ID,
          actions: [
            {
              id: "take",
              title: "Tomar",
              foreground: false, // Execute in background
            },
            {
              id: "snooze",
              title: "Posponer",
              foreground: true, // Open app to show drawer
              destructive: false,
            },
            {
              id: "skip",
              title: "Omitir",
              foreground: false, // Execute in background
              destructive: true,
            },
          ],
        },
      ],
    });
  }

  /**
   * Registers a listener for notification actions.
   * Returns a handle that can be used to remove the listener.
   */
  async onAction(callback: (notificationAction: ActionPerformed) => void) {
    return await LocalNotifications.addListener(
      "localNotificationActionPerformed",
      callback,
    );
  }

  /**
   * Creates a dedicated notification channel (Android only).
   */
  private async createChannel() {
    await LocalNotifications.createChannel({
      id: NotificationService.CHANNEL_ID,
      name: "Recordatorios de Dosis",
      description: "Notificaciones para tomar tus medicamentos",
      importance: 5, // High importance
      visibility: 1, // Public
      vibration: true,
      lights: true,
      lightColor: "#054A91", // Brand color
    });
  }

  /**
   * Schedules a notification for a specific dose.
   * Uses the dose ID (hashed or numeric equivalent) as the notification ID to ensure idempotency.
   */
  async scheduleDose(params: {
    id: number; // Unique Integer ID
    title: string;
    body: string;
    scheduleAt: Date;
    extra?: Record<string, unknown>;
  }): Promise<void> {
    try {
      // Check if we have permission first? The plugin usually handles this gracefully or throws.

      await LocalNotifications.schedule({
        notifications: [
          {
            id: params.id,
            title: params.title,
            body: params.body,
            schedule: { at: params.scheduleAt, allowWhileIdle: true },
            channelId: NotificationService.CHANNEL_ID,
            actionTypeId: NotificationService.ACTION_TYPE_ID,
            extra: params.extra,
            smallIcon: "ic_stat_notification", // Ensure this resource exists in Android or use default
            iconColor: "#054A91", // Custom color for the notification icon background
            // sound: 'beep.wav', // Optional: Custom sound
          },
        ],
      });
    } catch (error) {
      console.error(
        `Failed to schedule notification for dose ${params.id}:`,
        error,
      );
    }
  }

  /**
   * Cancels a specific notification by ID.
   */
  async cancel(id: number): Promise<void> {
    try {
      await LocalNotifications.cancel({ notifications: [{ id }] });
    } catch (error) {
      console.error(`Failed to cancel notification ${id}:`, error);
    }
  }

  /**
   * Gets all pending notifications (useful for debugging).
   */
  async getPending() {
    return await LocalNotifications.getPending();
  }
}

// Singleton instance
export const notificationService = new NotificationService();
