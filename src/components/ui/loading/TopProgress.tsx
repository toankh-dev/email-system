'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
// libs
import { NProgress } from '@/lib/client';

export default function TopProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
    return () => {
      NProgress.start();
    };
  }, [pathname, searchParams]);

  return null;
}
