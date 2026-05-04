'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { upsertBooking } from '@/lib/booking-store';

const busesData: Record<string, any> = {
  B001: { operator: 'VRL Travels', type: 'AC Sleeper (2+1)', dep: '21:30', arr: '05:45', price: 899 },
  B002: { operator: 'SRS Travels', type: 'Non-AC Seater (2+2)', dep: '22:00', arr: '06:30', price: 549 },
  B003: { operator: 'KSRTC Airavat', type: 'AC Seater (2+2)', dep: '20:15', arr: '04:30', price: 749 },
  B004: { operator: 'Orange Travels', type: 'AC Sleeper (2+1)', dep: '23:00', arr: '07:15', price: 999 },
  B005: { operator: 'National Travels', type: 'Volvo AC (2+2)', dep: '19:45', arr: '04:00', price: 849 },
  B006: { operator: 'Neeta Travels', type: 'AC Sleeper (2+1)', dep: '21:00', arr: '05:30', price: 950 },
  B007: { operator: 'Sharma Travels', type: 'Non-AC Sleeper (2+1)', dep: '20:30', arr: '05:00', price: 499 },
  B008: { operator: 'Raj Express', type: 'AC Seater (2+2)', dep: '22:30', arr: '06:45', price: 650 },
};

const couponOffers: Record<string, { type: 'percent' | 'flat'; value: number; label: string }> = {
  MYBUS25: { type: 'percent', value: 25, label: '25% OFF for new users' },
  WEEK15: { type: 'percent', value: 15, label: '15% OFF weekend special' },
  STUD20: { type: 'percent', value: 20, label: '20% OFF student offer' },
};

const makeTicketId = () => `MB${Math.floor(Math.random() * 900000 + 100000)}`;

function CheckoutContent() {
  const params = useSearchParams();
  const router = useRouter();
  const busId = params.get('busId') || 'B001';
  const from = params.get('from') || 'Delhi';
  const to = params.get('to') || 'Jaipur';
  const date = params.get('date') || '2026-05-01';
  const seats = params.get('seats')?.split(',') || [];
  const boarding = params.get('boarding') || '';
  const dropping = params.get('dropping') || '';
  const amount = parseInt(params.get('amount') || '0');

  const bus = busesData[busId];

  const [passengers, setPassengers] = useState(
    seats.map((seat) => ({ seat, name: '', age: '', gender: 'male' as 'male' | 'female' }))
  );
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponMessage, setCouponMessage] = useState('');

  const gst = Math.round(amount * 0.05);
  const platformFee = 19;
  const convenienceFee = 49;
  const normalizedCoupon = couponCode.trim().toUpperCase();
  const activeCoupon = appliedCoupon ? couponOffers[appliedCoupon] : null;
  const discount = activeCoupon
    ? activeCoupon.type === 'percent'
      ? Math.floor((amount * activeCoupon.value) / 100)
      : activeCoupon.value
    : 0;
  const totalBeforeDiscount = amount + gst + platformFee + convenienceFee;
  const total = Math.max(totalBeforeDiscount - discount, 0);

  const updatePassenger = (idx: number, field: string, value: string) => {
    setPassengers((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p))
    );
  };

  const isValid = () => {
    return passengers.every((p) => p.name && Number(p.age) >= 5 && Number(p.age) <= 100 && p.gender) && email.includes('@') && phone.length >= 10;
  };

  const applyCoupon = () => {
    if (!normalizedCoupon) {
      setCouponMessage('Please enter a coupon code');
      setAppliedCoupon(null);
      return;
    }
    if (!couponOffers[normalizedCoupon]) {
      setCouponMessage('Invalid coupon code');
      setAppliedCoupon(null);
      return;
    }
    setAppliedCoupon(normalizedCoupon);
    setCouponMessage(`Coupon applied: ${normalizedCoupon}`);
  };

  const handleBook = () => {
    setShowConfirm(true);
    const ticketId = makeTicketId();
    upsertBooking({
      id: ticketId,
      busId,
      operator: bus.operator,
      type: bus.type,
      from,
      to,
      date,
      dep: bus.dep,
      arr: bus.arr,
      seats,
      status: 'upcoming',
      price: total,
      boarding,
      dropping,
      email,
      rescheduleCount: 0,
    });
    setTimeout(() => {
      router.push(`/confirmation?ticketId=${encodeURIComponent(ticketId)}&busId=${encodeURIComponent(busId)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}&seats=${encodeURIComponent(seats.join(','))}&boarding=${encodeURIComponent(boarding)}&dropping=${encodeURIComponent(dropping)}&amount=${encodeURIComponent(String(total))}&email=${encodeURIComponent(email)}&coupon=${encodeURIComponent(appliedCoupon || '')}&discount=${encodeURIComponent(String(discount))}`);
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F0FC]">
      {/* Dark Trip Summary */}
      <div className="bg-[#4A148C] px-4 pt-4 pb-5 rounded-b-3xl shadow-lg shadow-purple-900/20">
        <p className="text-xs font-bold text-white/90">{bus.operator} &middot; {bus.type}</p>
        <div className="flex items-center gap-3 mt-3">
          <div className="text-center">
            <p className="text-sm font-bold text-white">{bus.dep}</p>
            <p className="text-[10px] text-white/50">{from}</p>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full h-[2px] bg-white/20 rounded-full relative">
              <div className="absolute left-0 top-[-3px] w-2 h-2 rounded-full bg-white/40"></div>
              <div className="absolute right-0 top-[-3px] w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-white">{bus.arr}</p>
            <p className="text-[10px] text-white/50">{to}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[10px] text-white/50">{date}</span>
          <span className="text-[10px] text-white/30">&middot;</span>
          <span className="text-[10px] text-white/50">Seats: {seats.join(', ')}</span>
        </div>
      </div>

      {/* Passenger Details */}
      <div className="px-4 pt-4">
        <h2 className="text-sm font-bold text-[#1E293B] mb-3">Passenger Details</h2>
        {passengers.map((p, idx) => (
          <div key={p.seat} className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-50 mb-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-[#F3E5F5] flex items-center justify-center">
                <i className="ri-user-line text-[#6A1B9A] text-xs"></i>
              </div>
              <span className="text-xs font-bold text-[#1E293B]">Seat {p.seat}</span>
            </div>
            <div className="flex flex-col gap-2.5">
              <input
                type="text"
                placeholder="Full Name"
                value={p.name}
                onChange={(e) => updatePassenger(idx, 'name', e.target.value)}
                className="w-full bg-gray-50 rounded-xl px-3 py-3 text-xs text-[#1E293B] placeholder-gray-400 border-none outline-none"
              />
              <div className="flex gap-2.5">
                <input
                  type="number"
                  placeholder="Age"
                  value={p.age}
                  onChange={(e) => updatePassenger(idx, 'age', e.target.value)}
                  className="w-20 bg-gray-50 rounded-xl px-3 py-3 text-xs text-[#1E293B] placeholder-gray-400 border-none outline-none"
                />
                <div className="flex-1 flex bg-gray-50 rounded-xl p-1">
                  <button
                    onClick={() => updatePassenger(idx, 'gender', 'male')}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${p.gender === 'male' ? 'bg-white text-[#6A1B9A] shadow-sm' : 'text-gray-500'}`}
                  >
                    Male
                  </button>
                  <button
                    onClick={() => updatePassenger(idx, 'gender', 'female')}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${p.gender === 'female' ? 'bg-white text-[#6A1B9A] shadow-sm' : 'text-gray-500'}`}
                  >
                    Female
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Details */}
      <div className="px-4 pt-2">
        <h2 className="text-sm font-bold text-[#1E293B] mb-3">Contact Details</h2>
        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-50 flex flex-col gap-2.5">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-50 rounded-xl px-3 py-3 text-xs text-[#1E293B] placeholder-gray-400 border-none outline-none"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-gray-50 rounded-xl px-3 py-3 text-xs text-[#1E293B] placeholder-gray-400 border-none outline-none"
          />
        </div>
      </div>

      {/* Journey Details */}
      <div className="px-4 pt-4">
        <h2 className="text-sm font-bold text-[#1E293B] mb-3">Journey Details</h2>
        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-50 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F3E5F5] flex items-center justify-center shrink-0">
              <i className="ri-map-pin-2-line text-[#6A1B9A] text-sm"></i>
            </div>
            <div>
              <p className="text-[10px] text-gray-400">Boarding Point</p>
              <p className="text-xs font-semibold text-[#1E293B]">{boarding}</p>
            </div>
          </div>
          <div className="w-full h-[1px] bg-gray-50"></div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#EDE9FE] flex items-center justify-center shrink-0">
              <i className="ri-map-pin-fill text-[#7C3AED] text-sm"></i>
            </div>
            <div>
              <p className="text-[10px] text-gray-400">Dropping Point</p>
              <p className="text-xs font-semibold text-[#1E293B]">{dropping}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-sm font-bold text-[#1E293B] mb-3">Fare Breakdown</h2>
        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-50">
          <div className="flex justify-between items-center py-1.5">
            <span className="text-xs text-gray-500">Base Fare ({seats.length} x ₹{bus.price})</span>
            <span className="text-xs font-medium text-[#1E293B]">₹{amount}</span>
          </div>
          <div className="flex justify-between items-center py-1.5">
            <span className="text-xs text-gray-500">GST (5%)</span>
            <span className="text-xs font-medium text-[#1E293B]">₹{gst}</span>
          </div>
          <div className="flex justify-between items-center py-1.5">
            <span className="text-xs text-gray-500">Platform Fee</span>
            <span className="text-xs font-medium text-[#1E293B]">₹{platformFee}</span>
          </div>
          <div className="flex justify-between items-center py-1.5">
            <span className="text-xs text-gray-500">Convenience Fee</span>
            <span className="text-xs font-medium text-[#1E293B]">₹{convenienceFee}</span>
          </div>
          {activeCoupon && (
            <div className="flex justify-between items-center py-1.5">
              <span className="text-xs text-green-600">Coupon ({appliedCoupon})</span>
              <span className="text-xs font-medium text-green-600">-₹{discount}</span>
            </div>
          )}
          <div className="w-full h-[1px] bg-gray-100 my-2"></div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-[#1E293B]">Total Amount</span>
            <span className="text-xl font-bold text-[#6A1B9A]">₹{total}</span>
          </div>
        </div>
      </div>

      {/* Coupon */}
      <div className="px-4 pt-2">
        <h2 className="text-sm font-bold text-[#1E293B] mb-3">Apply Coupon</h2>
        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-50">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 bg-gray-50 rounded-xl px-3 py-3 text-xs uppercase tracking-wide text-[#1E293B] placeholder-gray-400 border-none outline-none"
            />
            <button
              type="button"
              onClick={applyCoupon}
              className="px-4 py-3 rounded-xl bg-[#F3E5F5] text-[#6A1B9A] text-xs font-bold hover:bg-[#E9D5FF]"
            >
              Apply
            </button>
          </div>
          <p className={`mt-2 text-[10px] ${couponMessage.includes('applied') ? 'text-green-600' : 'text-gray-500'}`}>
            {couponMessage || 'Try: MYBUS25, WEEK15, STUD20'}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pt-4 pb-6 mt-auto">
        <button
          onClick={handleBook}
          disabled={!isValid() || showConfirm}
          className="w-full bg-[#6A1B9A] text-white font-semibold text-sm py-4 rounded-2xl shadow-lg shadow-[#6A1B9A]/25 active:scale-[0.98] transition-all disabled:bg-gray-200 disabled:shadow-none disabled:text-gray-400"
        >
          {showConfirm ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </span>
          ) : (
            `Pay ₹${total}`
          )}
        </button>
        <p className="text-[10px] text-gray-400 text-center mt-2">By proceeding, you agree to our terms & conditions</p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}