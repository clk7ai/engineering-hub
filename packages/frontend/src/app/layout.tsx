import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Engineering Hub | Latest Engineering News & Innovation',
    template: '%s | Engineering Hub',
  },
  description:
    'Stay updated with the latest engineering news, innovations, and technology trends. Explore articles on science, innovation, culture, and military technology.',
  keywords: [
    'engineering',
    'technology',
    'innovation',
    'science',
    'engineering news',
    'tech news',
    'innovation trends',
  ],
  authors: [{ name: 'Engineering Hub Team' }],
  creator: 'Engineering Hub',
  publisher: 'Engineering Hub',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://engineeringhub.com',
    siteName: 'Engineering Hub',
    title: 'Engineering Hub | Latest Engineering News & Innovation',
    description:
      'Stay updated with the latest engineering news, innovations, and technology trends.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Engineering Hub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Engineering Hub | Latest Engineering News & Innovation',
    description:
      'Stay updated with the latest engineering news, innovations, and technology trends.',
    images: ['/og-image.jpg'],
    creator: '@engineeringhub',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="antialiased bg-gray-50">
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
