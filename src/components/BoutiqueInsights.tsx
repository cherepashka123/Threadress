'use client';

import { motion } from 'framer-motion';
import { FaUsers, FaShoppingBag, FaClock, FaStar } from 'react-icons/fa';

export default function BoutiqueInsights() {
  const insights = [
    {
      icon: <FaUsers className="w-5 h-5" />,
      title: 'Current Traffic',
      value: 'Moderate',
      trend: '+5% from usual',
      color: 'text-green-600',
    },
    {
      icon: <FaShoppingBag className="w-5 h-5" />,
      title: 'Items in Stock',
      value: '250+',
      trend: '15 new today',
      color: 'text-indigo-600',
    },
    {
      icon: <FaClock className="w-5 h-5" />,
      title: 'Best Time to Visit',
      value: '2:00 PM',
      trend: 'Low wait times',
      color: 'text-violet-600',
    },
    {
      icon: <FaStar className="w-5 h-5" />,
      title: 'Customer Rating',
      value: '4.8/5',
      trend: 'Based on 120 reviews',
      color: 'text-amber-600',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute right-4 bottom-4 w-72 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden z-[1000]"
    >
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-violet-600/5 to-indigo-600/5">
        <h2 className="text-lg font-semibold text-neutral-900">
          Store Insights
        </h2>
        <p className="text-sm text-gray-600">Real-time analytics</p>
      </div>
      <div className="p-4 space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={`insight-${insight.title.toLowerCase().replace(/\s+/g, '-')}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className="flex items-start space-x-3">
              <div
                className={`flex-shrink-0 p-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm`}
              >
                {insight.icon}
              </div>
              <div>
                <div className="flex items-baseline justify-between">
                  <h3 className="font-medium text-neutral-900 group-hover:text-indigo-600 transition-colors">
                    {insight.title}
                  </h3>
                  <span className={`text-sm font-medium ${insight.color}`}>
                    {insight.value}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{insight.trend}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
