export const AUTH_USERS_KEY = 'mybus_auth_users';

export type AuthUser = {
  name: string;
  phone: string;
  email: string;
  password: string;
};

function normalizePhone(phone: string) {
  return phone.replace(/\s/g, '');
}

export function getAuthUsers(): AuthUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(AUTH_USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AuthUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAuthUsers(users: AuthUser[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

export function upsertAuthUser(user: AuthUser) {
  const users = getAuthUsers();
  const next = users.filter((u) => normalizePhone(u.phone) !== normalizePhone(user.phone));
  next.unshift(user);
  saveAuthUsers(next);
}

export function findAuthUserByPhone(phone: string) {
  const users = getAuthUsers();
  return users.find((u) => normalizePhone(u.phone) === normalizePhone(phone.trim()));
}
