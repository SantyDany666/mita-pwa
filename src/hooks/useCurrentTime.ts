import { useState, useEffect } from "react";
import { App } from "@capacitor/app";
import { PluginListenerHandle } from "@capacitor/core";

/**
 * A custom hook that provides a reactive current time (`Date` object).
 * It updates periodically (by default every minute) and immediately forces
 * an update when the app comes back to the foreground.
 *
 * @param refreshIntervalMs The interval in milliseconds to update the time. Defaults to 60000 (1 min).
 * @returns {Date} The current reactive time.
 */
export const useCurrentTime = (refreshIntervalMs: number = 60000): Date => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, refreshIntervalMs);

    let listener: PluginListenerHandle;
    const setupListener = async () => {
      listener = await App.addListener("appStateChange", ({ isActive }) => {
        if (isActive) {
          setNow(new Date());
        }
      });
    };
    setupListener();

    return () => {
      clearInterval(interval);
      if (listener) {
        listener.remove();
      }
    };
  }, [refreshIntervalMs]);

  return now;
};
