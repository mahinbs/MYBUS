'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-purple-100/50 backdrop-blur-[6px] header-brand-surface">
      <div className="relative mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-3 min-h-[72px]">
        <Link href="/" className="flex min-w-0 flex-1 items-center gap-3">
          <img
            src="/logo.png"
            alt=""
            className="h-11 w-11 shrink-0 rounded-[14px] object-cover shadow-sm ring-2 ring-white ring-offset-1 ring-offset-[#faf8fc]"
          />
          <div className="flex min-w-0 flex-col justify-center gap-0.5">
            <span
              className="text-[18px] font-bold leading-none tracking-tight text-[#6A1B9A]"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              MY BUS
            </span>
            {isHome ? (
              <span className="text-[11px] leading-snug text-gray-500">Find cheap bus tickets</span>
            ) : null}
          </div>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          {!isHome ? (
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm ring-1 ring-purple-100/80 transition-colors hover:bg-white"
              aria-label="Notifications"
            >
              <i className="ri-notification-3-line text-xl text-[#6A1B9A]" />
            </button>
          ) : null}
          <Link href="/profile" className="relative block shrink-0">
            <div className="h-11 w-11 overflow-hidden rounded-full border-[3px] border-white bg-white shadow-md ring-2 ring-[#6A1B9A]/25">
              <img
                src="https://readdy.ai/api/search-image?query=Professional%20young%20Indian%20woman%20portrait%2C%20warm%20smile%2C%20soft%20natural%20lighting%2C%20clean%20white%20background%2C%20headshot%20style%2C%20modern%20and%20friendly%20appearance%2C%20high%20quality%20portrait%20photography&width=80&height=80&seq=88&orientation=squarish"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
