import { useState, useEffect, useCallback } from "react";

export const useServiceWorker = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [swRegistration, setSwRegistration] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // Check if service worker is supported
  const isSupported = "serviceWorker" in navigator;

  // Register service worker
  const registerSW = useCallback(async () => {
    if (!isSupported) {
      console.log("Service Worker not supported");
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      setSwRegistration(registration);
      setIsInstalled(true);

      console.log("Service Worker registered successfully");

      // Listen for updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            // New version available
            console.log("New version available");
          }
        });
      });
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  }, [isSupported]);

  // Update service worker
  const updateSW = useCallback(() => {
    if (swRegistration) {
      swRegistration.update();
    }
  }, [swRegistration]);

  // Skip waiting and reload
  const skipWaiting = useCallback(() => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
      window.location.reload();
    }
  }, [swRegistration]);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Register service worker on mount
  useEffect(() => {
    registerSW();
  }, [registerSW]);

  // Listen for service worker messages
  useEffect(() => {
    if (isSupported) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "RELOAD_PAGE") {
          window.location.reload();
        }
      });
    }
  }, [isSupported]);

  return {
    isOnline,
    isSupported,
    isInstalled,
    swRegistration,
    updateSW,
    skipWaiting,
  };
};
