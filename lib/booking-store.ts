export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

export type StoredBooking = {
  id: string;
  busId: string;
  operator: string;
  type: string;
  from: string;
  to: string;
  date: string;
  dep: string;
  arr: string;
  seats: string[];
  status: BookingStatus;
  price: number;
  boarding: string;
  dropping: string;
  email: string;
  rescheduleCount?: number;
  ratedAt?: string;
};

const STORAGE_KEY = 'mybus.bookings';
const operatorToBusId: Record<string, string> = {
  'VRL Travels': 'B001',
  'SRS Travels': 'B002',
  'KSRTC Airavat': 'B003',
  'Orange Travels': 'B004',
  'National Travels': 'B005',
  'Neeta Travels': 'B006',
  'Sharma Travels': 'B007',
  'Raj Express': 'B008',
};

export function getStoredBookings(): StoredBooking[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<Partial<StoredBooking>>;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x): x is Partial<StoredBooking> & { id: string; operator: string } => Boolean(x?.id && x?.operator))
      .map((x) => ({
        id: x.id,
        busId: x.busId || operatorToBusId[x.operator] || 'B001',
        operator: x.operator,
        type: x.type || 'Bus',
        from: x.from || 'Delhi',
        to: x.to || 'Jaipur',
        date: x.date || new Date().toISOString().split('T')[0],
        dep: x.dep || '--:--',
        arr: x.arr || '--:--',
        seats: Array.isArray(x.seats) ? x.seats : [],
        status: (x.status as BookingStatus) || 'upcoming',
        price: Number(x.price || 0),
        boarding: x.boarding || 'Boarding point',
        dropping: x.dropping || 'Dropping point',
        email: x.email || '',
        rescheduleCount: Number(x.rescheduleCount || 0),
        ratedAt: x.ratedAt,
      }));
  } catch {
    return [];
  }
}

export function saveStoredBookings(bookings: StoredBooking[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function upsertBooking(booking: StoredBooking) {
  const existing = getStoredBookings().filter((b) => b.id !== booking.id);
  saveStoredBookings([booking, ...existing]);
}
