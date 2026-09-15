import type { User, Role } from './types';

export type { User, Role };

const STORAGE_KEY = 'workready_session_user';
const IMPERSONATOR_KEY = 'workready_impersonator_user';

export const getSessionUser = (): User | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading session user:', e);
  }
  return {
    id: 'demo-candidate-1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    role: 'participant',
    status: 'active',
    coach_id: 'coach-1',
    cohort_id: 'cohort-1',
    last_login: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    phone: '0412 345 678',
    organization_id: 'org-demo-1',
    pbasPoints: 35,
  } as unknown as User;
};

export const beginSession = (user: User, _qc?: any): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

export const endSession = (_qc?: any): void => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(IMPERSONATOR_KEY);
  sessionStorage.clear();
};

export const endSessionRaw = endSession;

export const getImpersonator = (): User | null => {
  try {
    const raw = localStorage.getItem(IMPERSONATOR_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const startImpersonation = (targetUser: User, _qc?: any): void => {
  const current = getSessionUser();
  if (current && !getImpersonator()) {
    localStorage.setItem(IMPERSONATOR_KEY, JSON.stringify(current));
  }
  beginSession(targetUser, _qc);
};

export const stopImpersonation = (_qc?: any): User | null => {
  const original = getImpersonator();
  if (original) {
    beginSession(original, _qc);
    localStorage.removeItem(IMPERSONATOR_KEY);
    return original;
  }
  return null;
};

export const homePathFor = (role: Role): string => {
  switch (role) {
    case 'coach':
      return '/coach';
    case 'owner':
    case 'admin':
      return '/owner';
    case 'participant':
    default:
      return '/participant';
  }
};
