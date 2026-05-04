'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

const allCities = [
  'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Chandigarh', 'Indore', 'Bhopal', 'Nagpur', 'Patna', 'Coimbatore', 'Visakhapatnam', 'Surat', 'Vadodara', 'Mysore',
  'Kochi', 'Thiruvananthapuram', 'Madurai', 'Vijayawada', 'Guntur', 'Raipur', 'Ranchi', 'Guwahati'
];

function SearchForm() {
  const params = useSearchParams();
  const [source, setSource] = useState(params.get('from') || '');
  const [dest, setDest] = useState(params.get('to') || '');
  const [date, setDate] = useState(params.get('date') || '');
  const [showSourceList, setShowSourceList] = useState(false);
  const [showDestList, setShowDestList] = useState(false);
  const [activeField, setActiveField] = useState<'source' | 'dest' | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const filteredCities = (query: string) =>
    allCities.filter((c) => c.toLowerCase().includes(query.toLowerCase()) && c !== (activeField === 'source' ? dest : source));
  const canSearch = Boolean(source.trim() && dest.trim() && date && source.trim().toLowerCase() !== dest.trim().toLowerCase());

  return (
    <div className="px-4 pt-4 bg-[#F8F0FC] min-h-screen">
      {/* Search Card */}
      <div className="bg-white rounded-3xl p-5 shadow-[0_8px_32px_rgba(106,27,154,0.12)] border border-purple-100/50">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-9 h-9 rounded-full bg-[#F3E5F5] flex items-center justify-center shrink-0">
            <i className="ri-map-pin-2-line text-[#6A1B9A] text-lg"></i>
          </div>
          <div className="flex-1">
            <label className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">From</label>
            <input
              type="text"
              placeholder="Enter source city"
              value={source}
              onFocus={() => { setActiveField('source'); setShowSourceList(true); setShowDestList(false); }}
              onChange={(e) => setSource(e.target.value)}
              className="w-full text-sm font-semibold text-[#1E293B] placeholder-gray-300 border-none outline-none bg-transparent"
            />
          </div>
          <button 
            className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-[#F3E5F5] transition-colors"
            onClick={() => { const t = source; setSource(dest); setDest(t); }}
          >
            <i className="ri-arrow-left-right-line text-gray-500 text-sm"></i>
          </button>
        </div>

        {showSourceList && activeField === 'source' && (
          <div className="mt-2 bg-gray-50 rounded-xl p-2 max-h-48 overflow-y-auto">
            {filteredCities(source).map((city) => (
              <button 
                key={city} 
                onClick={() => { setSource(city); setShowSourceList(false); }} 
                className="w-full text-left px-3 py-2.5 text-xs text-[#1E293B] hover:bg-white rounded-xl flex items-center gap-2 transition-colors"
              >
                <i className="ri-map-pin-line text-gray-400 text-sm"></i>
                {city}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 py-4 border-b border-gray-100">
          <div className="w-9 h-9 rounded-full bg-[#EDE9FE] flex items-center justify-center shrink-0">
            <i className="ri-map-pin-fill text-[#7C3AED] text-lg"></i>
          </div>
          <div className="flex-1">
            <label className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">To</label>
            <input
              type="text"
              placeholder="Enter destination city"
              value={dest}
              onFocus={() => { setActiveField('dest'); setShowDestList(true); setShowSourceList(false); }}
              onChange={(e) => setDest(e.target.value)}
              className="w-full text-sm font-semibold text-[#1E293B] placeholder-gray-300 border-none outline-none bg-transparent"
            />
          </div>
        </div>

        {showDestList && activeField === 'dest' && (
          <div className="mt-2 bg-gray-50 rounded-xl p-2 max-h-48 overflow-y-auto">
            {filteredCities(dest).map((city) => (
              <button 
                key={city} 
                onClick={() => { setDest(city); setShowDestList(false); }} 
                className="w-full text-left px-3 py-2.5 text-xs text-[#1E293B] hover:bg-white rounded-xl flex items-center gap-2 transition-colors"
              >
                <i className="ri-map-pin-line text-gray-400 text-sm"></i>
                {city}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 pt-4">
          <div className="w-9 h-9 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0">
            <i className="ri-calendar-line text-[#3B82F6] text-lg"></i>
          </div>
          <div className="flex-1">
            <label className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Travel Date</label>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-sm font-semibold text-[#1E293B] border-none outline-none bg-transparent"
            />
          </div>
        </div>

        <Link href={canSearch ? `/bus-listings?from=${encodeURIComponent(source.trim())}&to=${encodeURIComponent(dest.trim())}&date=${encodeURIComponent(date)}` : '#'}>
          <button disabled={!canSearch} className="w-full mt-5 bg-[#6A1B9A] text-white font-semibold text-sm py-4 rounded-2xl shadow-lg shadow-[#6A1B9A]/25 active:scale-[0.98] transition-all hover:bg-[#581888] disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none">
            Search Buses
          </button>
        </Link>
        {!canSearch && (
          <p className="mt-2 text-[10px] text-rose-500">Enter valid source, destination and date to continue.</p>
        )}
      </div>

      {/* Recent Searches */}
      <div className="mt-8">
        <h2 className="text-sm font-bold text-[#1E293B] mb-3">Recent Searches</h2>
        <div className="flex flex-col gap-2.5">
          {[
            { from: 'Delhi', to: 'Jaipur', date: '2026-05-01' },
            { from: 'Mumbai', to: 'Pune', date: '2026-05-03' },
            { from: 'Bangalore', to: 'Hyderabad', date: '2026-04-28' },
          ].map((search, i) => (
            <Link 
              key={i} 
              href={`/bus-listings?from=${search.from}&to=${search.to}&date=${search.date}`} 
              className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-50 active:scale-[0.99] transition-transform"
            >
              <div className="w-10 h-10 rounded-full bg-[#F3E5F5] flex items-center justify-center">
                <i className="ri-history-line text-[#6A1B9A]"></i>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#1E293B]">{search.from}</span>
                  <i className="ri-arrow-right-line text-[10px] text-gray-400"></i>
                  <span className="text-xs font-bold text-[#1E293B]">{search.to}</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">{search.date}</p>
              </div>
              <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center">
                <i className="ri-arrow-right-s-line text-gray-400"></i>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Loading...</div>}>
      <SearchForm />
    </Suspense>
  );
}