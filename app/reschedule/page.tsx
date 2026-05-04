'use client';

import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getStoredBookings, saveStoredBookings } from '@/lib/booking-store';

function canReschedule(date: string) {
  const travel = new Date(`${date}T18:00:00`);
  return travel.getTime() - Date.now() >= 6 * 60 * 60 * 1000;
}

function RescheduleContent() {
  const params = useSearchParams();
  const router = useRouter();
  const bookingId = params.get('bookingId') || '';
  const all = useMemo(() => getStoredBookings(), []);
  const booking = all.find((b) => b.id === bookingId);
  const [newDate, setNewDate] = useState(booking?.date || '');
  const [message, setMessage] = useState('');

  if (!booking) return <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">Booking not found.</div>;

  const allowed = booking.status === 'upcoming' && canReschedule(booking.date) && (booking.rescheduleCount || 0) < 1;

  const submit = () => {
    if (!allowed || !newDate) return;
    const next = all.map((b) =>
      b.id === booking.id ? { ...b, date: newDate, rescheduleCount: (b.rescheduleCount || 0) + 1 } : b
    );
    saveStoredBookings(next);
    setMessage('Booking rescheduled successfully.');
    setTimeout(() => router.push('/bookings'), 1000);
  };

  return (
    <div className="min-h-screen bg-[#F8F0FC] p-4">
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <h1 className="text-base font-bold text-[#1E293B]">Reschedule Booking</h1>
        <p className="mt-1 text-xs text-gray-500">Allowed only once and up to 6 hours before departure.</p>
        <p className="mt-2 text-xs text-gray-500">Current date: {booking.date}</p>
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="mt-3 w-full rounded-xl border border-gray-200 px-3 py-3 text-xs outline-none"
        />
        {!allowed ? <p className="mt-2 text-xs text-rose-500">Reschedule not allowed for this booking.</p> : null}
        <button
          type="button"
          onClick={submit}
          disabled={!allowed || !newDate}
          className="mt-3 w-full rounded-xl bg-[#6A1B9A] py-3 text-sm font-semibold text-white disabled:bg-gray-200 disabled:text-gray-400"
        >
          Confirm Reschedule
        </button>
        {message ? <p className="mt-2 text-xs text-green-600">{message}</p> : null}
      </div>
    </div>
  );
}

export default function ReschedulePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-gray-400">Loading...</div>}>
      <RescheduleContent />
    </Suspense>
  );
}
