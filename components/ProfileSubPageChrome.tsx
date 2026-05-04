'use client';

import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

/** Scrollable body for profile sub-pages; main layout already applies top/bottom safe area. */
export default function ProfileSubPageChrome({ children }: Props) {
  return <div className="mx-auto w-full max-w-lg px-4 pb-28">{children}</div>;
}
