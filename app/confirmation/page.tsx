'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

const busesData: Record<string, any> = {
  B001: { operator: 'VRL Travels', type: 'AC Sleeper (2+1)', dep: '21:30', arr: '05:45' },
  B002: { operator: 'SRS Travels', type: 'Non-AC Seater (2+2)', dep: '22:00', arr: '06:30' },
  B003: { operator: 'KSRTC Airavat', type: 'AC Seater (2+2)', dep: '20:15', arr: '04:30' },
  B004: { operator: 'Orange Travels', type: 'AC Sleeper (2+1)', dep: '23:00', arr: '07:15' },
  B005: { operator: 'National Travels', type: 'Volvo AC (2+2)', dep: '19:45', arr: '04:00' },
  B006: { operator: 'Neeta Travels', type: 'AC Sleeper (2+1)', dep: '21:00', arr: '05:30' },
  B007: { operator: 'Sharma Travels', type: 'Non-AC Sleeper (2+1)', dep: '20:30', arr: '05:00' },
  B008: { operator: 'Raj Express', type: 'AC Seater (2+2)', dep: '22:30', arr: '06:45' },
};

function ConfirmationContent() {
  const params = useSearchParams();
  const ticketId = params.get('ticketId') || 'MB000000';
  const busId = params.get('busId') || 'B001';
  const from = params.get('from') || 'Delhi';
  const to = params.get('to') || 'Jaipur';
  const date = params.get('date') || '2026-05-01';
  const seats = params.get('seats')?.split(',') || [];
  const boarding = params.get('boarding') || '';
  const dropping = params.get('dropping') || '';
  const amount = params.get('amount') || '0';
  const email = params.get('email') || '';
  const coupon = params.get('coupon') || '';
  const discount = params.get('discount') || '0';

  const bus = busesData[busId] || busesData.B001;

  return (
    <div className="flex flex-col min-h-screen items-center px-4 pt-8 pb-8 bg-[#F8F0FC]">
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 14 }}
        className="w-20 h-20 rounded-full bg-[#F0FDF4] flex items-center justify-center mb-4 shadow-lg shadow-green-100"
      >
        <i className="ri-check-line text-[#22C55E] text-4xl"></i>
      </motion.div>
      <motion.h1 initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl font-bold text-[#1E293B]">
        Booking Confirmed!
      </motion.h1>
      <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }} className="text-xs text-gray-500 mt-1 text-center">
        Your ticket has been sent to {email || 'your email'}
      </motion.p>

      {/* Ticket Card */}
      <motion.div
        initial={{ y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full bg-white rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 mt-6 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#6A1B9A] px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="MY BUS" className="h-8 w-8 object-cover rounded-xl" />
              <span className="text-white font-bold text-sm tracking-wide">MY BUS</span>
            </div>
            <span className="text-white/70 text-[10px] font-mono tracking-wider">{ticketId}</span>
          </div>
        </div>

        <div className="p-5">
          {/* Route */}
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-xl font-bold text-[#1E293B]">{from}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Origin</p>
            </div>
            <div className="flex-1 flex flex-col items-center px-4">
              <div className="w-full h-[3px] bg-[#6A1B9A] rounded-full relative">
                <div className="absolute left-0 top-[-4px] w-2.5 h-2.5 rounded-full bg-[#6A1B9A]"></div>
                <div className="absolute right-0 top-[-4px] w-2.5 h-2.5 rounded-full bg-[#6A1B9A]"></div>
              </div>
              <i className="ri-bus-line text-[#6A1B9A] text-lg mt-1"></i>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-[#1E293B]">{to}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Destination</p>
            </div>
          </div>

          <div className="w-full h-[1px] bg-gray-100 my-4"></div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-gray-400">Operator</p>
              <p className="text-xs font-bold text-[#1E293B] mt-0.5">{bus.operator}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400">Bus Type</p>
              <p className="text-xs font-bold text-[#1E293B] mt-0.5">{bus.type}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400">Departure</p>
              <p className="text-xs font-bold text-[#1E293B] mt-0.5">{bus.dep}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400">Arrival</p>
              <p className="text-xs font-bold text-[#1E293B] mt-0.5">{bus.arr}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400">Date</p>
              <p className="text-xs font-bold text-[#1E293B] mt-0.5">{date}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400">Seats</p>
              <p className="text-xs font-bold text-[#1E293B] mt-0.5">{seats.join(', ')}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400">Boarding</p>
              <p className="text-xs font-medium text-[#1E293B] mt-0.5">{boarding}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400">Dropping</p>
              <p className="text-xs font-medium text-[#1E293B] mt-0.5">{dropping}</p>
            </div>
          </div>

          <div className="w-full h-[1px] bg-gray-100 my-4"></div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Total Paid</span>
            <span className="text-2xl font-bold text-[#6A1B9A]">₹{amount}</span>
          </div>
          {coupon && (
            <p className="mt-2 text-[10px] text-green-600">
              Coupon {coupon} applied, saved ₹{discount}
            </p>
          )}
        </div>

        {/* Barcode */}
        <div className="px-5 pb-5">
          <div className="bg-gray-100 rounded-xl h-12 flex items-center justify-center gap-[2px] px-4">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="bg-[#1E293B] rounded-sm" style={{ width: i % 4 === 0 ? '2px' : '1px', height: i % 3 === 0 ? '24px' : '16px' }}></div>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-2 font-mono tracking-widest">{ticketId}</p>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 w-full mt-6">
        <button className="w-full bg-[#6A1B9A] text-white font-semibold text-sm py-3.5 rounded-2xl shadow-lg shadow-[#6A1B9A]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:bg-[#581888]">
          <i className="ri-download-line"></i>
          Download Ticket
        </button>
        <button className="w-full bg-white text-[#6A1B9A] font-semibold text-sm py-3.5 rounded-2xl border-2 border-[#6A1B9A] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          <i className="ri-share-line"></i>
          Share Ticket
        </button>
        <Link href="/" className="w-full">
          <button className="w-full bg-gray-100 text-[#1E293B] font-semibold text-sm py-3.5 rounded-2xl active:scale-[0.98] transition-all">
            Plan Another Journey
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Loading confirmation...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}