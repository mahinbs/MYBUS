export type BusFeedback = {
  bookingId: string;
  busId: string;
  operator: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type AppFeedback = {
  rating: number;
  comment: string;
  createdAt: string;
};

const BUS_FEEDBACK_KEY = 'mybus.busFeedback';
const APP_FEEDBACK_KEY = 'mybus.appFeedback';

export function getBusFeedback(): BusFeedback[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BUS_FEEDBACK_KEY);
    return raw ? (JSON.parse(raw) as BusFeedback[]) : [];
  } catch {
    return [];
  }
}

export function upsertBusFeedback(entry: BusFeedback) {
  const all = getBusFeedback().filter((x) => x.bookingId !== entry.bookingId);
  localStorage.setItem(BUS_FEEDBACK_KEY, JSON.stringify([entry, ...all]));
}

export function getAppFeedback(): AppFeedback[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(APP_FEEDBACK_KEY);
    return raw ? (JSON.parse(raw) as AppFeedback[]) : [];
  } catch {
    return [];
  }
}

export function addAppFeedback(entry: AppFeedback) {
  const all = getAppFeedback();
  localStorage.setItem(APP_FEEDBACK_KEY, JSON.stringify([entry, ...all]));
}
