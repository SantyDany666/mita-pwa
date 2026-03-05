import { focusManager } from "@tanstack/react-query";
import { App } from "@capacitor/app";

// Register Capacitor App state changes to TanStack Query focusManager
focusManager.setEventListener((handleFocus) => {
  // Listen to visibility changes
  const listener = App.addListener("appStateChange", (info) => {
    handleFocus(info.isActive);
  });

  return () => {
    listener.then((l) => l.remove());
  };
});
