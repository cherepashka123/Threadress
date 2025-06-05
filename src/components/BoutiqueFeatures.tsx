'use client';

import { motion } from 'framer-motion';
import { FaRoute, FaBell, FaChartLine, FaBox } from 'react-icons/fa';

export default function BoutiqueFeatures() {
  const features = [
    {
      icon: <FaRoute className="w-5 h-5" />,
      title: 'Smart Routing',
      description:
        'Optimized paths to multiple boutiques for efficient shopping',
      gradient: 'from-violet-600 to-indigo-600',
    },
    {
      icon: <FaBell className="w-5 h-5" />,
      title: 'Notifications',
      description: 'Real-time alerts for new arrivals and restocks',
      gradient: 'from-indigo-600 to-violet-600',
    },
    {
      icon: <FaChartLine className="w-5 h-5" />,
      title: 'Peak Hours',
      description: 'Live store traffic and best times to visit',
      gradient: 'from-violet-600 to-indigo-600',
    },
    {
      icon: <FaBox className="w-5 h-5" />,
      title: 'Popular Items',
      description: 'Trending products and restock information',
      gradient: 'from-indigo-600 to-violet-600',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute right-4 top-4 w-72 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden z-[1000]"
    >
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-violet-600/5 to-indigo-600/5">
        <h2 className="text-lg font-semibold text-neutral-900">Key Features</h2>
        <p className="text-sm text-gray-600">Smart shopping experience</p>
      </div>
      <div className="p-4 space-y-4">
        {features.map((feature, index) => (
          <motion.div
            key={`feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className="flex items-start space-x-3">
              <div
                className={`flex-shrink-0 p-2 rounded-lg bg-gradient-to-r ${feature.gradient} text-white shadow-sm`}
              >
                {feature.icon}
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 group-hover:text-indigo-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
