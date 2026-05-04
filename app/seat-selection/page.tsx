'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getRouteStops } from '@/lib/route-data';

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

const initialSeats = (isSleeper: boolean) => {
  const seats: { id: string; status: 'available' | 'booked' | 'selected'; type: 'lower' | 'upper' }[] = [];
  const isBooked = () => (Math.random() > 0.72 ? 'booked' : 'available') as 'booked' | 'available';

  if (isSleeper) {
    for (let row = 1; row <= 5; row++) {
      seats.push({ id: `L${row}A`, status: isBooked(), type: 'lower' });
      seats.push({ id: `L${row}B`, status: isBooked(), type: 'lower' });
      seats.push({ id: `L${row}C`, status: isBooked(), type: 'lower' });
    }
    for (let row = 1; row <= 5; row++) {
      seats.push({ id: `U${row}A`, status: isBooked(), type: 'upper' });
      seats.push({ id: `U${row}B`, status: isBooked(), type: 'upper' });
      seats.push({ id: `U${row}C`, status: isBooked(), type: 'upper' });
    }
    return seats;
  }

  // Seater layout (2+2): only one level, more rows.
  for (let row = 1; row <= 6; row++) {
    seats.push({ id: `L${row}A`, status: isBooked(), type: 'lower' });
    seats.push({ id: `L${row}B`, status: isBooked(), type: 'lower' });
    seats.push({ id: `L${row}C`, status: isBooked(), type: 'lower' });
    seats.push({ id: `L${row}D`, status: isBooked(), type: 'lower' });
  }
  return seats;
};

function SeatSelectionContent() {
  const params = useSearchParams();
  const busId = params.get('busId') || 'B001';
  const from = params.get('from') || 'Delhi';
  const to = params.get('to') || 'Jaipur';
  const date = params.get('date') || '2026-05-01';

  const bus = busesData[busId];
  const isSleeper = bus.type.includes('Sleeper');
  const [seats, setSeats] = useState(() => initialSeats(isSleeper));
  const [activeDeck, setActiveDeck] = useState<'lower' | 'upper'>('lower');
  const [boardingPoint, setBoardingPoint] = useState('');
  const [droppingPoint, setDroppingPoint] = useState('');
  const [showBoarding, setShowBoarding] = useState(false);
  const [showDropping, setShowDropping] = useState(false);

  const selectedSeats = seats.filter((s) => s.status === 'selected');
  const totalPrice = selectedSeats.length * bus.price;

  const toggleSeat = (seatId: string) => {
    setSeats((prev) =>
      prev.map((s) => {
        if (s.id === seatId) {
          if (s.status === 'available') return { ...s, status: 'selected' };
          if (s.status === 'selected') return { ...s, status: 'available' };
        }
        return s;
      })
    );
  };

  const routeStops = getRouteStops(from, to);
  const boardingPoints = routeStops.boarding;
  const droppingPoints = routeStops.dropping;

  const filteredSeats = seats.filter((s) => s.type === (isSleeper ? activeDeck : 'lower'));

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F0FC]">
      {/* Dark Header */}
      <div className="bg-[#4A148C] px-4 pt-4 pb-4 rounded-b-3xl shadow-lg shadow-purple-900/20">
        <div className="flex items-center gap-3 mb-3">
          <Link href={`/bus-listings?from=${from}&to=${to}&date=${date}`}>
            <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <i className="ri-arrow-left-line text-white"></i>
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="text-sm font-bold text-white">{bus.operator}</h1>
            <p className="text-[10px] text-white/60">{bus.type} &middot; {from} to {to}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-sm font-bold text-white">{bus.dep}</p>
            <p className="text-[10px] text-white/50">{from}</p>
          </div>
          <div className="flex-1 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-white/30"></div>
            <div className="flex-1 h-[2px] bg-white/20"></div>
            <i className="ri-bus-line text-white/50 text-xs"></i>
            <div className="flex-1 h-[2px] bg-white/20"></div>
            <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-white">{bus.arr}</p>
            <p className="text-[10px] text-white/50">{to}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
          <div className="flex items-center justify-between gap-2 rounded-xl bg-[#F8F0FC] px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6A1B9A] shadow-sm">
                <i className={isSleeper ? 'ri-hotel-bed-line text-lg' : 'ri-armchair-line text-lg'} />
              </span>
              <div>
                <p className="text-xs font-semibold text-[#1E293B]">
                  {isSleeper ? 'Sleeper coach layout' : 'Seater coach layout'}
                </p>
                <p className="text-[10px] text-gray-500">
                  {isSleeper ? 'Berths are shown by upper/lower deck' : 'Chair seats are shown in 2+2 rows'}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-[#6A1B9A] px-2 py-1 text-[10px] font-bold text-white">
              {isSleeper ? 'Sleeper' : 'Seater'}
            </span>
          </div>
        </div>
      </div>

      {/* Deck Toggle (Sleeper only) */}
      {isSleeper && (
        <div className="px-4 pt-4">
          <div className="bg-white rounded-2xl p-1 flex shadow-sm border border-gray-100">
            <button 
              onClick={() => setActiveDeck('lower')} 
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeDeck === 'lower' ? 'bg-[#6A1B9A] text-white shadow-md' : 'text-gray-500'}`}
            >
              Lower Deck
            </button>
            <button 
              onClick={() => setActiveDeck('upper')} 
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeDeck === 'upper' ? 'bg-[#6A1B9A] text-white shadow-md' : 'text-gray-500'}`}
            >
              Upper Deck
            </button>
          </div>
        </div>
      )}

      {/* Seat Layout */}
      <div className="px-4 pt-4 pb-2">
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-50">
          <div className="flex justify-end mb-5">
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
              <i className="ri-steering-line text-gray-400 text-base"></i>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {Array.from({ length: isSleeper ? 5 : 6 }).map((_, rowIdx) => {
              const row = rowIdx + 1;
              const seatA = filteredSeats.find((s) => s.id === `${activeDeck[0].toUpperCase()}${row}A`);
              const seatB = filteredSeats.find((s) => s.id === `${activeDeck[0].toUpperCase()}${row}B`);
              const seatC = filteredSeats.find((s) => s.id === `${activeDeck[0].toUpperCase()}${row}C`);
              const seatD = filteredSeats.find((s) => s.id === `${activeDeck[0].toUpperCase()}${row}D`);

              const getSeatStyle = (status: string) => {
                if (status === 'booked') return 'bg-gray-100 text-gray-300 cursor-not-allowed border border-gray-200';
                if (status === 'selected') return 'bg-[#6A1B9A] text-white shadow-md shadow-purple-900/20 border border-[#6A1B9A]';
                return 'bg-white border-2 border-[#22C55E] text-[#22C55E] hover:bg-[#F0FDF4] hover:shadow-sm';
              };

              return (
                <div key={row} className="flex gap-3 justify-center">
                  {isSleeper ? (
                    <>
                      <div className="flex gap-2">
                        <button
                          onClick={() => seatA && seatA.status !== 'booked' && toggleSeat(seatA.id)}
                          className={`w-11 h-14 rounded-xl flex items-center justify-center text-[10px] font-bold transition-all ${getSeatStyle(seatA?.status || 'available')}`}
                          disabled={seatA?.status === 'booked'}
                        >
                          {seatA?.id}
                        </button>
                        <button
                          onClick={() => seatB && seatB.status !== 'booked' && toggleSeat(seatB.id)}
                          className={`w-11 h-14 rounded-xl flex items-center justify-center text-[10px] font-bold transition-all ${getSeatStyle(seatB?.status || 'available')}`}
                          disabled={seatB?.status === 'booked'}
                        >
                          {seatB?.id}
                        </button>
                      </div>
                      <div className="w-5"></div>
                      <button
                        onClick={() => seatC && seatC.status !== 'booked' && toggleSeat(seatC.id)}
                        className={`w-11 h-14 rounded-xl flex items-center justify-center text-[10px] font-bold transition-all ${getSeatStyle(seatC?.status || 'available')}`}
                        disabled={seatC?.status === 'booked'}
                      >
                        {seatC?.id}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <button
                          onClick={() => seatA && seatA.status !== 'booked' && toggleSeat(seatA.id)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${getSeatStyle(seatA?.status || 'available')}`}
                          disabled={seatA?.status === 'booked'}
                        >
                          {seatA?.id}
                        </button>
                        <button
                          onClick={() => seatB && seatB.status !== 'booked' && toggleSeat(seatB.id)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${getSeatStyle(seatB?.status || 'available')}`}
                          disabled={seatB?.status === 'booked'}
                        >
                          {seatB?.id}
                        </button>
                      </div>
                      <div className="w-5"></div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => seatC && seatC.status !== 'booked' && toggleSeat(seatC.id)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${getSeatStyle(seatC?.status || 'available')}`}
                          disabled={seatC?.status === 'booked'}
                        >
                          {seatC?.id}
                        </button>
                        <button
                          onClick={() => seatD && seatD.status !== 'booked' && toggleSeat(seatD.id)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${getSeatStyle(seatD?.status || 'available')}`}
                          disabled={seatD?.status === 'booked'}
                        >
                          {seatD?.id}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-5 mt-5 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded border-2 border-[#22C55E] bg-white"></div>
              <span className="text-[10px] text-gray-500">Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-[#6A1B9A] shadow-sm"></div>
              <span className="text-[10px] text-gray-500">Selected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200"></div>
              <span className="text-[10px] text-gray-500">Booked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Boarding & Dropping */}
      <div className="px-4 pt-3 flex flex-col gap-3">
        <div>
          <label className="text-xs font-bold text-[#1E293B] mb-1.5 block">Boarding Point</label>
          <button 
            onClick={() => setShowBoarding(!showBoarding)} 
            className="w-full bg-white rounded-xl p-3.5 flex items-center justify-between shadow-sm border border-gray-100 text-left"
          >
            <span className={`text-xs ${boardingPoint ? 'text-[#1E293B] font-semibold' : 'text-gray-400'}`}>{boardingPoint || 'Select boarding point'}</span>
            <i className={`ri-arrow-down-s-line text-gray-400 transition-transform ${showBoarding ? 'rotate-180' : ''}`}></i>
          </button>
          {showBoarding && (
            <div className="mt-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {boardingPoints.map((point) => (
                <button 
                  key={point} 
                  onClick={() => { setBoardingPoint(point); setShowBoarding(false); }} 
                  className={`w-full text-left px-4 py-3 text-xs ${boardingPoint === point ? 'text-[#6A1B9A] font-bold bg-[#F3E5F5]' : 'text-[#1E293B] hover:bg-gray-50'}`}
                >
                  {point}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-xs font-bold text-[#1E293B] mb-1.5 block">Dropping Point</label>
          <button 
            onClick={() => setShowDropping(!showDropping)} 
            className="w-full bg-white rounded-xl p-3.5 flex items-center justify-between shadow-sm border border-gray-100 text-left"
          >
            <span className={`text-xs ${droppingPoint ? 'text-[#1E293B] font-semibold' : 'text-gray-400'}`}>{droppingPoint || 'Select dropping point'}</span>
            <i className={`ri-arrow-down-s-line text-gray-400 transition-transform ${showDropping ? 'rotate-180' : ''}`}></i>
          </button>
          {showDropping && (
            <div className="mt-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {droppingPoints.map((point) => (
                <button 
                  key={point} 
                  onClick={() => { setDroppingPoint(point); setShowDropping(false); }} 
                  className={`w-full text-left px-4 py-3 text-xs ${droppingPoint === point ? 'text-[#6A1B9A] font-bold bg-[#F3E5F5]' : 'text-[#1E293B] hover:bg-gray-50'}`}
                >
                  {point}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Summary */}
      <div className="px-4 pt-4 pb-6 mt-auto">
        {selectedSeats.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-gray-100 mb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">{selectedSeats.length} seat(s) selected</p>
                <p className="text-[10px] text-gray-400">{selectedSeats.map((s) => s.id).join(', ')}</p>
              </div>
              <p className="text-xl font-bold text-[#1E293B]">₹{totalPrice}</p>
            </div>
          </div>
        )}
        <Link href={`/checkout?busId=${encodeURIComponent(busId)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}&seats=${encodeURIComponent(selectedSeats.map((s) => s.id).join(','))}&boarding=${encodeURIComponent(boardingPoint)}&dropping=${encodeURIComponent(droppingPoint)}&amount=${encodeURIComponent(String(totalPrice))}`}>
          <button
            disabled={selectedSeats.length === 0 || !boardingPoint || !droppingPoint}
            className="w-full bg-[#6A1B9A] text-white font-semibold text-sm py-4 rounded-2xl shadow-lg shadow-[#6A1B9A]/25 active:scale-[0.98] transition-all disabled:bg-gray-200 disabled:shadow-none disabled:text-gray-400"
          >
            {selectedSeats.length === 0 ? 'Select Seats to Continue' : `Continue to Pay ₹${totalPrice}`}
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function SeatSelectionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Loading seats...</div>}>
      <SeatSelectionContent />
    </Suspense>
  );
}