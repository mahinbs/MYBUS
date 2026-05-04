'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getBusFeedback } from '@/lib/feedback-store';
import { getRouteStops } from '@/lib/route-data';

const buses = [
  { id: 'B001', operator: 'VRL Travels', type: 'AC Sleeper (2+1)', rating: 4.6, reviews: 1205, dep: '21:30', arr: '05:45', duration: '8h 15m', price: 899, originalPrice: 1299, seatsLeft: 12, amenities: ['WiFi', 'Charging', 'AC'], cheapest: true, boarding: 'Kashmere Gate ISBT', dropping: 'Sindhi Camp Bus Stand', womenOnly: false, liveTracking: true, freeCancellation: true },
  { id: 'B002', operator: 'SRS Travels', type: 'Non-AC Seater (2+2)', rating: 4.2, reviews: 892, dep: '22:00', arr: '06:30', duration: '8h 30m', price: 549, originalPrice: 799, seatsLeft: 8, amenities: ['Charging'], boarding: 'Rajouri Garden Metro', dropping: 'Mahatma Gandhi Hospital', womenOnly: true, liveTracking: false, freeCancellation: true },
  { id: 'B003', operator: 'KSRTC Airavat', type: 'AC Seater (2+2)', rating: 4.4, reviews: 2100, dep: '20:15', arr: '04:30', duration: '8h 15m', price: 749, originalPrice: 999, seatsLeft: 5, amenities: ['WiFi', 'AC', 'Water'], boarding: 'Anand Vihar ISBT', dropping: 'Durgapura Circle', womenOnly: false, liveTracking: true, freeCancellation: false },
  { id: 'B004', operator: 'Orange Travels', type: 'AC Sleeper (2+1)', rating: 4.7, reviews: 567, dep: '23:00', arr: '07:15', duration: '8h 15m', price: 999, originalPrice: 1399, seatsLeft: 3, amenities: ['WiFi', 'Charging', 'AC', 'Blanket'], boarding: 'AIIMS Metro Station', dropping: 'Malviya Nagar', womenOnly: false, liveTracking: true, freeCancellation: true },
  { id: 'B005', operator: 'National Travels', type: 'Volvo AC (2+2)', rating: 4.3, reviews: 1450, dep: '19:45', arr: '04:00', duration: '8h 15m', price: 849, originalPrice: 1199, seatsLeft: 18, amenities: ['WiFi', 'AC', 'Entertainment'], boarding: 'Kashmere Gate ISBT', dropping: 'Jhotwara Road', womenOnly: true, liveTracking: true, freeCancellation: false },
  { id: 'B006', operator: 'Neeta Travels', type: 'AC Sleeper (2+1)', rating: 4.5, reviews: 780, dep: '21:00', arr: '05:30', duration: '8h 30m', price: 950, originalPrice: 1250, seatsLeft: 7, amenities: ['WiFi', 'Charging', 'AC', 'Water'], boarding: 'Dwarka Sector 21', dropping: 'Sindhi Camp Bus Stand', womenOnly: false, liveTracking: false, freeCancellation: true },
  { id: 'B007', operator: 'Sharma Travels', type: 'Non-AC Sleeper (2+1)', rating: 3.9, reviews: 430, dep: '20:30', arr: '05:00', duration: '8h 30m', price: 499, originalPrice: 699, seatsLeft: 22, amenities: ['Charging'], boarding: 'Rajouri Garden Metro', dropping: 'Mahatma Gandhi Hospital', womenOnly: false, liveTracking: false, freeCancellation: false },
  { id: 'B008', operator: 'Raj Express', type: 'AC Seater (2+2)', rating: 4.1, reviews: 670, dep: '22:30', arr: '06:45', duration: '8h 15m', price: 650, originalPrice: 850, seatsLeft: 15, amenities: ['AC', 'Water'], boarding: 'Anand Vihar ISBT', dropping: 'Durgapura Circle', womenOnly: true, liveTracking: true, freeCancellation: true },
];

const filterPills = [
  { key: 'all', label: 'All', count: 8 },
  { key: 'cheapest', label: 'Cheapest', count: null },
  { key: 'fastest', label: 'Fastest', count: null },
  { key: 'ac', label: 'AC', count: null },
  { key: 'sleeper', label: 'Sleeper', count: null },
];

function BusListContent() {
  const params = useSearchParams();
  const from = params.get('from') || 'Delhi';
  const to = params.get('to') || 'Jaipur';
  const date = params.get('date') || '2026-05-01';

  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedBus, setExpandedBus] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1200);
  const [minRating, setMinRating] = useState(0);
  const [onlySeatsAvailable, setOnlySeatsAvailable] = useState(false);
  const [amenityFilter, setAmenityFilter] = useState<'all' | 'WiFi' | 'Charging' | 'AC'>('all');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedBusType, setSelectedBusType] = useState<'all' | 'AC' | 'Non-AC' | 'Sleeper' | 'Seater'>('all');
  const [departureSlot, setDepartureSlot] = useState<'all' | 'morning' | 'afternoon' | 'evening' | 'night'>('all');
  const [selectedBoarding, setSelectedBoarding] = useState('all');
  const [selectedDropping, setSelectedDropping] = useState('all');
  const [selectedOperator, setSelectedOperator] = useState('all');
  const [womenOnly, setWomenOnly] = useState(false);
  const [liveTrackingOnly, setLiveTrackingOnly] = useState(false);
  const [freeCancellationOnly, setFreeCancellationOnly] = useState(false);

  const primaryFiltered = activeFilter === 'all' ? buses :
    activeFilter === 'cheapest' ? [...buses].sort((a, b) => a.price - b.price) :
    activeFilter === 'fastest' ? [...buses].sort((a, b) => a.duration.localeCompare(b.duration)) :
    activeFilter === 'ac' ? buses.filter((b) => b.type.includes('AC') && !b.type.includes('Non-AC')) :
    activeFilter === 'sleeper' ? buses.filter((b) => b.type.includes('Sleeper')) :
    buses;
  const feedback = getBusFeedback();
  const routeStops = getRouteStops(from, to);
  const withRatings = primaryFiltered.map((bus, idx) => {
    const perBus = feedback.filter((f) => f.busId === bus.id);
    const routeBoarding = routeStops.boarding[idx % routeStops.boarding.length];
    const routeDropping = routeStops.dropping[idx % routeStops.dropping.length];
    if (perBus.length === 0) {
      return { ...bus, boarding: routeBoarding, dropping: routeDropping };
    }
    const avg = perBus.reduce((sum, f) => sum + f.rating, 0) / perBus.length;
    return {
      ...bus,
      boarding: routeBoarding,
      dropping: routeDropping,
      rating: Number(avg.toFixed(1)),
      reviews: bus.reviews + perBus.length,
    };
  });
  const boardingOptions = Array.from(new Set(buses.map((b) => b.boarding)));
  const droppingOptions = Array.from(new Set(buses.map((b) => b.dropping)));
  const operatorOptions = Array.from(new Set(buses.map((b) => b.operator)));

  const filtered = withRatings.filter((bus) => {
    if (bus.price < minPrice) return false;
    if (bus.price > maxPrice) return false;
    if (bus.rating < minRating) return false;
    if (onlySeatsAvailable && bus.seatsLeft < 4) return false;
    if (amenityFilter !== 'all' && !bus.amenities.includes(amenityFilter)) return false;
    if (selectedBusType !== 'all' && !bus.type.includes(selectedBusType)) return false;
    if (selectedOperator !== 'all' && bus.operator !== selectedOperator) return false;
    if (selectedBoarding !== 'all' && bus.boarding !== selectedBoarding) return false;
    if (selectedDropping !== 'all' && bus.dropping !== selectedDropping) return false;
    if (womenOnly && !bus.womenOnly) return false;
    if (liveTrackingOnly && !bus.liveTracking) return false;
    if (freeCancellationOnly && !bus.freeCancellation) return false;
    if (departureSlot !== 'all') {
      const hour = Number(bus.dep.split(':')[0]);
      const slot =
        hour < 12 ? 'morning' :
        hour < 17 ? 'afternoon' :
        hour < 21 ? 'evening' :
        'night';
      if (slot !== departureSlot) return false;
    }
    return true;
  });

  return (
    <>
    <div className="flex flex-col min-h-screen bg-[#F8F0FC]">
      {/* Dark Header */}
      <div className="bg-[#4A148C] px-4 pt-4 pb-5 rounded-b-3xl shadow-lg shadow-purple-900/20">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/">
            <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <i className="ri-arrow-left-line text-white"></i>
            </button>
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-sm font-bold text-white">{from} to {to}</h1>
            <p className="text-[10px] text-white/60 mt-0.5">{date}</p>
          </div>
          <button
            onClick={() => setShowFilterPanel(true)}
            className="h-8 rounded-full bg-white/10 px-3 text-[10px] font-semibold text-white border border-white/20"
          >
            <i className="ri-filter-3-line mr-1" />
            Filters
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {filterPills.map((f) => (
            <button 
              key={f.key} 
              onClick={() => setActiveFilter(f.key)} 
              className={`px-3.5 py-2 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                activeFilter === f.key 
                  ? 'bg-white text-[#4A148C] shadow-md' 
                  : 'bg-white/15 text-white/90 border border-white/20'
              }`}
            >
              {f.label}
              {f.count && <span className="ml-1 opacity-70">{f.count} trips</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Bus List */}
      <div className="px-4 pt-4 pb-6 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center text-sm text-gray-500">No buses match current filters.</div>
        ) : null}
        {filtered.map((bus) => (
          <div 
            key={bus.id} 
            className={`bg-white rounded-2xl p-4 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border ${bus.cheapest ? 'border-[#6A1B9A]/20' : 'border-gray-50'}`}
          >
            {/* Operator + Price Row */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1E293B]">{bus.operator}</span>
                {bus.cheapest && (
                  <span className="px-2 py-0.5 bg-[#F3E5F5] text-[#6A1B9A] text-[9px] font-bold rounded-full uppercase tracking-wide">
                    Cheapest
                  </span>
                )}
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-[#1E293B]">₹{bus.price}</p>
                <p className="text-[10px] text-gray-400 line-through">₹{bus.originalPrice}</p>
              </div>
            </div>

            {/* Time Timeline */}
            <div className="flex items-center gap-3">
              <div className="text-center min-w-[50px]">
                <p className="text-sm font-bold text-[#1E293B]">{bus.dep}</p>
                <p className="text-[10px] text-gray-400">{from}</p>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <p className="text-[10px] text-gray-400">{bus.duration}</p>
                <div className="w-full flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="flex-1 h-[2px] bg-gray-200 rounded-full"></div>
                  <i className="ri-bus-line text-[#6A1B9A] text-xs"></i>
                  <div className="flex-1 h-[2px] bg-gray-200 rounded-full"></div>
                  <div className="w-2 h-2 rounded-full bg-[#6A1B9A]"></div>
                </div>
              </div>
              <div className="text-center min-w-[50px]">
                <p className="text-sm font-bold text-[#1E293B]">{bus.arr}</p>
                <p className="text-[10px] text-gray-400">{to}</p>
              </div>
            </div>

            {/* Stop Names */}
            <div className="flex items-start gap-3 mt-2 pl-[50px] pr-[50px]">
              <p className="text-[10px] text-gray-400 line-clamp-1 flex-1">{bus.boarding}</p>
              <p className="text-[10px] text-gray-400 line-clamp-1 flex-1 text-right">{bus.dropping}</p>
            </div>

            {/* Tags & Amenities */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <div className="flex items-center gap-1 bg-gray-50 rounded-lg px-2 py-1">
                <i className="ri-star-fill text-[#FBBF24] text-[10px]"></i>
                <span className="text-[10px] font-semibold text-[#1E293B]">{bus.rating}</span>
                <span className="text-[10px] text-gray-400">({bus.reviews})</span>
              </div>
              <span className="text-[10px] text-[#6A1B9A] font-medium bg-[#F3E5F5] rounded-lg px-2 py-1">{bus.seatsLeft} seats left</span>
              {bus.womenOnly ? <span className="text-[10px] text-pink-700 bg-pink-50 rounded-lg px-2 py-1">Women only</span> : null}
              {bus.liveTracking ? <span className="text-[10px] text-blue-700 bg-blue-50 rounded-lg px-2 py-1">Live tracking</span> : null}
              {bus.freeCancellation ? <span className="text-[10px] text-green-700 bg-green-50 rounded-lg px-2 py-1">Free cancellation</span> : null}
              {bus.amenities.slice(0, 3).map((a) => (
                <span key={a} className="text-[10px] text-gray-400 flex items-center gap-0.5 bg-gray-50 rounded-lg px-2 py-1">
                  {a === 'WiFi' && <i className="ri-wifi-line"></i>}
                  {a === 'Charging' && <i className="ri-battery-charge-line"></i>}
                  {a === 'AC' && <i className="ri-snowflake-line"></i>}
                  {a === 'Water' && <i className="ri-cup-line"></i>}
                  {a === 'Blanket' && <i className="ri-hotel-bed-line"></i>}
                  {a === 'Entertainment' && <i className="ri-tv-line"></i>}
                  {a}
                </span>
              ))}
              <button 
                onClick={() => setExpandedBus(expandedBus === bus.id ? null : bus.id)}
                className="text-[10px] text-[#6A1B9A] font-semibold flex items-center gap-0.5 ml-auto"
              >
                Details
                <i className={`ri-arrow-down-s-line transition-transform ${expandedBus === bus.id ? 'rotate-180' : ''}`}></i>
              </button>
            </div>

            {/* Expanded Details */}
            {expandedBus === bus.id && (
              <div className="mt-3 pt-3 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <p className="text-[10px] text-gray-400">Boarding Point</p>
                    <p className="text-xs font-medium text-[#1E293B]">{bus.boarding}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Dropping Point</p>
                    <p className="text-xs font-medium text-[#1E293B]">{bus.dropping}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {bus.amenities.map((a) => (
                    <span key={a} className="text-[10px] text-gray-500 flex items-center gap-1 bg-gray-50 rounded-lg px-2 py-1">
                      {a === 'WiFi' && <i className="ri-wifi-line text-[#6A1B9A]"></i>}
                      {a === 'Charging' && <i className="ri-battery-charge-line text-[#6A1B9A]"></i>}
                      {a === 'AC' && <i className="ri-snowflake-line text-[#6A1B9A]"></i>}
                      {a === 'Water' && <i className="ri-cup-line text-[#6A1B9A]"></i>}
                      {a === 'Blanket' && <i className="ri-hotel-bed-line text-[#6A1B9A]"></i>}
                      {a === 'Entertainment' && <i className="ri-tv-line text-[#6A1B9A]"></i>}
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <Link href={`/seat-selection?busId=${bus.id}&from=${from}&to=${to}&date=${date}`}>
              <button className="w-full mt-3 bg-[#6A1B9A] text-white font-semibold text-xs py-3 rounded-xl active:scale-[0.98] transition-transform hover:bg-[#581888]">
                Select Seats
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
      {showFilterPanel && (
        <div className="fixed inset-0 z-[120] bg-black/30 backdrop-blur-[1px]">
          <div className="absolute bottom-0 left-0 right-0 flex h-[86vh] flex-col rounded-t-3xl bg-white">
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 pb-3 pt-4">
              <h2 className="text-sm font-bold text-[#1E293B]">Filter Buses</h2>
              <button onClick={() => setShowFilterPanel(false)} className="h-8 w-8 rounded-full bg-gray-100">
                <i className="ri-close-line text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pt-3 pb-5">
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-semibold text-gray-600 mb-2">Price Range</p>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value) || 0)} className="rounded-xl border border-gray-200 px-3 py-2 text-xs" placeholder="Min fare" />
                  <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value) || 0)} className="rounded-xl border border-gray-200 px-3 py-2 text-xs" placeholder="Max fare" />
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-gray-600 mb-2">Bus Type</p>
                <div className="flex gap-2 flex-wrap">
                  {(['all', 'AC', 'Non-AC', 'Sleeper', 'Seater'] as const).map((x) => (
                    <button key={x} onClick={() => setSelectedBusType(x)} className={`px-3 py-1.5 rounded-full text-[11px] font-semibold ${selectedBusType === x ? 'bg-[#6A1B9A] text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {x}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-gray-600 mb-2">Operator</p>
                <select value={selectedOperator} onChange={(e) => setSelectedOperator(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs">
                  <option value="all">All operators</option>
                  {operatorOptions.map((x) => <option key={x} value={x}>{x}</option>)}
                </select>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-gray-600 mb-2">Departure Time</p>
                <div className="flex gap-2 flex-wrap">
                  {(['all', 'morning', 'afternoon', 'evening', 'night'] as const).map((x) => (
                    <button key={x} onClick={() => setDepartureSlot(x)} className={`px-3 py-1.5 rounded-full text-[11px] font-semibold capitalize ${departureSlot === x ? 'bg-[#6A1B9A] text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {x}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-gray-600 mb-2">Ratings & Amenities</p>
                <div className="flex gap-2 flex-wrap">
                  {[0, 4, 4.5].map((v) => (
                    <button
                      key={v}
                      onClick={() => setMinRating(v)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-semibold ${minRating === v ? 'bg-[#6A1B9A] text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {v === 0 ? 'Any rating' : `${v}+`}
                    </button>
                  ))}
                  <button onClick={() => setOnlySeatsAvailable((s) => !s)} className={`px-3 py-1.5 rounded-full text-[11px] font-semibold ${onlySeatsAvailable ? 'bg-[#6A1B9A] text-white' : 'bg-gray-100 text-gray-600'}`}>4+ seats</button>
                  {(['all', 'WiFi', 'Charging', 'AC'] as const).map((item) => (
                    <button key={item} onClick={() => setAmenityFilter(item)} className={`px-3 py-1.5 rounded-full text-[11px] font-semibold ${amenityFilter === item ? 'bg-[#6A1B9A] text-white' : 'bg-gray-100 text-gray-600'}`}>{item}</button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-gray-600 mb-2">Special Preferences</p>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => setWomenOnly((v) => !v)} className={`px-3 py-1.5 rounded-full text-[11px] font-semibold ${womenOnly ? 'bg-[#6A1B9A] text-white' : 'bg-gray-100 text-gray-600'}`}>Women only</button>
                  <button onClick={() => setLiveTrackingOnly((v) => !v)} className={`px-3 py-1.5 rounded-full text-[11px] font-semibold ${liveTrackingOnly ? 'bg-[#6A1B9A] text-white' : 'bg-gray-100 text-gray-600'}`}>Live tracking</button>
                  <button onClick={() => setFreeCancellationOnly((v) => !v)} className={`px-3 py-1.5 rounded-full text-[11px] font-semibold ${freeCancellationOnly ? 'bg-[#6A1B9A] text-white' : 'bg-gray-100 text-gray-600'}`}>Free cancellation</button>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-gray-600 mb-2">Boarding Point</p>
                <select value={selectedBoarding} onChange={(e) => setSelectedBoarding(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs">
                  <option value="all">All boarding points</option>
                  {boardingOptions.map((x) => <option key={x} value={x}>{x}</option>)}
                </select>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-gray-600 mb-2">Dropping Point</p>
                <select value={selectedDropping} onChange={(e) => setSelectedDropping(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs">
                  <option value="all">All dropping points</option>
                  {droppingOptions.map((x) => <option key={x} value={x}>{x}</option>)}
                </select>
              </div>
            </div>
            </div>

            <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-gray-100 bg-white px-4 py-3">
              <button
                onClick={() => {
                  setSelectedBusType('all');
                  setSelectedOperator('all');
                  setDepartureSlot('all');
                  setSelectedBoarding('all');
                  setSelectedDropping('all');
                  setMinPrice(0);
                  setMaxPrice(1200);
                  setMinRating(0);
                  setOnlySeatsAvailable(false);
                  setAmenityFilter('all');
                  setWomenOnly(false);
                  setLiveTrackingOnly(false);
                  setFreeCancellationOnly(false);
                }}
                className="rounded-xl border border-gray-200 py-3 text-xs font-semibold text-gray-600"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilterPanel(false)}
                className="rounded-xl bg-[#6A1B9A] py-3 text-xs font-semibold text-white"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function BusListingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Loading buses...</div>}>
      <BusListContent />
    </Suspense>
  );
}