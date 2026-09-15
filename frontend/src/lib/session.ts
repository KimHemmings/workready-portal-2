import type { User } from "./types";

const SESSION_KEY = "workready_user_session";
const IMPERSONATOR_KEY = "workready_impersonator_session";

export function getStoredSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const getSessionUser = getStoredSession;

export function beginSession(user: User): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function endSession(): void {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(IMPERSONATOR_KEY);
}

export function getImpersonator(): User | null {
  try {
    const raw = localStorage.getItem(IMPERSONATOR_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setImpersonator(user: User): void {
  localStorage.setItem(IMPERSONATOR_KEY, JSON.stringify(user));
}

export function clearImpersonator(): void {
  localStorage.removeItem(IMPERSONATOR_KEY);
}

export function startImpersonation(targetUser: User): void {
  const currentSession = getStoredSession();
  if (currentSession && !getImpersonator()) {
    setImpersonator(currentSession);
  }
  beginSession(targetUser);
}

export function stopImpersonation(): User | null {
  const impersonator = getImpersonator();
  if (impersonator) {
    beginSession(impersonator);
    clearImpersonator();
    return impersonator;
  }
  return null;
}

export function isImpersonating(): boolean {
  return getImpersonator() !== null;
}

export function homePathFor(role: string): string {
  switch (role) {
    case "admin":
    case "system_admin":
      return "/admin";
    case "owner":
    case "business_manager":
      return "/owner";
    case "coach":
    case "case_manager":
      return "/coach";
    case "sales_demo":
      return "/sales-demo";
    case "participant":
    case "candidate":
    default:
      return "/participant";
  }
}
