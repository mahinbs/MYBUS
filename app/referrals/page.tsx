'use client';

import { useMemo } from 'react';

export default function ReferralsPage() {
  const code = useMemo(() => `MYBUS${Math.floor(Math.random() * 9000 + 1000)}`, []);
  return (
    <div className="min-h-screen bg-[#F8F0FC] p-4">
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <h1 className="text-base font-bold text-[#1E293B]">Refer & Earn</h1>
        <p className="mt-1 text-xs text-gray-500">Invite friends and earn ₹50 wallet credit per successful booking.</p>
        <div className="mt-4 rounded-xl bg-[#F3E5F5] p-4">
          <p className="text-[10px] text-gray-500">Your referral code</p>
          <p className="text-lg font-bold text-[#6A1B9A]">{code}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            void navigator.clipboard.writeText(code).catch(() => {
              /* non-secure context or denied — avoid unhandled rejection */
            });
          }}
          className="mt-3 w-full rounded-xl bg-[#6A1B9A] py-3 text-sm font-semibold text-white"
        >
          Copy Referral Code
        </button>
      </div>
    </div>
  );
}
