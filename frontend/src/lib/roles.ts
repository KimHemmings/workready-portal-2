import type { Role } from "@/lib/types";

/**
 * Role labels shown across the whole product. The stored role values are unchanged — only the
 * wording is client-facing, so relabelling never touches the database.
 */
export const ROLE_LABEL: Record<Role, string> = {
  owner: "System Admin",
  admin: "Provider",
  coach: "Case Manager",
  participant: "Learner",
};

/** Plural form, for headings and counters. */
export const ROLE_LABEL_PLURAL: Record<Role, string> = {
  owner: "System Admins",
  admin: "Providers",
  coach: "Case Managers",
  participant: "Learners",
};

export function roleLabel(role: Role | undefined | null): string {
  return role ? ROLE_LABEL[role] : "";
}
