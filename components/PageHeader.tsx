'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

type Props = {
  title: string;
  subtitle?: string;
  backHref?: string;
  icon?: string;
  right?: ReactNode;
};

/** Section title bar shown inside a page (under the global app header). */
export default function PageHeader({ title, subtitle, backHref = '/profile', icon, right }: Props) {
  return (
    <div className="mb-3 flex items-start gap-3">
      <Link
        href={backHref}
        aria-label="Go back"
        className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-100 transition active:scale-95 hover:bg-gray-50"
      >
        <i className="ri-arrow-left-line text-lg text-[#1E293B]" />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {icon ? (
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F3E5F5] text-[#6A1B9A]">
              <i className={`${icon} text-base`} />
            </span>
          ) : null}
          <h1 className="truncate text-[20px] font-bold leading-tight tracking-tight text-[#1E293B]">
            {title}
          </h1>
        </div>
        {subtitle ? (
          <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-gray-500">{subtitle}</p>
        ) : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}
