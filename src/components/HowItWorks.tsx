// src/components/HowItWorks.tsx
'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';
import Image from 'next/image';
import { Fragment } from 'react';

const steps = [
  {
    id: 1,
    title: 'Find it, Now.',
    subtitle: 'Start with what you need',
    description:
      "It's 4PM in NYC. You need a long gold dress tonight—but don't know where to start. Just describe your perfect piece.",
    visual: '/how-it-works/search.png',
    accent: 'from-indigo-400 to-purple-400',
    feature: 'Natural Language Search',
  },
  {
    id: 2,
    title: 'AI Style Match',
    subtitle: 'Beyond keywords',
    description:
      "Our AI understands style, shape, and mood—converting your description into a precise style vector that captures the essence of what you're seeking.",
    visual: '/how-it-works/ai-match.png',
    accent: 'from-purple-400 to-indigo-400',
    feature: 'Vector Search',
  },
  {
    id: 3,
    title: 'Local Discovery',
    subtitle: 'Real-time inventory',
    description:
      "We instantly scan local boutiques' inventories, matching your style to what's available nearby. See real-time stock and location.",
    visual: '/how-it-works/local.png',
    accent: 'from-indigo-400 to-purple-400',
    feature: 'Inventory Sync',
  },
  {
    id: 4,
    title: 'Instant Access',
    subtitle: 'Same-day gratification',
    description:
      'Reserve or buy in-app, pick up within hours. Try on in-store with the confidence of AI-powered matching.',
    visual: '/how-it-works/pickup.png',
    accent: 'from-purple-400 to-indigo-400',
    feature: 'Quick Pickup',
  },
  {
    id: 5,
    title: 'Perfect Match',
    subtitle: 'AI meets IRL',
    description:
      'Experience hyper-personalized fashion discovery—right around the corner. Your style, your schedule, your way.',
    visual: '/how-it-works/match.png',
    accent: 'from-indigo-400 to-purple-400',
    feature: 'Smart Shopping',
  },
];

// Typing animation for the title (triggers when in view)
function TypingTitle({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!isInView) return;
    let i = 0;
    setDisplayed('');
    setDone(false);
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i === text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 70);
    return () => clearInterval(interval);
  }, [text, isInView]);
  return (
    <h2
      ref={ref}
      className="text-4xl md:text-5xl font-light tracking-[-0.02em] text-neutral-900 mb-2 font-serif text-left whitespace-nowrap"
      style={{ fontFamily: 'Playfair Display, serif' }}
    >
      {displayed}
      <span
        className={`inline-block w-2 h-7 align-middle ml-1 ${done ? 'opacity-0' : 'bg-black animate-pulse'}`}
        style={{ verticalAlign: 'middle' }}
      />
    </h2>
  );
}

export default function HowItWorks() {
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState(1);

  // Highlight the step closest to the center of the viewport
  useEffect(() => {
    const handleScroll = () => {
      let minDist = Infinity;
      let found = 1;
      stepRefs.current.forEach((ref, idx) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const stepCenter = rect.top + rect.height / 2;
          const viewportCenter = window.innerHeight / 2;
          const dist = Math.abs(stepCenter - viewportCenter);
          if (dist < minDist) {
            minDist = dist;
            found = idx + 1;
          }
        }
      });
      setActiveStep(found);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      className="relative bg-white overflow-hidden pt-0 mt-0 pb-0"
      style={{
        fontFamily: 'Playfair Display, serif',
        scrollSnapType: 'y mandatory',
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4"
        >
          <TypingTitle text="How It Works" />
          <p
            className="text-xl text-neutral-800 font-light max-w-xl font-serif text-left"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Experience the future of local fashion discovery powered by AI
          </p>
        </motion.div>

        <div className="flex flex-col">
          {steps.map((step, index) => (
            <div
              key={step.id}
              ref={(el) => {
                stepRefs.current[index] = el;
              }}
              className={`snap-start min-h-[320px] max-h-[400px] flex flex-col justify-center items-start px-6 py-6 transition-all duration-300 rounded-xl w-full mx-auto
                ${
                  activeStep === step.id
                    ? 'font-semibold text-neutral-900 scale-[1.02] bg-white/70 backdrop-blur-sm border-l-2 border-purple-400 shadow-none'
                    : 'font-light text-neutral-400 scale-100 bg-transparent border-l-2 border-transparent shadow-none'
                }
                text-left`}
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.15rem',
                letterSpacing: '0.01em',
                scrollSnapAlign: 'start',
              }}
            >
              <div className="mb-1 text-xs tracking-widest uppercase opacity-60 select-none">
                0{step.id}
              </div>
              <div className="text-lg md:text-xl mb-1">{step.feature}</div>
              <div className="text-2xl md:text-3xl mb-2">{step.title}</div>
              <div className="text-lg text-neutral-700 font-light leading-relaxed">
                {step.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
