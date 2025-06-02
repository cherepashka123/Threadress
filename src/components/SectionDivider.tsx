'use client';

import { motion } from 'framer-motion';

export default function SectionDivider() {
  return (
    <motion.div
      className="flex justify-center py-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full w-0"
        whileInView={{ width: '60%' }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </motion.div>
  );
}
