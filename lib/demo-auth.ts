export const DEMO_SESSION_KEY = 'mybus_demo_session';

export type DemoUser = {
  name: string;
  phone: string;
  email?: string;
  provider?: 'phone' | 'google' | 'apple';
};

export function getDemoSession(): DemoUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(DEMO_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DemoUser;
  } catch {
    return null;
  }
}

export function setDemoSession(user: DemoUser): void {
  localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(user));
}

export function clearDemoSession(): void {
  localStorage.removeItem(DEMO_SESSION_KEY);
}

function normalizePhone(p: string): string {
  return p.replace(/\s/g, '');
}

/** Demo login: restores profile if phone matches stored session, otherwise creates a placeholder member. */
export function loginDemoSession(phone: string): void {
  const trimmed = phone.trim();
  const existing = getDemoSession();
  if (
    existing &&
    normalizePhone(existing.phone) === normalizePhone(trimmed)
  ) {
    setDemoSession({ ...existing, provider: 'phone' });
    return;
  }
  setDemoSession({
    name: 'MY BUS Member',
    phone: trimmed || '+91',
    provider: 'phone',
  });
}

export function signInWithSocialDemo(provider: 'google' | 'apple'): void {
  setDemoSession({
    name: provider === 'google' ? 'Google user' : 'Apple user',
    phone: '—',
    email: `demo.${provider}@mybus.app`,
    provider,
  });
}
