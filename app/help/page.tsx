'use client';

const faqs = [
  { q: 'How do I cancel a ticket?', a: 'Go to My Bookings, open the booking and tap Cancel.' },
  { q: 'How do I reschedule?', a: 'Use Reschedule on upcoming bookings at least 6 hours before departure.' },
  { q: 'How do I contact support?', a: 'Email support@mybus.demo or use in-app chat (demo).' },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#F8F0FC] p-4">
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <h1 className="text-base font-bold text-[#1E293B]">Help & Support</h1>
        <div className="mt-4 space-y-2">
          {faqs.map((x) => (
            <div key={x.q} className="rounded-xl border border-gray-100 p-3">
              <p className="text-xs font-semibold text-[#1E293B]">{x.q}</p>
              <p className="mt-1 text-[11px] text-gray-500">{x.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
