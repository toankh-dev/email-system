// app/MetadataUpdater.tsx
'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAppStore } from '@/stores';
import { ROUTES } from '@/constants/routes';

export default function MetadataUpdater() {
  const pathname = usePathname();
  const previous = useAppStore(state => state.previous);

  const setPath = useAppStore(state => state.setPath);

  useEffect(() => {
    if (pathname !== ROUTES.LOGIN) {
      if (previous) {
        document.cookie = `prevPath=${encodeURIComponent(previous)}; path=${pathname}`;
      }
      setPath(pathname);
    }
  }, [pathname, previous, setPath]);

  return null;
}
