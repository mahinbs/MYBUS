'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getStoredBookings } from '@/lib/booking-store';

type RouteStop = {
  name: string;
  lat: number;
  lng: number;
  haltMins: number;
};

const sampleRoute: RouteStop[] = [
  { name: 'Kashmere Gate ISBT', lat: 28.6678, lng: 77.2276, haltMins: 5 },
  { name: 'Gurugram Toll Plaza', lat: 28.4678, lng: 77.0825, haltMins: 3 },
  { name: 'Neemrana Midway', lat: 27.9887, lng: 76.3956, haltMins: 10 },
  { name: 'Shahpura Bypass', lat: 27.3917, lng: 75.9571, haltMins: 3 },
  { name: 'Sindhi Camp Bus Stand', lat: 26.9227, lng: 75.8089, haltMins: 0 },
];

function kmBetween(a: RouteStop, b: RouteStop) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const r = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const q =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return r * (2 * Math.atan2(Math.sqrt(q), Math.sqrt(1 - q)));
}

function formatEta(minutes: number) {
  const rounded = Math.max(1, Math.round(minutes));
  const h = Math.floor(rounded / 60);
  const m = rounded % 60;
  if (h === 0) return `${m} min`;
  return `${h}h ${m}m`;
}

const statCardClass = 'rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm';

function TrackContent() {
  const params = useSearchParams();
  const bookingId = params.get('bookingId') || '';
  const booking = useMemo(() => getStoredBookings().find((b) => b.id === bookingId), [bookingId]);
  const [progress, setProgress] = useState(18);
  const [speedKmph, setSpeedKmph] = useState(52);
  const [delayMins, setDelayMins] = useState(6);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const routeDistance = useMemo(() => {
    let total = 0;
    for (let i = 0; i < sampleRoute.length - 1; i++) {
      total += kmBetween(sampleRoute[i], sampleRoute[i + 1]);
    }
    return total;
  }, []);

  const livePosition = useMemo(() => {
    const clamped = Math.max(0, Math.min(99, progress));
    const segmentCount = sampleRoute.length - 1;
    const segmentFloat = (clamped / 100) * segmentCount;
    const segmentIndex = Math.min(segmentCount - 1, Math.floor(segmentFloat));
    const t = segmentFloat - segmentIndex;
    const current = sampleRoute[segmentIndex];
    const next = sampleRoute[segmentIndex + 1];
    return {
      lat: current.lat + (next.lat - current.lat) * t,
      lng: current.lng + (next.lng - current.lng) * t,
      segmentIndex,
      nextStop: next.name,
      currentStop: current.name,
      stationsLeft: Math.max(0, sampleRoute.length - (segmentIndex + 2)),
    };
  }, [progress]);

  const remainingDistanceKm = useMemo(() => {
    return Number((((100 - progress) / 100) * routeDistance).toFixed(1));
  }, [progress, routeDistance]);

  const etaMins = useMemo(() => {
    const travelMins = (remainingDistanceKm / Math.max(speedKmph, 20)) * 60;
    return travelMins + delayMins;
  }, [remainingDistanceKm, speedKmph, delayMins]);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => (p >= 96 ? 96 : p + 2));
      setSpeedKmph((s) => {
        const next = s + (Math.random() > 0.5 ? 3 : -2);
        return Math.max(35, Math.min(78, next));
      });
      setDelayMins((d) => {
        const next = d + (Math.random() > 0.7 ? 1 : 0);
        return Math.max(0, Math.min(18, next));
      });
      setLastUpdated(new Date());
    }, 60000);
    return () => clearInterval(id);
  }, []);

  if (!booking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#4A148C] via-[#F8F0FC] to-[#F8F0FC] px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm rounded-3xl bg-white p-8 text-center shadow-xl shadow-purple-900/10"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F3E5F5]">
            <i className="ri-bus-line text-3xl text-[#6A1B9A]" />
          </div>
          <p className="text-sm font-semibold text-[#1E293B]">Booking not found</p>
          <p className="mt-2 text-xs text-gray-500">Open tracking from My Bookings after you book a trip.</p>
          <Link
            href="/bookings"
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[#6A1B9A] py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-900/25"
          >
            Go to bookings
          </Link>
        </motion.div>
      </div>
    );
  }

  const onTime = delayMins <= 10;

  return (
    <div className="min-h-screen bg-[#F8F0FC] pb-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-b border-gray-100 bg-white px-4 pb-5 pt-4 shadow-sm"
      >

        <div className="relative flex items-center gap-3">
          <Link
            href="/bookings"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-[#1E293B] transition active:scale-95"
          >
            <i className="ri-arrow-left-line text-xl" />
          </Link>
          <div className="flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">Live tracking</p>
            <h1 className="text-lg font-bold leading-tight text-[#1E293B]">{booking.operator}</h1>
            <p className="mt-0.5 text-xs text-gray-500">
              {booking.from} <i className="ri-arrow-right-line mx-0.5 align-middle text-[10px]" /> {booking.to}
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 ring-1 ring-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">Live</span>
          </div>
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 22 }}
          className="relative mt-4 overflow-hidden rounded-2xl border border-gray-100"
        >
          <iframe
            title="Live map"
            src={`https://maps.google.com/maps?q=${livePosition.lat},${livePosition.lng}&z=11&output=embed`}
            className="h-48 w-full"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <motion.div
            className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-black/55 px-3 py-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-[10px] font-medium text-white/90">Updates every 1 minute</span>
            <span className="font-mono text-[10px] text-emerald-300">{lastUpdated.toLocaleTimeString()}</span>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="space-y-4 px-4 pt-4">
        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Journey progress</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-[#1E293B]">{progress}%</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
                onTime ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-amber-50 text-amber-800 ring-1 ring-amber-200'
              }`}
            >
              {onTime ? 'On time' : `+${delayMins} min`}
            </span>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#6A1B9A] to-[#D8B4FE]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            />
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'ETA', value: formatEta(etaMins), icon: 'ri-time-line', tint: 'from-violet-500/15 to-fuchsia-500/10' },
            { label: 'Distance left', value: `${remainingDistanceKm} km`, icon: 'ri-road-map-line', tint: 'from-blue-500/15 to-cyan-500/10' },
            { label: 'Speed', value: `${speedKmph} km/h`, icon: 'ri-speed-up-line', tint: 'from-slate-500/10 to-slate-400/5' },
            { label: 'Stops left', value: String(livePosition.stationsLeft), icon: 'ri-map-pin-line', tint: 'from-emerald-500/15 to-teal-500/10' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              whileTap={{ scale: 0.98 }}
              className={statCardClass}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">{item.label}</p>
                  <p className="mt-1 text-lg font-bold tracking-tight text-[#1E293B]">{item.value}</p>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/90 shadow-sm">
                  <i className={`${item.icon} text-lg text-[#6A1B9A]`} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Status card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-3xl border border-gray-100 bg-white p-4 shadow-[0_4px_24px_rgba(15,23,42,0.06)]"
        >
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Trip status</p>
          <div className="mt-3 space-y-2.5 text-sm">
            <div className="flex gap-2">
              <i className="ri-route-line mt-0.5 text-[#6A1B9A]" />
              <p className="text-[#1E293B]">
                <span className="font-semibold">Near</span> {livePosition.currentStop}
              </p>
            </div>
            <div className="flex gap-2">
              <i className="ri-flag-line mt-0.5 text-[#2563EB]" />
              <p className="text-gray-600">
                <span className="font-semibold text-[#1E293B]">Next:</span> {livePosition.nextStop}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl border border-gray-100 bg-white p-4 shadow-[0_4px_24px_rgba(15,23,42,0.06)]"
        >
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Route stops</p>
          <div className="relative mt-4 space-y-0 pl-1">
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#6A1B9A] via-[#6A1B9A]/40 to-gray-200" />
            {sampleRoute.map((stop, idx) => {
              const isDone = idx <= livePosition.segmentIndex;
              const isNext = idx === livePosition.segmentIndex + 1;
              return (
                <motion.div
                  key={stop.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + idx * 0.04 }}
                  className="relative flex gap-3 pb-6 last:pb-0"
                >
                  <motion.span
                    animate={
                      isNext
                        ? { scale: [1, 1.2, 1], boxShadow: ['0 0 0 0 rgba(37,99,235,0.4)', '0 0 0 8px rgba(37,99,235,0)', '0 0 0 0 rgba(37,99,235,0)'] }
                        : {}
                    }
                    transition={isNext ? { duration: 2, repeat: Infinity } : {}}
                    className={`relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      isDone ? 'bg-[#6A1B9A] text-white' : isNext ? 'bg-[#2563EB] text-white ring-4 ring-blue-200' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isDone ? <i className="ri-check-line" /> : idx + 1}
                  </motion.span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className={`text-sm font-semibold ${isDone || isNext ? 'text-[#1E293B]' : 'text-gray-400'}`}>{stop.name}</p>
                    {isNext ? (
                      <p className="mt-0.5 text-[10px] font-medium text-blue-600">Upcoming stop</p>
                    ) : null}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function TrackFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#F8F0FC]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="h-10 w-10 rounded-full border-2 border-[#6A1B9A] border-t-transparent"
      />
      <p className="text-sm text-gray-500">Loading live map…</p>
    </div>
  );
}

export default function TrackBusPage() {
  return (
    <Suspense fallback={<TrackFallback />}>
      <TrackContent />
    </Suspense>
  );
}
