import { auth } from '@/auth';
import Providers from '@/components/layout/providers';
import { StoreProviders } from '@/lib/store-provider';
import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from '@/lib/store';

export const metadata: Metadata = {
  title: 'Next Shadcn',
  description: 'Basic dashboard with Next.js and Shadcn'
};

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap'
});

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html
      lang="en"
      className={`${lato.className}`}
      suppressHydrationWarning={true}
    >
      <body className='overflow-x-hidden md:overflow-y-auto '>
        <NextTopLoader showSpinner={false} />
        <Providers session={session}>
          <StoreProviders>           
              <Toaster />
              {children}
          </StoreProviders>
        </Providers>
      </body>
    </html>
  );
}
