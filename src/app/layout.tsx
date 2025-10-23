import type { Metadata } from 'next';
import { ReactQueryProvider } from '@/components/providers/ReactQueryProvider';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { Toaster } from 'sonner';

import '@/styles/globals.css';
import MetadataUpdater from '@/components/MetadataUpdater';
import { Suspense } from 'react';
import LoadingBar from '@/components/ui/loading/loading';

export const metadata: Metadata = {
  title: 'リレーション | Re:lation',
  description: 'リレーション | Re:lation',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body>
        <Suspense fallback={<LoadingBar />}>
          <NextIntlClientProvider>
            <Toaster position="top-right" richColors />
            <MetadataUpdater />
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </NextIntlClientProvider>
        </Suspense>
      </body>
    </html>
  );
}
