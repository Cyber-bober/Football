import type { Metadata } from 'next';
import Navigation from '@/presentation/components/ui/Navigation';
import CookieBanner from '@/presentation/components/cookie/CookieBanner';
import SessionProvider from '@/presentation/providers/SessionProvider';
import { registerServiceWorker } from './register-sw';

export const metadata: Metadata = {
  title: 'Football Hub',
  description: 'Football community portal — news, teams, live broadcasts',
  manifest: '/manifest.json',
  themeColor: '#0070f3',
  viewport: 'width=device-width, initial-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Football Hub',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Register service worker (client-side only)
  if (typeof window !== 'undefined') {
    registerServiceWorker();
  }

  return (
    <html lang="ru">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif' }}>
        <SessionProvider>
          <Navigation />
          <main style={{ minHeight: 'calc(100vh - 120px)', padding: 0 }}>{children}</main>
          <CookieBanner />
        </SessionProvider>
      </body>
    </html>
  );
}