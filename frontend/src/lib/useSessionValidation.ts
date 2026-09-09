import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { endSessionRaw, getSessionUser } from "@/lib/session";
import type { User } from "@/lib/types";

/**
 * Validates any stored session against the backend on first paint.
 *
 * A session left in localStorage would otherwise silently sign someone in on page load, which looks
 * exactly like an auto-login/"demo mode". If the account no longer exists, is inactive or archived,
 * the stale session is discarded before any protected route renders.
 */
export function useSessionValidation() {
  const [checked, setChecked] = useState(() => getSessionUser() === null);

  useEffect(() => {
    const stored = getSessionUser();
    if (!stored?.id) {
      setChecked(true);
      return;
    }
    let cancelled = false;
    apiGet<User>(`/users/${stored.id}`)
      .then((fresh) => {
        if (cancelled) return;
        if (fresh.status !== "active") endSessionRaw();
      })
      .catch(() => {
        if (!cancelled) endSessionRaw();
      })
      .finally(() => {
        if (!cancelled) setChecked(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return checked;
}
