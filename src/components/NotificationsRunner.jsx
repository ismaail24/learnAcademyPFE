import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { checkNotifications } from "@/lib/notifications";

export function NotificationsRunner() {
  const { user } = useAuth();
  const initRef = useRef(false);

  useEffect(() => {
    if (!user) {
      initRef.current = false;
      return;
    }
    // Run a normal scan immediately. The notifications module itself decides
    // whether this is the very first time we see this user (no seen-set yet)
    // and silently seeds in that case. Don't force silentInit per session,
    // otherwise no notification ever appears after a fresh login.
    checkNotifications(user);
    initRef.current = true;

    const interval = setInterval(() => checkNotifications(user), 4000);
    const onStorage = () => checkNotifications(user);
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onStorage);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onStorage);
    };
  }, [user]);

  return null;
}
