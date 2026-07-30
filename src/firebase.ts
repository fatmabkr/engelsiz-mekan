import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import config from "../firebase-applet-config.json";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? (config as any).apiKey ?? "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? (config as any).authDomain ?? "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? (config as any).projectId ?? "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? (config as any).storageBucket ?? "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? (config as any).messagingSenderId ?? "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? (config as any).appId ?? "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? (config as any).measurementId ?? "",
};

const app = initializeApp(firebaseConfig);

export async function initAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (!firebaseConfig.measurementId) return null;
  try {
    const supported = await isSupported();
    if (!supported) return null;
    return getAnalytics(app);
  } catch (e) {
    // don't break the app if analytics fails
    // eslint-disable-next-line no-console
    console.warn("Analytics init failed:", e);
    return null;
  }
}

export async function logEventSafe(eventName: string, params?: Record<string, any>) {
  const analytics = await initAnalytics();
  if (!analytics) return;
  const { logEvent } = await import("firebase/analytics");
  logEvent(analytics, eventName, params);
}

export default app;
