import type { Metadata } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';
import { getAppDisplayName } from '@/lib/branding';
import './globals.css';

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: getAppDisplayName(),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${ibmPlexMono.variable}`}>
      <body className={`${ibmPlexMono.className} antialiased`}>{children}</body>
    </html>
  );
}
