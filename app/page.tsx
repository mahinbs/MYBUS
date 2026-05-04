'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const quickRoutes = [
  { from: 'Delhi', to: 'Jaipur', price: '₹299', image: 'https://readdy.ai/api/search-image?query=Aerial%20view%20of%20Delhi%20city%20with%20iconic%20India%20Gate%20monument%2C%20warm%20golden%20hour%20lighting%2C%20modern%20cityscape%20with%20historical%20architecture%2C%20professional%20travel%20photography%20style%2C%20soft%20blue%20sky%20background%2C%20clean%20composition&width=200&height=160&seq=1&orientation=landscape' },
  { from: 'Mumbai', to: 'Pune', price: '₹199', image: 'https://readdy.ai/api/search-image?query=Aerial%20view%20of%20Mumbai%20city%20skyline%20with%20Gateway%20of%20India%2C%20warm%20sunset%20lighting%2C%20modern%20skyscrapers%20by%20the%20ocean%2C%20professional%20travel%20photography%20style%2C%20soft%20orange%20sky%20background&width=200&height=160&seq=2&orientation=landscape' },
  { from: 'Bangalore', to: 'Hyderabad', price: '₹449', image: 'https://readdy.ai/api/search-image?query=Aerial%20view%20of%20Bangalore%20cityscape%20with%20modern%20tech%20parks%20and%20green%20gardens%2C%20warm%20morning%20lighting%2C%20professional%20travel%20photography%2C%20clean%20sky%20blue%20background&width=200&height=160&seq=3&orientation=landscape' },
  { from: 'Chennai', to: 'Coimbatore', price: '₹349', image: 'https://readdy.ai/api/search-image?query=Aerial%20view%20of%20Chennai%20coastal%20city%20with%20Marina%20Beach%20shoreline%2C%20warm%20golden%20lighting%2C%20modern%20cityscape%20meeting%20the%20ocean%2C%20professional%20travel%20photography&width=200&height=160&seq=4&orientation=landscape' },
];

const topOperators = [
  { name: 'VRL Travels', rating: 4.5, buses: 850, image: 'https://readdy.ai/api/search-image?query=Luxury%20Volvo%20bus%20on%20Indian%20highway%2C%20premium%20red%20and%20white%20bus%20body%2C%20professional%20commercial%20vehicle%20photography%2C%20clean%20road%20background%2C%20warm%20daylight&width=120&height=80&seq=5&orientation=landscape' },
  { name: 'SRS Travels', rating: 4.3, buses: 620, image: 'https://readdy.ai/api/search-image?query=Modern%20sleeper%20bus%20on%20Indian%20road%2C%20blue%20and%20silver%20bus%20design%2C%20professional%20commercial%20vehicle%20photography%2C%20clean%20highway%20background&width=120&height=80&seq=6&orientation=landscape' },
  { name: 'KSRTC', rating: 4.2, buses: 1200, image: 'https://readdy.ai/api/search-image?query=Kerala%20state%20road%20transport%20bus%20on%20scenic%20highway%2C%20green%20and%20white%20bus%2C%20professional%20commercial%20vehicle%20photography%2C%20lush%20green%20background&width=120&height=80&seq=7&orientation=landscape' },
];

const offers = [
  { title: 'New User Offer', desc: 'Flat 25% OFF', code: 'MYBUS25', bg: 'bg-[#F3E5F5]', accent: 'text-[#6A1B9A]' },
  { title: 'Weekend Special', desc: 'Extra 15% OFF', code: 'WEEK15', bg: 'bg-[#EDE9FE]', accent: 'text-[#7C3AED]' },
  { title: 'Student Deal', desc: '20% OFF', code: 'STUD20', bg: 'bg-[#FAF5FF]', accent: 'text-[#6A1B9A]' },
];

function formatTripDate(iso: string) {
  if (!iso) return 'Pick a date';
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export default function Home() {
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [source, setSource] = useState('Manchester, United Kingdom');
  const [dest, setDest] = useState('Paris, France');
  const [date, setDate] = useState(today);
  const [tripType, setTripType] = useState<'one-way' | 'round'>('one-way');
  const [passengers, setPassengers] = useState(2);
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);

  const searchHref = `/search?from=${encodeURIComponent(source)}&to=${encodeURIComponent(dest)}&date=${encodeURIComponent(date)}`;

  return (
    <div className="relative flex min-h-screen flex-col bg-app-grid">
      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-6 pt-3">
        {/* Search card — bordered rows like reference */}
        <div className="rounded-[22px] border border-gray-100 bg-white p-4 shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex gap-5">
              <button
                type="button"
                onClick={() => setTripType('one-way')}
                className={`pb-1 text-xs font-semibold transition-colors ${
                  tripType === 'one-way'
                    ? 'border-b-2 border-[#0F172A] text-[#0F172A]'
                    : 'border-b-2 border-transparent text-gray-400'
                }`}
              >
                One-way
              </button>
              <button
                type="button"
                onClick={() => setTripType('round')}
                className={`pb-1 text-xs font-semibold transition-colors ${
                  tripType === 'round'
                    ? 'border-b-2 border-[#0F172A] text-[#0F172A]'
                    : 'border-b-2 border-transparent text-gray-400'
                }`}
              >
                Round trip
              </button>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                className="flex items-center gap-1 text-xs font-medium text-gray-500"
              >
                <i className="ri-user-line text-base" />
                <span>{passengers}</span>
              </button>
              {showPassengerDropdown ? (
                <div className="absolute right-0 top-8 z-30 min-w-[132px] rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        setPassengers(n);
                        setShowPassengerDropdown(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs transition-colors hover:bg-[#F8F0FC] ${
                        passengers === n
                          ? 'font-bold text-[#6A1B9A]'
                          : 'text-gray-600'
                      }`}
                    >
                      {n} Passenger{n > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200/90 bg-[#FAFAFA] px-3 py-3">
              <i className="ri-map-pin-2-line shrink-0 text-lg text-gray-400" />
              <input
                type="text"
                placeholder="From"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="min-w-0 flex-1 border-none bg-transparent text-sm font-medium text-[#0F172A] outline-none placeholder:text-gray-400"
              />
              <button
                type="button"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-gray-100"
                onClick={() => {
                  const t = source;
                  setSource(dest);
                  setDest(t);
                }}
                aria-label="Swap from and to"
              >
                <i className="ri-arrow-up-down-line text-base text-[#6A1B9A]" />
              </button>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-gray-200/90 bg-[#FAFAFA] px-3 py-3">
              <i className="ri-map-pin-fill shrink-0 text-lg text-gray-400" />
              <input
                type="text"
                placeholder="To"
                value={dest}
                onChange={(e) => setDest(e.target.value)}
                className="min-w-0 flex-1 border-none bg-transparent text-sm font-medium text-[#0F172A] outline-none placeholder:text-gray-400"
              />
            </div>

            <div className="flex overflow-hidden rounded-xl border border-gray-200/90 bg-[#FAFAFA]">
              <label className="relative flex min-w-0 flex-1 cursor-pointer items-center gap-2 px-3 py-3">
                <i className="ri-calendar-line shrink-0 text-lg text-gray-400" />
                <span className="text-sm font-medium text-[#0F172A]">
                  {formatTripDate(date)}
                </span>
                <input
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </label>
              <div className="w-px shrink-0 bg-gray-200" />
              <button
                type="button"
                className="shrink-0 px-3 text-xs font-medium text-gray-400 transition-colors hover:text-gray-600"
              >
                + Add return
              </button>
            </div>
          </div>

          <Link href={searchHref} className="mt-4 block">
            <span className="flex w-full items-center justify-center rounded-2xl bg-[#0F172A] py-3.5 text-sm font-semibold text-white shadow-md transition-transform active:scale-[0.99]">
              Search
            </span>
          </Link>
        </div>

        {/* Cheap bus tickets */}
        <div className="mt-6">
          <h2 className="text-base font-bold tracking-tight text-[#0F172A]">
            Cheap bus tickets
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            from {source.trim() || 'Manchester, United Kingdom'} to{' '}
            {dest.trim() || 'Paris, France'}
          </p>

          <div className="relative mt-4">
            <div
              className="pointer-events-none absolute bottom-0 left-1/2 z-20 h-5 w-5 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#f8f0fc] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-[22px] border border-gray-200/90 bg-white shadow-[0_8px_28px_rgba(15,23,42,0.07)]">
              <div className="grid min-h-[172px] grid-cols-2">
                <div className="relative flex flex-col bg-[#F3E5F5] p-4">
                  <p className="text-xs font-medium text-gray-500">Cheapest</p>
                  <p className="mt-1 text-[28px] font-bold leading-none tracking-tight text-[#0F172A]">
                    £125
                  </p>
                  <div className="mt-auto pt-4">
                    <Link
                      href={searchHref}
                      className="inline-flex rounded-xl bg-[#D8B4FE] px-4 py-2.5 text-xs font-semibold text-[#5B21B6] shadow-sm transition-transform active:scale-[0.98]"
                    >
                      Find ticket
                    </Link>
                  </div>
                </div>

                <div
                  className="pointer-events-none absolute left-1/2 top-3 bottom-3 z-10 w-0 -translate-x-1/2 border-l border-dashed border-gray-300/90"
                  aria-hidden
                />

                <div className="relative flex flex-col bg-white p-4 pl-5">
                  <p className="text-xs font-medium text-gray-500">Average</p>
                  <p className="mt-1 text-[28px] font-bold leading-none tracking-tight text-[#0F172A]">
                    £146
                  </p>
                  <div className="mt-auto flex items-start gap-2 pt-3">
                    <i className="ri-lightbulb-line mt-0.5 shrink-0 text-lg leading-none text-gray-400" />
                    <p className="text-[11px] leading-snug text-gray-400">
                      Find a cheap fare by book as far in advance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exclusive Offers */}
        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-[#0F172A]">
              Exclusive Offers
            </h2>
            <button
              type="button"
              className="text-[11px] font-semibold text-[#6A1B9A]"
            >
              See all
            </button>
          </div>
          <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-1">
            {offers.map((offer) => (
              <div
                key={offer.code}
                className={`${offer.bg} min-w-[158px] flex-shrink-0 rounded-[18px] border border-white/60 p-4 shadow-sm`}
              >
                <p className="text-[10px] text-gray-500">{offer.title}</p>
                <p className={`mt-1 text-sm font-bold ${offer.accent}`}>
                  {offer.desc}
                </p>
                <div className="mt-3 flex items-center justify-between rounded-xl bg-white/80 px-2.5 py-1.5">
                  <span className="font-mono text-[10px] font-bold text-[#0F172A]">
                    {offer.code}
                  </span>
                  <i className="ri-file-copy-line text-xs text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Routes */}
        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-[#0F172A]">
              Trending Routes
            </h2>
            <button
              type="button"
              className="text-[11px] font-semibold text-[#6A1B9A]"
            >
              See all
            </button>
          </div>
          <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-1">
            {quickRoutes.map((route) => (
              <Link
                key={`${route.from}-${route.to}`}
                href={`/search?from=${encodeURIComponent(route.from)}&to=${encodeURIComponent(route.to)}`}
                className="min-w-[158px] flex-shrink-0 overflow-hidden rounded-[18px] border border-gray-100 bg-white shadow-[0_2px_14px_rgba(15,23,42,0.06)]"
              >
                <img
                  src={route.image}
                  alt=""
                  className="h-[84px] w-full object-cover"
                />
                <div className="p-3">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-[#0F172A]">
                      {route.from}
                    </span>
                    <i className="ri-arrow-right-line text-[10px] text-gray-400" />
                    <span className="text-xs font-bold text-[#0F172A]">
                      {route.to}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-gray-500">
                    Starting from {route.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Top Operators */}
        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-[#0F172A]">
              Top Operators
            </h2>
            <button
              type="button"
              className="text-[11px] font-semibold text-[#6A1B9A]"
            >
              See all
            </button>
          </div>
          <div className="flex flex-col gap-2.5">
            {topOperators.map((op) => (
              <div
                key={op.name}
                className="flex items-center gap-3 rounded-[18px] border border-gray-100 bg-white p-3 shadow-[0_2px_12px_rgba(15,23,42,0.05)]"
              >
                <img
                  src={op.image}
                  alt=""
                  className="h-11 w-[72px] rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#0F172A]">{op.name}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-[#0F172A]">
                      <i className="ri-star-fill text-[10px] text-amber-400" />
                      {op.rating}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {op.buses} buses
                    </span>
                  </div>
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FAFAFA]">
                  <i className="ri-arrow-right-s-line text-base text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
