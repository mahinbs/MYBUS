'use client';

import { useState } from 'react';
import { addAppFeedback, getAppFeedback } from '@/lib/feedback-store';

export default function RateAppPage() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [saved, setSaved] = useState(false);
  const allFeedback = getAppFeedback();
  const avg = allFeedback.length === 0
    ? 0
    : allFeedback.reduce((sum, x) => sum + x.rating, 0) / allFeedback.length;

  const submit = () => {
    if (rating < 1) return;
    addAppFeedback({ rating, comment: comment.trim(), createdAt: new Date().toISOString() });
    setSaved(true);
    setComment('');
    setRating(0);
  };

  return (
    <div className="min-h-screen bg-[#F8F0FC] p-4">
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <h1 className="text-base font-bold text-[#1E293B]">Rate MY BUS App</h1>
        <p className="mt-1 text-xs text-gray-500">Average rating: {avg ? avg.toFixed(1) : 'No ratings yet'}</p>
        <div className="mt-4 flex gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setRating(s)}
              className={`h-10 w-10 rounded-full text-sm font-bold ${rating >= s ? 'bg-[#6A1B9A] text-white' : 'bg-gray-100 text-gray-500'}`}
            >
              {s}
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us what to improve"
          className="mt-3 w-full rounded-xl border border-gray-200 p-3 text-xs outline-none"
          rows={4}
        />
        <button
          type="button"
          onClick={submit}
          disabled={rating < 1}
          className="mt-3 w-full rounded-xl bg-[#6A1B9A] py-3 text-sm font-semibold text-white disabled:bg-gray-200 disabled:text-gray-400"
        >
          Submit App Rating
        </button>
        {saved ? <p className="mt-2 text-xs text-green-600">Thanks for your feedback.</p> : null}
      </div>
    </div>
  );
}
