'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getStoredBookings, saveStoredBookings, type StoredBooking } from '@/lib/booking-store';

const staticBookings: StoredBooking[] = [
  {
    id: 'MB123456',
    busId: 'B001',
    operator: 'VRL Travels',
    type: 'AC Sleeper (2+1)',
    from: 'Delhi',
    to: 'Jaipur',
    date: '2026-05-10',
    dep: '21:30',
    arr: '05:45',
    seats: ['L1A', 'L1B'],
    status: 'upcoming' as const,
    price: 1798,
    boarding: 'Kashmere Gate ISBT',
    dropping: 'Sindhi Camp Bus Stand',
    email: 'user@example.com',
  },
  {
    id: 'MB123455',
    busId: 'B002',
    operator: 'SRS Travels',
    type: 'Non-AC Seater (2+2)',
    from: 'Mumbai',
    to: 'Pune',
    date: '2026-04-25',
    dep: '22:00',
    arr: '06:30',
    seats: ['U2C'],
    status: 'completed' as const,
    price: 549,
    boarding: 'Andheri East',
    dropping: 'Shivaji Nagar',
    email: 'user@example.com',
  },
  {
    id: 'MB123454',
    busId: 'B003',
    operator: 'KSRTC Airavat',
    type: 'AC Seater (2+2)',
    from: 'Bangalore',
    to: 'Hyderabad',
    date: '2026-04-15',
    dep: '20:15',
    arr: '04:30',
    seats: ['L3A'],
    status: 'completed' as const,
    price: 749,
    boarding: 'Majestic',
    dropping: 'Ameerpet',
    email: 'user@example.com',
  },
];

const tabs = ['upcoming', 'completed', 'cancelled'];

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState<StoredBooking[]>([]);

  useEffect(() => {
    const stored = getStoredBookings();
    if (stored.length === 0) {
      saveStoredBookings(staticBookings);
      setBookings(staticBookings);
      return;
    }
    setBookings(stored);
  }, []);

  const filteredBookings = useMemo(
    () => bookings.filter((b) => b.status === activeTab),
    [bookings, activeTab]
  );

  const cancelBooking = (id: string) => {
    const next = bookings.map((b) => (b.id === id ? { ...b, status: 'cancelled' as const } : b));
    setBookings(next);
    saveStoredBookings(next);
  };

  return (
    <div className="flex flex-col min-h-screen px-4 pt-4 bg-[#F8F0FC]">
      <h1 className="text-lg font-bold text-[#1E293B] mb-4">My Bookings</h1>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-1 flex mb-4 shadow-sm border border-gray-100">
        {tabs.map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab 
                ? 'bg-[#6A1B9A] text-white shadow-md' 
                : 'text-gray-500'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Booking List */}
      <div className="flex flex-col gap-3 pb-6">
        {filteredBookings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <i className="ri-ticket-2-line text-gray-400 text-2xl"></i>
            </div>
            <p className="text-sm text-gray-500 font-medium">No {activeTab} bookings</p>
            <p className="text-[10px] text-gray-400 mt-1">Your bookings will appear here</p>
          </div>
        )}
        {filteredBookings.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl p-4 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-bold text-[#1E293B]">{b.operator}</p>
                <p className="text-[10px] text-gray-400">{b.type}</p>
              </div>
              <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                b.status === 'upcoming' 
                  ? 'bg-[#F0FDF4] text-[#22C55E]' 
                  : b.status === 'completed'
                  ? 'bg-gray-100 text-gray-500'
                  : 'bg-red-50 text-red-500'
              }`}>
                {b.status}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="text-center min-w-[45px]">
                <p className="text-sm font-bold text-[#1E293B]">{b.dep}</p>
                <p className="text-[10px] text-gray-400">{b.from}</p>
              </div>
              <div className="flex-1 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <div className="flex-1 h-[2px] bg-gray-200"></div>
                <i className="ri-bus-line text-[#6A1B9A] text-xs"></i>
                <div className="flex-1 h-[2px] bg-gray-200"></div>
                <div className="w-2 h-2 rounded-full bg-[#6A1B9A]"></div>
              </div>
              <div className="text-center min-w-[45px]">
                <p className="text-sm font-bold text-[#1E293B]">{b.arr}</p>
                <p className="text-[10px] text-gray-400">{b.to}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-gray-400 mb-3">
              <span>{b.date}</span>
              <span>Seats: {b.seats.join(', ')}</span>
            </div>
            <p className="text-[10px] text-gray-500 mb-2">
              {b.boarding} <span className="text-gray-300">&rarr;</span> {b.dropping}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              <p className="text-sm font-bold text-[#1E293B]">₹{b.price}</p>
              <div className="flex gap-2 flex-wrap justify-end">
                {b.status === 'upcoming' && (
                  <button
                    onClick={() => cancelBooking(b.id)}
                    className="px-4 py-2 bg-red-50 text-red-500 text-[10px] font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                )}
                {b.status === 'upcoming' && (
                  <Link
                    href={`/track-bus?bookingId=${encodeURIComponent(b.id)}`}
                    className="px-4 py-2 bg-[#EFF6FF] text-[#2563EB] text-[10px] font-bold rounded-xl"
                  >
                    Track
                  </Link>
                )}
                {b.status === 'upcoming' && (
                  <Link
                    href={`/reschedule?bookingId=${encodeURIComponent(b.id)}`}
                    className="px-4 py-2 bg-[#FFF7ED] text-[#C2410C] text-[10px] font-bold rounded-xl"
                  >
                    Reschedule
                  </Link>
                )}
                {b.status === 'completed' && (
                  <Link
                    href={`/feedback?bookingId=${encodeURIComponent(b.id)}&busId=${encodeURIComponent(b.busId)}`}
                    className="px-4 py-2 bg-[#ECFDF5] text-[#047857] text-[10px] font-bold rounded-xl"
                  >
                    Rate Bus
                  </Link>
                )}
                <Link
                  href={`/confirmation?ticketId=${encodeURIComponent(b.id)}&busId=${encodeURIComponent(b.busId)}&from=${encodeURIComponent(b.from)}&to=${encodeURIComponent(b.to)}&date=${encodeURIComponent(b.date)}&seats=${encodeURIComponent(b.seats.join(','))}&boarding=${encodeURIComponent(b.boarding)}&dropping=${encodeURIComponent(b.dropping)}&amount=${encodeURIComponent(String(b.price))}&email=${encodeURIComponent(b.email)}`}
                  className="px-4 py-2 bg-[#F3E5F5] text-[#6A1B9A] text-[10px] font-bold rounded-xl"
                >
                  View Ticket
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}