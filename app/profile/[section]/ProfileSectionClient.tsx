'use client';

import Link from 'next/link';
import { useMemo, useState, type ReactNode } from 'react';
import { useParams } from 'next/navigation';
import ProfileSubPageChrome from '@/components/ProfileSubPageChrome';
import PageHeader from '@/components/PageHeader';
import { getProfileSectionTitle } from '@/lib/profile-nav';

type SectionKind =
  | 'edit-profile'
  | 'saved-travellers'
  | 'payment-methods'
  | 'login-security'
  | 'travel-preferences'
  | 'my-coupons'
  | 'wallet-rewards'
  | 'notifications'
  | 'terms-conditions'
  | 'privacy-policy'
  | 'app-info'
  | 'fallback';

const sectionMeta: Record<
  string,
  { description: string; icon: string; kind: SectionKind }
> = {
  'edit-profile': {
    description: 'These details appear on tickets and GST invoices.',
    icon: 'ri-user-settings-line',
    kind: 'edit-profile',
  },
  'saved-travellers': {
    description: 'Save passengers once and reuse them at checkout.',
    icon: 'ri-team-line',
    kind: 'saved-travellers',
  },
  'payment-methods': {
    description: 'Manage UPI, cards, wallets and your default method.',
    icon: 'ri-bank-card-line',
    kind: 'payment-methods',
  },
  'login-security': {
    description: 'Password, biometrics, 2FA and active sessions.',
    icon: 'ri-shield-keyhole-line',
    kind: 'login-security',
  },
  'travel-preferences': {
    description: 'We use this to personalise seat suggestions and reminders.',
    icon: 'ri-suitcase-3-line',
    kind: 'travel-preferences',
  },
  'my-coupons': {
    description: 'Tap any active coupon to copy the code.',
    icon: 'ri-coupon-3-line',
    kind: 'my-coupons',
  },
  'wallet-rewards': {
    description: 'Track points, loyalty benefits and tier progress.',
    icon: 'ri-coin-line',
    kind: 'wallet-rewards',
  },
  notifications: {
    description: 'Choose what we can notify you about.',
    icon: 'ri-notification-3-line',
    kind: 'notifications',
  },
  'terms-conditions': {
    description: 'Booking, cancellation and reschedule rules.',
    icon: 'ri-file-list-3-line',
    kind: 'terms-conditions',
  },
  'privacy-policy': {
    description: 'How we collect and protect your data.',
    icon: 'ri-shield-check-line',
    kind: 'privacy-policy',
  },
  'app-info': {
    description: 'Version, support and legal info.',
    icon: 'ri-information-line',
    kind: 'app-info',
  },
};

const inputClass =
  'mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-[#1E293B] outline-none transition-shadow focus:border-[#6A1B9A]/40 focus:ring-2 focus:ring-[#6A1B9A]/15';
const labelClass = 'text-[11px] font-semibold uppercase tracking-wide text-gray-500';

function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-gray-100/80 bg-white p-4 shadow-[0_2px_16px_rgba(106,27,154,0.06)] ${className}`}
    >
      {children}
    </div>
  );
}

function PrimaryButton({
  children,
  type = 'button',
  onClick,
  fullWidth = true,
  icon,
}: {
  children: ReactNode;
  type?: 'button' | 'submit';
  onClick?: () => void;
  fullWidth?: boolean;
  icon?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#6A1B9A] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-transform active:scale-[0.99] hover:bg-[#5a1782] ${
        fullWidth ? 'w-full' : ''
      }`}
    >
      {icon ? <i className={`${icon} text-base`} /> : null}
      {children}
    </button>
  );
}

function GhostButton({
  children,
  onClick,
  className = '',
  icon,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition active:scale-[0.98] hover:bg-gray-50 ${className}`}
    >
      {icon ? <i className={`${icon} text-sm`} /> : null}
      {children}
    </button>
  );
}

function ToggleRow({
  title,
  subtitle,
  defaultOn = true,
  badge,
}: {
  title: string;
  subtitle?: string;
  defaultOn?: boolean;
  badge?: string;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      type="button"
      onClick={() => setOn(!on)}
      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors ${
        on ? 'border-[#6A1B9A]/25 bg-[#F3E5F5]/45' : 'border-gray-100 bg-[#FAFAFA] hover:bg-gray-50'
      }`}
    >
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs ${
          on
            ? 'border-[#6A1B9A] bg-[#6A1B9A] text-white'
            : 'border-gray-300 bg-white text-transparent'
        }`}
        aria-hidden
      >
        <i className="ri-check-line" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="block text-sm font-semibold text-[#1E293B]">{title}</span>
          {badge ? (
            <span className="rounded-full bg-[#F3E5F5] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#6A1B9A]">
              {badge}
            </span>
          ) : null}
        </span>
        {subtitle ? (
          <span className="mt-0.5 block text-[11px] text-gray-500">{subtitle}</span>
        ) : null}
      </span>
      <span className={`text-[11px] font-semibold ${on ? 'text-[#6A1B9A]' : 'text-gray-400'}`}>
        {on ? 'Enabled' : 'Disabled'}
      </span>
    </button>
  );
}

function SectionLabel({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-2 mt-5 flex items-end justify-between gap-2 first:mt-0">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{children}</p>
      {hint ? <p className="text-[11px] text-gray-400">{hint}</p> : null}
    </div>
  );
}

function EditProfileSection() {
  return (
    <>
      <Card className="mb-3">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-[#F3E5F5] text-2xl font-bold text-[#6A1B9A]">
              N
            </div>
            <button
              type="button"
              aria-label="Change photo"
              className="absolute -bottom-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#6A1B9A] text-white shadow-md ring-2 ring-white"
            >
              <i className="ri-camera-line text-sm" />
            </button>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-[#1E293B]">Profile photo</p>
            <p className="mt-0.5 text-[11px] text-gray-500">JPG or PNG, up to 2 MB.</p>
            <div className="mt-2 flex gap-2">
              <GhostButton icon="ri-upload-2-line">Upload</GhostButton>
              <GhostButton icon="ri-delete-bin-line" className="text-red-600 hover:bg-red-50">
                Remove
              </GhostButton>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <SectionLabel>Personal details</SectionLabel>
        <div className="space-y-3">
          <div>
            <label className={labelClass} htmlFor="pf-name">Full name</label>
            <input id="pf-name" className={inputClass} placeholder="As on government ID" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Gender</label>
              <select className={inputClass} defaultValue="female">
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="pf-dob">Date of birth</label>
              <input id="pf-dob" type="date" className={inputClass} />
            </div>
          </div>
        </div>

        <SectionLabel>Contact</SectionLabel>
        <div className="space-y-3">
          <div>
            <label className={labelClass} htmlFor="pf-email">Email</label>
            <input id="pf-email" type="email" className={inputClass} placeholder="you@email.com" />
          </div>
          <div>
            <label className={labelClass} htmlFor="pf-phone">Phone</label>
            <div className="mt-1 flex items-center gap-2">
              <span className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-semibold text-gray-600">+91</span>
              <input id="pf-phone" type="tel" className={inputClass + ' mt-0 flex-1'} placeholder="98••• •••••" />
            </div>
          </div>
        </div>

        <SectionLabel>Address</SectionLabel>
        <div className="space-y-3">
          <input className={inputClass} placeholder="House / flat / building" />
          <input className={inputClass} placeholder="Area / street / locality" />
          <div className="grid grid-cols-2 gap-3">
            <input className={inputClass} placeholder="City" />
            <input className={inputClass} placeholder="Pincode" inputMode="numeric" />
          </div>
        </div>

        <SectionLabel hint="Optional">Emergency contact</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <input className={inputClass} placeholder="Name" />
          <input className={inputClass} placeholder="Phone" inputMode="tel" />
        </div>

        <PrimaryButton icon="ri-save-line">Save profile</PrimaryButton>
      </Card>
    </>
  );
}

function SavedTravellersSection() {
  const [adding, setAdding] = useState(false);
  const travellers = [
    { name: 'Priya Sharma', meta: 'Adult · Female · Aadhaar', primary: true },
    { name: 'Rahul Sharma', meta: 'Adult · Male · PAN', primary: false },
    { name: 'Aarav Sharma', meta: 'Child (age 8) · Male', primary: false },
  ];
  return (
    <>
      <Card className="mb-3 bg-gradient-to-br from-[#F3E5F5] to-white">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#6A1B9A] shadow-sm">
            <i className="ri-information-line text-xl" />
          </span>
          <p className="text-[12px] leading-snug text-[#1E293B]">
            Saved travellers auto-fill at checkout. ID details are needed for sleeper buses on long routes.
          </p>
        </div>
      </Card>

      <SectionLabel hint={`${travellers.length} saved`}>Travellers</SectionLabel>
      <div className="space-y-2.5">
        {travellers.map((t) => (
          <Card key={t.name} className="!p-3.5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3E5F5] text-sm font-bold text-[#6A1B9A]">
                {t.name.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-[#1E293B]">{t.name}</p>
                  {t.primary ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-700">
                      Primary
                    </span>
                  ) : null}
                </div>
                <p className="text-[11px] text-gray-500">{t.meta}</p>
              </div>
              <button
                type="button"
                aria-label="More"
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-50"
              >
                <i className="ri-more-2-fill" />
              </button>
            </div>
            <div className="mt-3 flex gap-2">
              <GhostButton icon="ri-edit-line" className="flex-1">Edit</GhostButton>
              {!t.primary ? (
                <GhostButton icon="ri-star-line" className="flex-1">Make primary</GhostButton>
              ) : null}
              <GhostButton icon="ri-delete-bin-line" className="text-red-600 hover:bg-red-50">
                Remove
              </GhostButton>
            </div>
          </Card>
        ))}
      </div>

      {!adding ? (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#6A1B9A]/30 bg-white py-3.5 text-sm font-semibold text-[#6A1B9A] transition hover:bg-[#F3E5F5]/40"
        >
          <i className="ri-add-line text-base" /> Add new traveller
        </button>
      ) : (
        <Card className="mt-3">
          <SectionLabel>Add traveller</SectionLabel>
          <div className="space-y-3">
            <input className={inputClass} placeholder="Full name (as on ID)" />
            <div className="grid grid-cols-2 gap-2">
              <input className={inputClass} placeholder="Age" type="number" />
              <select className={inputClass}>
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select className={inputClass}>
                <option>ID type</option>
                <option>Aadhaar</option>
                <option>PAN</option>
                <option>Passport</option>
                <option>Driving licence</option>
              </select>
              <input className={inputClass} placeholder="ID number" />
            </div>
            <label className="flex items-center gap-2 text-[12px] text-gray-600">
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300" /> Make primary traveller
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <GhostButton onClick={() => setAdding(false)} className="flex-1">Cancel</GhostButton>
            <PrimaryButton fullWidth={false}>Save traveller</PrimaryButton>
          </div>
        </Card>
      )}
    </>
  );
}

function PaymentMethodsSection() {
  const methods = [
    { kind: 'UPI', label: 'priya@okicici', icon: 'ri-smartphone-line', primary: true, tone: 'bg-[#F3E5F5] text-[#6A1B9A]' },
    { kind: 'Card', label: '•••• 4242 · HDFC Bank', icon: 'ri-bank-card-line', primary: false, tone: 'bg-blue-50 text-blue-600' },
    { kind: 'Wallet', label: 'Paytm Wallet', icon: 'ri-wallet-3-line', primary: false, tone: 'bg-amber-50 text-amber-700' },
  ];
  return (
    <>
      <SectionLabel hint="Tap to set default">Saved methods</SectionLabel>
      <div className="space-y-2.5">
        {methods.map((m) => (
          <Card key={m.label} className="!p-3.5">
            <div className="flex items-center gap-3">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${m.tone}`}>
                <i className={`${m.icon} text-xl`} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-[#1E293B]">{m.label}</p>
                  {m.primary ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-700">
                      Default
                    </span>
                  ) : null}
                </div>
                <p className="text-[11px] text-gray-500">{m.kind}</p>
              </div>
              <button
                type="button"
                aria-label="Remove"
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600"
              >
                <i className="ri-delete-bin-line" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <SectionLabel>Add new</SectionLabel>
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { label: 'UPI', icon: 'ri-smartphone-line', tone: 'from-[#F3E5F5] to-white text-[#6A1B9A]' },
          { label: 'Card', icon: 'ri-bank-card-line', tone: 'from-blue-50 to-white text-blue-600' },
          { label: 'Wallet', icon: 'ri-wallet-3-line', tone: 'from-amber-50 to-white text-amber-700' },
          { label: 'Net banking', icon: 'ri-bank-line', tone: 'from-emerald-50 to-white text-emerald-700' },
        ].map((m) => (
          <button
            key={m.label}
            type="button"
            className={`flex items-center gap-3 rounded-2xl border border-gray-100 bg-gradient-to-br p-3 text-left transition active:scale-[0.99] hover:shadow-sm ${m.tone}`}
          >
            <i className={`${m.icon} text-xl`} />
            <span className="text-sm font-semibold">{m.label}</span>
          </button>
        ))}
      </div>

      <Card className="mt-4">
        <SectionLabel>Quick add UPI</SectionLabel>
        <div className="flex items-center gap-2">
          <input className={inputClass + ' flex-1'} placeholder="yourname@bank" />
          <PrimaryButton fullWidth={false}>Verify</PrimaryButton>
        </div>
        <p className="mt-2 text-[11px] text-gray-500">
          We send a ₹1 verification request to confirm the UPI ID. Refunded immediately.
        </p>
      </Card>
    </>
  );
}

function LoginSecuritySection() {
  return (
    <>
      <Card className="mb-3">
        <SectionLabel>Change password</SectionLabel>
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Current password</label>
            <input className={inputClass} type="password" placeholder="••••••••" />
          </div>
          <div>
            <label className={labelClass}>New password</label>
            <input className={inputClass} type="password" placeholder="At least 8 characters" />
          </div>
          <div>
            <label className={labelClass}>Confirm new password</label>
            <input className={inputClass} type="password" placeholder="Repeat new password" />
          </div>
        </div>
        <PrimaryButton icon="ri-lock-line">Update password</PrimaryButton>
      </Card>

      <Card className="mb-3">
        <SectionLabel>Account security</SectionLabel>
        <div className="space-y-2">
          <ToggleRow
            title="Biometric login"
            subtitle="Use fingerprint or face ID on this device"
            defaultOn
          />
          <ToggleRow
            title="Two-factor authentication"
            subtitle="Get an OTP on every new device"
            defaultOn={false}
            badge="Recommended"
          />
          <ToggleRow
            title="Login alerts"
            subtitle="Email me when a new device signs in"
            defaultOn
          />
        </div>
      </Card>

      <Card>
        <SectionLabel hint="3 devices">Active sessions</SectionLabel>
        <div className="space-y-2.5">
          {[
            { device: 'iPhone 14 · Mumbai', meta: 'This device · Just now', current: true, icon: 'ri-smartphone-line' },
            { device: 'Chrome on Windows', meta: 'Delhi · 2 hours ago', current: false, icon: 'ri-computer-line' },
            { device: 'iPad', meta: 'Bengaluru · 5 days ago', current: false, icon: 'ri-tablet-line' },
          ].map((d) => (
            <div key={d.device} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-[#FAFAFA] p-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#6A1B9A] shadow-sm">
                <i className={`${d.icon} text-lg`} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-[#1E293B]">{d.device}</p>
                  {d.current ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold uppercase text-emerald-700">
                      Current
                    </span>
                  ) : null}
                </div>
                <p className="text-[11px] text-gray-500">{d.meta}</p>
              </div>
              {!d.current ? (
                <GhostButton icon="ri-logout-box-r-line" className="text-red-600 hover:bg-red-50">
                  Sign out
                </GhostButton>
              ) : null}
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mt-4 w-full rounded-xl border border-red-100 bg-red-50 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
        >
          Sign out from all other devices
        </button>
      </Card>
    </>
  );
}

function TravelPreferencesSection() {
  const seatTypes = ['Window — lower', 'Aisle — lower', 'Sleeper — upper', 'Sleeper — lower'];
  const [selectedSeat, setSelectedSeat] = useState(seatTypes[0]);

  return (
    <>
      <Card className="mb-3">
        <SectionLabel>Preferred seat</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          {seatTypes.map((s) => {
            const active = selectedSeat === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSeat(s)}
                className={`rounded-xl border px-3 py-3 text-left text-xs font-semibold transition ${
                  active
                    ? 'border-[#6A1B9A] bg-[#F3E5F5]/60 text-[#6A1B9A] shadow-sm'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="mb-3">
        <SectionLabel>Reminders</SectionLabel>
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Boarding reminder</label>
            <select className={inputClass} defaultValue="2h">
              <option value="30m">30 minutes before</option>
              <option value="1h">1 hour before</option>
              <option value="2h">2 hours before</option>
              <option value="evening">Evening before trip</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Quiet hours start</label>
              <input className={inputClass} type="time" defaultValue="22:00" />
            </div>
            <div>
              <label className={labelClass}>Quiet hours end</label>
              <input className={inputClass} type="time" defaultValue="07:00" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="mb-3">
        <SectionLabel>Locale</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Language</label>
            <select className={inputClass}>
              <option>English (India)</option>
              <option>हिन्दी</option>
              <option>தமிழ்</option>
              <option>తెలుగు</option>
              <option>বাংলা</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Currency</label>
            <select className={inputClass}>
              <option>INR · ₹</option>
              <option>USD · $</option>
              <option>AED · د.إ</option>
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <SectionLabel>Comfort & accessibility</SectionLabel>
        <div className="space-y-2">
          <ToggleRow title="Show women-only buses first" subtitle="When available on the route" defaultOn />
          <ToggleRow title="Live tracking by default" subtitle="Open map view on bookings page" defaultOn />
          <ToggleRow title="Wheelchair-friendly only" subtitle="Filter buses with low-floor access" defaultOn={false} />
          <ToggleRow title="Avoid overnight journeys" subtitle="Skip 11 PM – 5 AM departures" defaultOn={false} />
        </div>
        <PrimaryButton icon="ri-save-line">Save preferences</PrimaryButton>
      </Card>
    </>
  );
}

const demoCoupons = [
  { code: 'BUS20', off: '20% off', upto: 'Up to ₹200 · Min ₹999', exp: '30 Jun 2026', tag: 'New users', status: 'active' as const },
  { code: 'FIRST50', off: '₹50 off', upto: 'First booking only', exp: 'No expiry', tag: 'Welcome', status: 'active' as const },
  { code: 'WEEKEND15', off: '15% off', upto: 'Sat–Sun departures', exp: '12 May 2026', tag: 'Weekend', status: 'active' as const },
  { code: 'SUMMER15', off: '15% off', upto: 'Summer routes', exp: 'Used 18 Apr', tag: 'Used', status: 'used' as const },
  { code: 'HOLI100', off: '₹100 off', upto: 'Festival sale', exp: 'Expired 28 Mar', tag: 'Expired', status: 'expired' as const },
];

function CouponsSection() {
  const [tab, setTab] = useState<'active' | 'used' | 'expired'>('active');
  const [copied, setCopied] = useState<string | null>(null);
  const filtered = demoCoupons.filter((c) => c.status === tab);

  const handleCopy = (code: string) => {
    void navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied((c) => (c === code ? null : c)), 1600);
  };

  return (
    <>
      <Card className="mb-3 !p-2">
        <div className="grid grid-cols-3 gap-1">
          {(['active', 'used', 'expired'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-xl px-3 py-2 text-xs font-semibold capitalize transition ${
                tab === t ? 'bg-[#6A1B9A] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-400">
            <i className="ri-coupon-3-line text-2xl" />
          </div>
          <p className="text-sm font-semibold text-[#1E293B]">No {tab} coupons</p>
          <p className="mt-1 text-[12px] text-gray-500">Check back during sales for new offers.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <div
              key={c.code}
              className={`relative overflow-hidden rounded-2xl border bg-white shadow-[0_2px_16px_rgba(106,27,154,0.06)] ${
                c.status === 'active' ? 'border-[#6A1B9A]/20' : 'border-gray-100 opacity-75'
              }`}
            >
              <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#F8F0FC]" />
              <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#F8F0FC]" />
              <div className="flex">
                <div className="flex w-24 shrink-0 flex-col items-center justify-center border-r border-dashed border-gray-200 bg-gradient-to-br from-[#F3E5F5] to-white p-3 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#6A1B9A]">{c.tag}</p>
                  <p className="mt-1 text-base font-bold leading-tight text-[#6A1B9A]">{c.off}</p>
                </div>
                <div className="flex-1 p-3.5">
                  <p className="font-mono text-base font-bold tracking-wider text-[#1E293B]">{c.code}</p>
                  <p className="mt-0.5 text-[11px] text-gray-500">{c.upto}</p>
                  <p className="mt-1 text-[10px] text-gray-400">
                    <i className="ri-time-line mr-1" />
                    {c.exp}
                  </p>
                  {c.status === 'active' ? (
                    <button
                      type="button"
                      onClick={() => handleCopy(c.code)}
                      className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-[#6A1B9A]/30 bg-white px-3 py-1.5 text-[11px] font-bold text-[#6A1B9A] transition hover:bg-[#F3E5F5]/50"
                    >
                      <i className={copied === c.code ? 'ri-check-line' : 'ri-file-copy-line'} />
                      {copied === c.code ? 'Copied!' : 'Copy code'}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function RewardsSection() {
  const tx = [
    { label: 'Trip completed · Delhi to Jaipur', pts: '+120 pts', date: '28 Apr 2026', type: 'earned' },
    { label: 'Referral bonus · first ride', pts: '+250 pts', date: '15 Apr 2026', type: 'earned' },
    { label: 'Redeemed coupon · SUMMER15', pts: '-500 pts', date: '10 Apr 2026', type: 'redeemed' },
    { label: 'Tier milestone bonus', pts: '+100 pts', date: '04 Apr 2026', type: 'earned' },
  ];
  return (
    <>
      <div className="mb-3 overflow-hidden rounded-3xl shadow-[0_8px_30px_rgba(106,27,154,0.18)]">
        <div className="bg-gradient-to-br from-[#6A1B9A] via-[#7B1FA2] to-[#8E24AA] px-5 py-5 text-white">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-medium text-white/80">Loyalty points</p>
              <p className="mt-1 text-3xl font-bold tracking-tight">850 pts</p>
            </div>
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ring-white/20">
              Silver tier
            </span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-white/15 p-2">
              <p className="text-[10px] text-white/80">Trips this month</p>
              <p className="mt-0.5 text-sm font-bold text-white">4</p>
            </div>
            <div className="rounded-xl bg-white/15 p-2">
              <p className="text-[10px] text-white/80">Points earned</p>
              <p className="mt-0.5 text-sm font-bold text-white">+470</p>
            </div>
            <div className="rounded-xl bg-white/15 p-2">
              <p className="text-[10px] text-white/80">Points redeemed</p>
              <p className="mt-0.5 text-sm font-bold text-white">-500</p>
            </div>
          </div>
        </div>
        <div className="bg-[#4A148C] px-5 py-3 text-white/85">
          <div className="flex items-center justify-between text-[11px]">
            <span>Progress to Gold</span>
            <span className="font-bold text-white">850 / 1000 pts</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/20">
            <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-amber-300 to-amber-100" />
          </div>
          <p className="mt-1.5 text-[10px] text-white/70">150 pts more to reach <b className="text-amber-200">Gold</b></p>
        </div>
      </div>

      <Card className="mb-3">
        <SectionLabel>Loyalty tiers explained</SectionLabel>
        <div className="space-y-2.5">
          {[
            { name: 'Silver', range: '0 - 999 pts', perks: 'Standard support, 2% reward back', active: true },
            { name: 'Gold', range: '1000 - 2499 pts', perks: 'Priority support, 5% reward back, early deals' },
            { name: 'Platinum', range: '2500+ pts', perks: 'Best support SLA, 8% reward back, exclusive coupons' },
          ].map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl border p-3 ${
                tier.active ? 'border-[#6A1B9A]/30 bg-[#F3E5F5]/50' : 'border-gray-100 bg-[#FAFAFA]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-[#1E293B]">{tier.name}</p>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">{tier.range}</span>
              </div>
              <p className="mt-1 text-[11px] text-gray-600">{tier.perks}</p>
            </div>
          ))}
        </div>
      </Card>

      <SectionLabel>Redeem rewards</SectionLabel>
      <div className="grid grid-cols-3 gap-2">
        {[
          { v: '₹100', pts: '500 pts', icon: 'ri-coupon-line' },
          { v: '₹250', pts: '1,000 pts', icon: 'ri-vip-crown-line' },
          { v: '₹500', pts: '1,800 pts', icon: 'ri-gift-line' },
        ].map((r) => (
          <button
            key={r.v}
            type="button"
            className="rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-sm transition active:scale-[0.98] hover:border-[#6A1B9A]/30"
          >
            <i className={`${r.icon} text-xl text-[#6A1B9A]`} />
            <p className="mt-1 text-sm font-bold text-[#1E293B]">{r.v}</p>
            <p className="text-[10px] text-gray-500">{r.pts}</p>
          </button>
        ))}
      </div>

      <Card className="mt-4">
        <SectionLabel hint="Last 30 days">Points activity</SectionLabel>
        <ul className="space-y-3">
          {tx.map((t) => {
            const isEarned = t.type === 'earned';
            return (
              <li
                key={t.label + t.date}
                className="flex items-center gap-3 border-b border-gray-50 pb-3 last:border-0 last:pb-0"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    isEarned ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}
                >
                  <i className={isEarned ? 'ri-arrow-up-line text-base' : 'ri-arrow-down-line text-base'} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-[#1E293B]">{t.label}</p>
                  <p className="text-[10px] text-gray-400">{t.date}</p>
                </div>
                <span
                  className={`shrink-0 text-sm font-bold ${
                    isEarned ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {t.pts}
                </span>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          className="mt-3 w-full rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
        >
          View full rewards history
        </button>
      </Card>
    </>
  );
}

function NotificationsSection() {
  return (
    <>
      <Card className="mb-3">
        <SectionLabel>Trip & bookings</SectionLabel>
        <div className="space-y-2">
          <ToggleRow title="Booking confirmations" subtitle="Tickets, refunds, reschedule receipts" defaultOn />
          <ToggleRow title="Boarding reminders" subtitle="2h, 1h and 15m before departure" defaultOn />
          <ToggleRow title="Live tracking updates" subtitle="Delays, gate changes, arrivals" defaultOn />
          <ToggleRow title="Trip rating reminder" subtitle="Rate the bus after every journey" defaultOn={false} />
        </div>
      </Card>

      <Card className="mb-3">
        <SectionLabel>Offers & rewards</SectionLabel>
        <div className="space-y-2">
          <ToggleRow title="Personalised coupons" subtitle="Deals for your favourite routes" defaultOn />
          <ToggleRow title="Flash sales" subtitle="Time-limited fare drops" defaultOn={false} />
          <ToggleRow title="Reward milestones" subtitle="Tier upgrades and bonus points" defaultOn />
        </div>
      </Card>

      <Card className="mb-3">
        <SectionLabel>Channels</SectionLabel>
        <div className="space-y-2">
          <ToggleRow title="Push notifications" subtitle="On this device" defaultOn />
          <ToggleRow title="WhatsApp" subtitle="Faster, in-thread booking updates" defaultOn />
          <ToggleRow title="Email" subtitle="Receipts and weekly summaries" defaultOn />
          <ToggleRow title="SMS" subtitle="Critical updates only" defaultOn={false} />
        </div>
      </Card>

      <Card>
        <SectionLabel>Do not disturb</SectionLabel>
        <p className="text-[12px] text-gray-500">
          Silence non-critical notifications during these hours. Booking confirmations always come through.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Start</label>
            <input className={inputClass} type="time" defaultValue="22:30" />
          </div>
          <div>
            <label className={labelClass}>End</label>
            <input className={inputClass} type="time" defaultValue="07:00" />
          </div>
        </div>
        <PrimaryButton icon="ri-save-line">Save notification settings</PrimaryButton>
      </Card>
    </>
  );
}

function LegalSection({ kind }: { kind: 'terms-conditions' | 'privacy-policy' }) {
  const sections =
    kind === 'terms-conditions'
      ? [
          { t: 'Booking & tickets', icon: 'ri-ticket-2-line', body: 'A booking is confirmed only after successful payment. Tickets are non-transferable and must match a valid ID at boarding.' },
          { t: 'Cancellation policy', icon: 'ri-close-circle-line', body: 'Cancellation charges depend on hours before departure: 0–6h: 100%, 6–24h: 50%, 24h+: 10% (subject to operator).' },
          { t: 'Reschedule', icon: 'ri-refresh-line', body: 'Reschedule is allowed once per booking, at least 6 hours before departure, on the same route.' },
          { t: 'Refunds', icon: 'ri-bank-card-2-line', body: 'Eligible refunds are processed to the original payment method within 5–7 business days.' },
          { t: 'User responsibilities', icon: 'ri-user-line', body: 'Provide accurate traveller details. Misuse of coupons or chargebacks may result in account restrictions.' },
        ]
      : [
          { t: 'Data we collect', icon: 'ri-database-2-line', body: 'Name, contact details, booking history, device info and approximate location to power tracking and recommendations.' },
          { t: 'How we use it', icon: 'ri-bar-chart-2-line', body: 'To complete bookings, send trip updates, prevent fraud, and improve route discovery and pricing.' },
          { t: 'Sharing', icon: 'ri-share-line', body: 'Shared only with operators required to fulfil your booking, payment processors, and trusted analytics partners.' },
          { t: 'Retention', icon: 'ri-time-line', body: 'Booking data is retained for 7 years to comply with tax and audit rules. You may request deletion of marketing data anytime.' },
          { t: 'Your rights', icon: 'ri-shield-user-line', body: 'Access, correct, or delete your data via Profile → Login & Security → Manage data, or by contacting support.' },
        ];

  return (
    <>
      <Card className="mb-3 bg-gradient-to-br from-[#F3E5F5] to-white">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[#6A1B9A]">
          {kind === 'terms-conditions' ? 'Terms summary' : 'Privacy at a glance'}
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-[#1E293B]">
          {kind === 'terms-conditions'
            ? 'By using MY BUS you agree to fair-use rules around bookings, refunds and traveller details.'
            : 'We use your data to confirm bookings, send trip updates, and personalise offers — never sold to third parties.'}
        </p>
        <p className="mt-2 text-[11px] text-gray-500">Last updated: 1 May 2026 · v1.0</p>
      </Card>

      <div className="space-y-2.5">
        {sections.map((s) => (
          <Card key={s.t} className="!p-3.5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F3E5F5] text-[#6A1B9A]">
                <i className={`${s.icon} text-lg`} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#1E293B]">{s.t}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-gray-600">{s.body}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-3 bg-gray-50/60">
        <p className="text-[11px] text-gray-500">
          Demo content for layout review only — not legal advice. Replace with your legal team&apos;s approved
          copy before going live.
        </p>
      </Card>
    </>
  );
}

function AppInfoSection() {
  const rows: Array<[string, string, string?]> = [
    ['App version', '1.0.0 (demo)', 'ri-information-line'],
    ['Build', '2026.05.04', 'ri-code-s-slash-line'],
    ['Device', 'Web · Chrome', 'ri-computer-line'],
    ['Region', 'India · INR', 'ri-earth-line'],
    ['Support email', 'support@mybus.demo', 'ri-mail-line'],
    ['WhatsApp support', '+91 98••• •••••', 'ri-whatsapp-line'],
  ];
  return (
    <>
      <Card className="mb-3 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F3E5F5] shadow-sm">
          <span className="text-2xl font-bold text-[#6A1B9A]">MB</span>
        </div>
        <p className="mt-3 text-base font-bold text-[#1E293B]">MY BUS</p>
        <p className="text-[11px] text-gray-500">Your Journey, Your Bus</p>
        <p className="mt-2 text-[11px] text-gray-400">Made with care · 2026</p>
      </Card>

      <Card className="mb-3 !p-0 overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {rows.map(([k, v, icon]) => (
            <li key={k} className="flex items-center gap-3 px-4 py-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F8F0FC] text-[#6A1B9A]">
                <i className={`${icon || 'ri-information-line'} text-base`} />
              </span>
              <span className="flex-1 text-xs font-medium text-gray-500">{k}</span>
              <span className="max-w-[55%] truncate text-right text-xs font-semibold text-[#1E293B]">{v}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <SectionLabel>Quick links</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          {[
            { l: 'Help centre', i: 'ri-customer-service-2-line', href: '/help' },
            { l: 'Rate the app', i: 'ri-star-smile-line', href: '/rate-app' },
            { l: 'Refer & earn', i: 'ri-gift-line', href: '/referrals' },
            { l: 'Terms', i: 'ri-file-list-3-line', href: '/profile/terms-conditions' },
          ].map((q) => (
            <Link
              key={q.l}
              href={q.href}
              className="flex items-center gap-2 rounded-xl border border-gray-100 bg-[#FAFAFA] px-3 py-3 text-xs font-semibold text-[#1E293B] transition hover:bg-white hover:shadow-sm"
            >
              <i className={`${q.i} text-base text-[#6A1B9A]`} /> {q.l}
            </Link>
          ))}
        </div>
      </Card>
    </>
  );
}

function FallbackSection() {
  return (
    <Card className="text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        <i className="ri-question-line text-2xl" />
      </div>
      <p className="text-sm font-semibold text-[#1E293B]">Section not available</p>
      <p className="mt-1 text-[12px] text-gray-500">This area is part of the full app.</p>
      <Link
        href="/profile"
        className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[#6A1B9A] py-3.5 text-sm font-semibold text-white"
      >
        Back to profile
      </Link>
    </Card>
  );
}

export default function ProfileSectionClient() {
  const params = useParams<{ section: string }>();
  const section = params.section;
  const meta = sectionMeta[section];
  const title = getProfileSectionTitle(section);
  const kind = meta?.kind ?? 'fallback';
  const description = meta?.description;
  const icon = meta?.icon;

  const body = useMemo(() => {
    switch (kind) {
      case 'edit-profile':
        return <EditProfileSection />;
      case 'saved-travellers':
        return <SavedTravellersSection />;
      case 'payment-methods':
        return <PaymentMethodsSection />;
      case 'login-security':
        return <LoginSecuritySection />;
      case 'travel-preferences':
        return <TravelPreferencesSection />;
      case 'my-coupons':
        return <CouponsSection />;
      case 'wallet-rewards':
        return <RewardsSection />;
      case 'notifications':
        return <NotificationsSection />;
      case 'terms-conditions':
        return <LegalSection kind="terms-conditions" />;
      case 'privacy-policy':
        return <LegalSection kind="privacy-policy" />;
      case 'app-info':
        return <AppInfoSection />;
      default:
        return <FallbackSection />;
    }
  }, [kind]);

  return (
    <div className="min-h-screen bg-[#F8F0FC] pt-3">
      <ProfileSubPageChrome>
        <PageHeader title={title} subtitle={description} icon={icon} backHref="/profile" />
        {body}
      </ProfileSubPageChrome>
    </div>
  );
}
