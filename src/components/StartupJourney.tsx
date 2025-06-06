'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

export default function StartupJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-75%']);

  const milestones = [
    {
      year: '2023',
      title: 'The Vision',
      description:
        'Born from a passion for local fashion and technology, Threadress began as a vision to revolutionize boutique discovery.',
      stats: [
        { label: 'Initial Team', value: '3' },
        { label: 'First Pitch', value: 'SF Tech Week' },
      ],
      gradient: 'from-violet-600 to-indigo-600',
    },
    {
      year: '2024',
      title: 'Building the Future',
      description:
        'Developing cutting-edge AI algorithms for personalized fashion recommendations and real-time inventory tracking.',
      stats: [
        { label: 'AI Models', value: '5+' },
        { label: 'Tech Stack', value: 'Next.js 14' },
      ],
      gradient: 'from-indigo-600 to-violet-600',
    },
    {
      year: '2025',
      title: 'Launch & Growth',
      description:
        'Preparing for launch in major fashion hubs, partnering with boutiques that share our vision for the future of retail.',
      stats: [
        { label: 'Target Cities', value: '5' },
        { label: 'Partnerships', value: '50+' },
      ],
      gradient: 'from-violet-600 to-indigo-600',
    },
    {
      year: 'Future',
      title: 'Global Impact',
      description:
        'Expanding globally while maintaining our commitment to local fashion communities and sustainable practices.',
      stats: [
        { label: 'Vision', value: 'Global' },
        { label: 'Impact', value: 'Infinite' },
      ],
      gradient: 'from-indigo-600 to-violet-600',
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative py-24 overflow-hidden bg-neutral-50"
    >
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-light tracking-[-0.02em] text-neutral-900 mb-4">
            Our Journey
          </h2>
          <p className="text-neutral-600 font-light max-w-xl mx-auto">
            From concept to reality, we're building the future of fashion
            discovery
          </p>
        </motion.div>
      </div>

      <motion.div style={{ x }} className="flex gap-6 pl-6">
        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.year}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex-none w-[300px] md:w-[400px]"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${milestone.gradient} mb-4`}
              >
                {milestone.year}
              </div>
              <h3 className="text-xl font-medium text-neutral-900 mb-2">
                {milestone.title}
              </h3>
              <p className="text-neutral-600 mb-6">{milestone.description}</p>
              <div className="grid grid-cols-2 gap-4">
                {milestone.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-neutral-50 rounded-lg p-3"
                  >
                    <div className="text-sm text-neutral-500">{stat.label}</div>
                    <div className="text-lg font-medium text-indigo-600">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-neutral-50 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-neutral-50 to-transparent pointer-events-none" />
    </section>
  );
}
