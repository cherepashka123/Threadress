'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import Hero from '@/components/Hero';
import Search from '@/components/Search';
import SignupForm from '@/components/SignupForm';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

// Dynamically load MapPreview on client only:
const MapPreview = dynamic(() => import('@/components/MapPreview'), {
  ssr: false,
});

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Search + Map Preview Side-by-Side */}
      <section className="py-12 bg-gray-50" id="browse-preview">
        <h2 className="text-2xl font-bold text-center mb-6">
          Find Items Near You
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
          {/* Left: Search Component */}
          <div>
            <Search />
          </div>

          {/* Right: Clickable Mini Map Preview (client-only) */}
          <div className="cursor-pointer transition-transform hover:scale-105">
            <Link href="/map">
              <MapPreview />
              <p className="text-sm text-center text-indigo-600 mt-2 hover:underline">
                View full map of boutiques
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* See Our Prototype */}
      <section className="py-12 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-center mb-6">
          See Our Prototype
        </h2>
        <iframe
          src="https://embed.figma.com/proto/eypt7Y4HN4ouCqTTNcVUd9/Clothing-Store-App--Community-?node-id=177-493&p=f&scaling=scale-down&content-scaling=fixed&page-id=2%3A2&starting-point-node-id=2%3A171&show-proto-sidebar=1&embed-host=share"
          width="800"
          height="450"
          style={{ border: '1px solid rgba(0, 0, 0, 0.1)' }}
          allowFullScreen
          loading="lazy"
        />
      </section>

      {/* Features Section */}
      <Features />

      {/* Waitlist Signup */}
      <section id="waitlist" className="py-12">
        <h2 className="text-2xl font-bold text-center mb-6">
          Join the Waitlist
        </h2>
        <SignupForm />
      </section>

      {/* Contact Us Section */}
      <Contact />

      {/* Footer */}
      <Footer />
    </>
  );
}
