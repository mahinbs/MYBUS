'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { DemoUser } from '@/lib/demo-auth';
import { clearDemoSession, getDemoSession } from '@/lib/demo-auth';

const accountItems = [
  { icon: 'ri-user-settings-line', label: 'Edit Profile', hint: 'Name, email, DOB', href: '/profile/edit-profile' },
  { icon: 'ri-map-pin-user-line', label: 'Saved Travellers', hint: 'Manage passenger details', href: '/profile/saved-travellers' },
  { icon: 'ri-bank-card-line', label: 'Payment Methods', hint: 'Cards, UPI and wallets', href: '/profile/payment-methods' },
  { icon: 'ri-shield-keyhole-line', label: 'Login & Security', hint: 'Password, devices, alerts', href: '/profile/login-security' },
];

const travelItems = [
  { icon: 'ri-suitcase-3-line', label: 'Travel Preferences', hint: 'Seat, boarding and reminders', href: '/profile/travel-preferences' },
  { icon: 'ri-coupon-3-line', label: 'My Coupons', hint: '3 active offers', badge: '3', href: '/profile/my-coupons' },
  { icon: 'ri-coin-line', label: 'Rewards', hint: 'Points, tiers and benefits', href: '/profile/wallet-rewards' },
  { icon: 'ri-notification-3-line', label: 'Notifications', hint: 'Trip and price alerts', badge: '5', href: '/profile/notifications' },
];

const supportItems = [
  { icon: 'ri-customer-service-2-line', label: 'Help & Support', hint: 'FAQ, contact, ticket support', href: '/help' },
  { icon: 'ri-gift-line', label: 'Refer & Earn', hint: 'Invite friends and earn', href: '/referrals' },
  { icon: 'ri-star-smile-line', label: 'Rate App', hint: 'Share app feedback', href: '/rate-app' },
];

const legalItems = [
  { icon: 'ri-file-list-3-line', label: 'Terms & Conditions', hint: 'User policy and rules', href: '/profile/terms-conditions' },
  { icon: 'ri-shield-check-line', label: 'Privacy Policy', hint: 'How your data is handled', href: '/profile/privacy-policy' },
  { icon: 'ri-information-line', label: 'App Info', hint: 'Version, build and licenses', href: '/profile/app-info' },
];

export default function ProfilePage() {
  const [user, setUser] = useState<DemoUser | null>(null);

  const refresh = useCallback(() => {
    setUser(getDemoSession());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isLoggedIn = user !== null;

  const handleLogout = () => {
    clearDemoSession();
    setUser(null);
  };

  const renderMenuSection = (
    title: string,
    items: Array<{ icon: string; label: string; hint: string; href: string; badge?: string }>
  ) => (
    <div className="mt-5">
      <h3 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
        {title}
      </h3>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-50 active:scale-[0.99] transition-transform"
          >
            <div className="w-9 h-9 rounded-xl bg-[#F3E5F5] flex items-center justify-center shrink-0">
              <i className={`${item.icon} text-[#6A1B9A] text-sm`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#1E293B] truncate">{item.label}</p>
              <p className="text-[10px] text-gray-400 truncate">{item.hint}</p>
            </div>
            {item.badge ? (
              <span className="h-5 min-w-[20px] rounded-full bg-[#6A1B9A] px-1.5 text-white text-[10px] font-bold flex items-center justify-center">
                {item.badge}
              </span>
            ) : null}
            <i className="ri-arrow-right-s-line text-gray-400" />
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen px-4 pt-4 pb-28 bg-[#F8F0FC]">
      {!isLoggedIn ? (
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-[#F3E5F5] flex items-center justify-center">
              <i className="ri-user-3-line text-[#6A1B9A] text-2xl"></i>
            </div>
            <div>
              <p className="text-sm font-bold text-[#1E293B]">Welcome to MY BUS</p>
              <p className="text-[11px] text-gray-400">Sign in to manage your bookings</p>
            </div>
          </div>
          <div className="flex gap-2.5">
            <Link href="/login" className="flex-1">
              <button className="w-full bg-[#0F172A] text-white font-semibold text-xs py-3 rounded-xl active:scale-[0.98] transition-all">
                Sign In
              </button>
            </Link>
            <Link href="/signup" className="flex-1">
              <button className="w-full bg-[#F3E5F5] text-[#6A1B9A] font-semibold text-xs py-3 rounded-xl active:scale-[0.98] transition-all">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#F3E5F5] flex items-center justify-center text-lg font-bold text-[#6A1B9A]">
              {user.name.trim().charAt(0).toUpperCase() || 'M'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#1E293B] truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-gray-400 truncate">{user.phone}</p>
              {user.email ? (
                <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
              ) : null}
            </div>
            <Link
              href="/profile/edit-profile"
              className="h-9 w-9 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-[#F3E5F5] transition-colors shrink-0"
              aria-label="Edit profile"
            >
              <i className="ri-pencil-line text-gray-500 text-sm" />
            </Link>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-[#F9FAFB] px-3 py-2">
              <p className="text-[10px] text-gray-400">Member since</p>
              <p className="text-xs font-semibold text-[#1E293B]">Apr 2026</p>
            </div>
            <div className="rounded-xl bg-[#F9FAFB] px-3 py-2">
              <p className="text-[10px] text-gray-400">Loyalty tier</p>
              <p className="text-xs font-semibold text-[#6A1B9A]">Silver Traveller</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats / Highlights */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white rounded-2xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-50 text-center">
          <p className="text-xl font-bold text-[#6A1B9A]">12</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Trips</p>
        </div>
        <div className="bg-white rounded-2xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-50 text-center">
          <p className="text-xl font-bold text-[#22C55E]">₹2.4k</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Saved</p>
        </div>
        <div className="bg-white rounded-2xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-50 text-center">
          <p className="text-xl font-bold text-[#3B82F6]">850</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Points</p>
        </div>
      </div>

      {renderMenuSection('Account', accountItems)}
      {renderMenuSection('Travel & Rewards', travelItems)}
      {renderMenuSection('Support', supportItems)}
      {renderMenuSection('Legal & About', legalItems)}

      {isLoggedIn ? (
        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 mb-2 bg-white rounded-2xl p-4 flex items-center justify-center gap-2 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-50 active:scale-[0.99] transition-transform"
        >
          <i className="ri-logout-box-r-line text-red-500 text-sm"></i>
          <span className="text-xs font-semibold text-red-500">Logout (demo)</span>
        </button>
      ) : null}
    </div>
  );
}
