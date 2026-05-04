'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import BottomNav from './BottomNav';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavPaths = ['/login', '/signup', '/onboarding'];
  const shouldHideNav = hideNavPaths.includes(pathname);

  return (
    <>
      {!shouldHideNav && <Header />}
      <main
        className={
          shouldHideNav ? 'min-h-screen' : 'min-h-screen pb-[88px] pt-[76px]'
        }
      >
        {children}
      </main>
      {!shouldHideNav && <BottomNav />}
    </>
  );
}