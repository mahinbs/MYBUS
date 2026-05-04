'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getStoredBookings, saveStoredBookings } from '@/lib/booking-store';
import { getBusFeedback, upsertBusFeedback } from '@/lib/feedback-store';

function withinFeedbackWindow(date: string) {
  const travelDate = new Date(`${date}T12:00:00`);
  const now = new Date();
  const end = new Date(travelDate);
  end.setDate(end.getDate() + 7);
  return now >= travelDate && now <= end;
}

const chipHints = ['Cleanliness', 'Punctuality', 'Staff', 'Comfort', 'Safety'];

function FeedbackContent() {
  const params = useSearchParams();
  const bookingId = params.get('bookingId') || '';
  const busId = params.get('busId') || '';
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [saved, setSaved] = useState(false);

  const booking = useMemo(
    () => getStoredBookings().find((b) => b.id === bookingId),
    [bookingId]
  );
  const existing = useMemo(
    () => getBusFeedback().find((x) => x.bookingId === bookingId),
    [bookingId]
  );

  const isEligible = Boolean(
    booking &&
      booking.busId === busId &&
      booking.status === 'completed' &&
      withinFeedbackWindow(booking.date)
  );

  const displayStars = hoverRating || rating;
  const ratingLabel = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'][displayStars] || '';

  const saveFeedback = () => {
    if (!booking || rating < 1) return;
    upsertBusFeedback({
      bookingId: booking.id,
      busId: booking.busId,
      operator: booking.operator,
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    });
    const next = getStoredBookings().map((b) =>
      b.id === booking.id ? { ...b, ratedAt: new Date().toISOString() } : b
    );
    saveStoredBookings(next);
    setSaved(true);
  };

  const appendChip = (text: string) => {
    setComment((c) => (c.trim() ? `${c.trim()} · ${text}` : text));
  };

  return (
    <div className="min-h-screen bg-[#F8F0FC] pb-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-b border-gray-100 bg-white px-4 pb-5 pt-4 shadow-sm"
      >
        <div className="relative flex items-center gap-3">
          <Link
            href="/bookings"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-[#1E293B] transition active:scale-95"
          >
            <i className="ri-arrow-left-line text-xl" />
          </Link>
          <div className="flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">Rate experience</p>
            <h1 className="text-xl font-bold text-[#1E293B]">How was your ride?</h1>
          </div>
        </div>

        {booking ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative mt-4 rounded-2xl border border-gray-100 bg-[#F9FAFB] p-4"
          >
            <p className="text-xs font-bold text-[#1E293B]">{booking.operator}</p>
            <p className="mt-1 text-[11px] text-gray-500">
              {booking.from} <i className="ri-arrow-right-line mx-0.5 text-[10px]" /> {booking.to}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-lg bg-white px-2.5 py-1 text-[10px] font-medium text-gray-600 ring-1 ring-gray-200">{booking.date}</span>
              <span className="rounded-lg bg-white px-2.5 py-1 text-[10px] font-medium text-gray-600 ring-1 ring-gray-200">
                Bus {booking.busId}
              </span>
            </div>
          </motion.div>
        ) : null}
      </motion.div>

      <div className="space-y-4 px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          {!booking ? (
            <p className="text-center text-sm text-rose-600">Booking not found.</p>
          ) : null}
          {booking && booking.busId !== busId ? (
            <p className="text-center text-sm text-rose-600">You can only rate the bus from your own booking.</p>
          ) : null}
          {booking && booking.status !== 'completed' ? (
            <p className="text-center text-sm text-amber-700">Rating opens after your trip is completed.</p>
          ) : null}
          {booking && booking.status === 'completed' && !withinFeedbackWindow(booking.date) ? (
            <p className="text-center text-sm text-rose-600">The 7-day rating window has closed.</p>
          ) : null}
          {existing && !saved ? (
            <motion.div
              initial={{ scale: 0.97 }}
              animate={{ scale: 1 }}
              className="mb-4 rounded-2xl bg-violet-50 p-3 text-center text-xs text-violet-900 ring-1 ring-violet-100"
            >
              You already rated this trip: <strong>{existing.rating}/5</strong>
              {existing.comment ? ` — “${existing.comment}”` : ''}
            </motion.div>
          ) : null}

          <p className="text-center text-[10px] font-semibold uppercase tracking-wider text-gray-400">Your rating</p>
          <div className="mt-3 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <motion.button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
                disabled={!isEligible}
                whileHover={isEligible ? { scale: 1.05 } : {}}
                whileTap={isEligible ? { scale: 0.92 } : {}}
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl transition-colors disabled:opacity-40 ${
                  displayStars >= s ? 'bg-[#6A1B9A] text-white shadow-sm' : 'bg-gray-100 text-gray-300'
                }`}
              >
                <i className="ri-star-fill" />
              </motion.button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            {displayStars > 0 ? (
              <motion.p
                key={ratingLabel}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2 text-center text-sm font-semibold text-[#6A1B9A]"
              >
                {ratingLabel}
              </motion.p>
            ) : (
              <p className="mt-2 text-center text-xs text-gray-400">Tap stars to rate</p>
            )}
          </AnimatePresence>

          <p className="mt-6 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Quick tags</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {chipHints.map((h) => (
              <button
                key={h}
                type="button"
                disabled={!isEligible}
                onClick={() => appendChip(h)}
                className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] font-medium text-gray-600 transition hover:border-[#6A1B9A] hover:bg-[#F3E5F5] hover:text-[#6A1B9A] disabled:opacity-40"
              >
                {h}
              </button>
            ))}
          </div>

          <label className="mt-5 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Tell us more
          </label>
          <motion.textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience — boarding, crew, comfort…"
            disabled={!isEligible}
            rows={4}
            className="mt-2 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50/80 p-4 text-sm text-[#1E293B] outline-none transition focus:border-[#6A1B9A] focus:bg-white focus:ring-2 focus:ring-[#6A1B9A]/20 disabled:opacity-50"
          />

          <motion.button
            type="button"
            onClick={saveFeedback}
            disabled={!isEligible || rating < 1}
            whileHover={isEligible && rating >= 1 ? { scale: 1.01 } : {}}
            whileTap={isEligible && rating >= 1 ? { scale: 0.98 } : {}}
            className="mt-4 w-full rounded-2xl bg-[#6A1B9A] py-4 text-sm font-bold text-white shadow-sm disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
          >
            Submit feedback
          </motion.button>

          <AnimatePresence>
            {saved ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 flex flex-col items-center rounded-2xl bg-emerald-50 py-5 ring-2 ring-emerald-200/80"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/40"
                >
                  <i className="ri-check-line text-3xl" />
                </motion.div>
                <p className="mt-3 text-sm font-bold text-emerald-900">Thank you!</p>
                <p className="mt-1 px-6 text-center text-xs text-emerald-800/90">
                  Your feedback helps other travellers choose better buses.
                </p>
                <Link
                  href="/bookings"
                  className="mt-4 text-xs font-bold text-emerald-700 underline underline-offset-2"
                >
                  Back to bookings
                </Link>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>

        {!saved ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Link
              href="/bookings"
              className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3.5 text-sm font-semibold text-[#6A1B9A] shadow-sm"
            >
              <i className="ri-arrow-left-line" />
              Back to bookings
            </Link>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}

function FeedbackFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F0FC]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        className="h-9 w-9 rounded-full border-2 border-[#6A1B9A] border-t-transparent"
      />
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={<FeedbackFallback />}>
      <FeedbackContent />
    </Suspense>
  );
}
