'use client';

import { env } from '@/config';
import { useState, useEffect } from 'react';

export function TanStackQueryDevtools() {
  const [DevtoolsComponent, setDevtoolsComponent] = useState<React.ComponentType<{ initialIsOpen?: boolean }> | null>(null);

  useEffect(() => {
    // Only load in development and on client-side
    if (env.isDevelopment) {
      import('@tanstack/react-query-devtools').then(module => {
        setDevtoolsComponent(() => module.ReactQueryDevtools);
      });
    }
  }, []);

  // Render nothing if not in development or still loading the devtools
  if (!DevtoolsComponent) return null;

  return <DevtoolsComponent initialIsOpen={false} />;
}
