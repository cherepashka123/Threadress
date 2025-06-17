// src/app/layout.tsx

import '../styles/globals.css';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Navbar from '../components/Navbar';
import { CartProvider } from '@/context/CartContext';
import { Inter } from 'next/font/google';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Threadress - Smart Fashion Discovery',
  description: 'Discover fashion that matches your unique style',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth bg-white">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900 ${inter.className}`}
      >
        {/* Navbar appears on every route */}
        <Navbar />

        {/* Main content with padding for fixed navbar */}
        <div className="pt-[64px] sm:pt-[72px] md:pt-[88px]">
          {/* Provide CartContext to all pages */}
          <CartProvider>{children}</CartProvider>
        </div>
      </body>
    </html>
  );
}
