import type { QueryClient } from "@tanstack/react-query";
import type { User } from "@/lib/types";

const KEY = "workready.user";

export function getSessionUser(): User | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function beginSession(user: User) {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function endSession(qc: QueryClient) {
  localStorage.removeItem(KEY);
  qc.clear();
}

export function homePathFor(role: User["role"]): string {
  if (role === "coach") return "/coach";
  if (role === "admin") return "/admin";
  return "/participant";
}
