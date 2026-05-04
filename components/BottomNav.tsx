'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', icon: 'ri-home-5-line', activeIcon: 'ri-home-5-fill', label: 'Home' },
  { href: '/bookings', icon: 'ri-ticket-2-line', activeIcon: 'ri-ticket-2-fill', label: 'Tickets' },
  { href: '/profile', icon: 'ri-user-3-line', activeIcon: 'ri-user-3-fill', label: 'Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-5 left-0 z-50 flex w-full justify-center px-5"
      style={{ height: '58px' }}
    >
      <div className="flex items-center gap-0.5 rounded-full bg-[#0F172A] px-1.5 py-1.5 shadow-[0_10px_40px_rgba(15,23,42,0.45)] ring-1 ring-white/10">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2.5 transition-all ${
                isActive
                  ? 'bg-white text-[#0F172A] shadow-sm'
                  : 'text-white/85 hover:text-white'
              }`}
            >
              <i className={`${isActive ? item.activeIcon : item.icon} text-[19px]`}></i>
              {isActive ? (
                <span className="text-xs font-bold">{item.label}</span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
