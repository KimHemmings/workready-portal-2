import type { QueryClient } from "@tanstack/react-query";
import type { Role, User } from "@/lib/types";

const KEY = "workready.user";
/** The real System Admin, kept aside while they preview the app as another role. */
const IMPERSONATOR_KEY = "workready.impersonator";

function read(key: string): User | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function getSessionUser(): User | null {
  return read(KEY);
}

export function beginSession(user: User) {
  localStorage.setItem(KEY, JSON.stringify(user));
  localStorage.removeItem(IMPERSONATOR_KEY);
}

export function endSession(qc: QueryClient) {
  localStorage.removeItem(KEY);
  localStorage.removeItem(IMPERSONATOR_KEY);
  qc.clear();
}

/** Drop a stale/invalid session without needing the query client (used by session validation). */
export function endSessionRaw() {
  localStorage.removeItem(KEY);
  localStorage.removeItem(IMPERSONATOR_KEY);
}

/** The System Admin currently previewing another role, if any. */
export function getImpersonator(): User | null {
  return read(IMPERSONATOR_KEY);
}

export function isImpersonating(): boolean {
  return getImpersonator() !== null;
}

/**
 * Preview the app as a real user of another role. The original System Admin is preserved so the
 * switch can always be reversed, and only a System Admin session may start one.
 */
export function startImpersonation(target: User, qc: QueryClient) {
  const current = getSessionUser();
  if (!current) return;
  const admin = getImpersonator() ?? current;
  if (admin.role !== "owner") return;
  localStorage.setItem(IMPERSONATOR_KEY, JSON.stringify(admin));
  localStorage.setItem(KEY, JSON.stringify(target));
  qc.clear();
}

export function stopImpersonation(qc: QueryClient): User | null {
  const admin = getImpersonator();
  if (!admin) return null;
  localStorage.setItem(KEY, JSON.stringify(admin));
  localStorage.removeItem(IMPERSONATOR_KEY);
  qc.clear();
  return admin;
}

export function homePathFor(role: Role): string {
  if (role === "owner") return "/owner";
  if (role === "coach") return "/coach";
  if (role === "admin") return "/admin";
  return "/participant";
}
