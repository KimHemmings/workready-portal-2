export type Role = 'PARTICIPANT' | 'COACH' | 'OWNER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  pbasPoints?: number;
}

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
    role: 'PARTICIPANT',
    pbasPoints: 35,
  };
};

export const beginSession = (user: User): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

export const endSession = (): void => {
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

export const startImpersonation = (targetUser: User): void => {
  const current = getSessionUser();
  if (current && !getImpersonator()) {
    localStorage.setItem(IMPERSONATOR_KEY, JSON.stringify(current));
  }
  beginSession(targetUser);
};

export const stopImpersonation = (): void => {
  const original = getImpersonator();
  if (original) {
    beginSession(original);
    localStorage.removeItem(IMPERSONATOR_KEY);
  }
};

export const homePathFor = (role: Role): string => {
  switch (role) {
    case 'COACH':
      return '/coach';
    case 'OWNER':
      return '/owner';
    case 'PARTICIPANT':
    default:
      return '/participant';
  }
};
