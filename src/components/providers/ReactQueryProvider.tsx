'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TanStackQueryDevtools } from './TanStackQueryDevtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <TanStackQueryDevtools />
    </QueryClientProvider>
  );
}
