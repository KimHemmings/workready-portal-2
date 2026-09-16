import type { Role } from './types';

export const ROLE_LABELS: Record<Role, string> = {
  owner: 'Organization Owner',
  admin: 'Administrator',
  coach: 'Case Manager / Coach',
  candidate: 'Candidate / Participant',
  participant: 'Candidate / Participant',
  sales: 'Sales Representative',
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  owner: 'Full administrative control over organization settings and staff.',
  admin: 'Manage platform users, candidate roster, and view analytics.',
  coach: 'View caseload, verify evidence, and support candidate progress.',
  candidate: 'Track requirements, log job searches, and submit milestones.',
  participant: 'Track requirements, log job searches, and submit milestones.',
  sales: 'Explore product functionality with preview access.',
};