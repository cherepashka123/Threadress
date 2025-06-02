// src/app/layout.tsx

import '../styles/globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Navbar from '../components/Navbar';
import { CartProvider } from '@/context/CartContext';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Threadress',
  description: 'AI-powered local fashion discovery and click-to-collect',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        {/* Navbar appears on every route */}
        <Navbar />

        {/* Provide CartContext to all pages */}
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
