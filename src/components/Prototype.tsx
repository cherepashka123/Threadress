'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface PrototypeProps {
  width?: number;
  height?: number;
}

export default function Prototype({
  width = 1000,
  height = 600,
}: PrototypeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springRotateX = useSpring(0, { stiffness: 200, damping: 20 });
  const springRotateY = useSpring(0, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = (e.clientY - centerY) / 20;
    const rotateY = (e.clientX - centerX) / 20;

    springRotateX.set(-rotateX);
    springRotateY.set(rotateY);
  };

  return (
    <div
      className="flex justify-center my-4 sm:my-8 bg-white"
      style={{ fontFamily: 'Playfair Display, serif' }}
    >
      <motion.div
        className="relative rounded-2xl overflow-hidden w-full max-w-[98vw] sm:max-w-[90vw] md:max-w-[1000px] aspect-[4/3] sm:aspect-[5/3] bg-white"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          boxShadow: 'none', // Remove any shadow
          border: 'none', // Remove any border
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          mouseX.set(0);
          mouseY.set(0);
          springRotateX.set(0);
          springRotateY.set(0);
        }}
      >
        {/* Main image with subtle hover effect */}
        <motion.div
          className="relative w-full h-full"
          animate={{
            scale: isHovered ? 1.025 : 1,
          }}
          transition={{ duration: 0.4 }}
        >
          <Image
            src="/Threadress.png"
            alt="Threadress Prototype"
            fill
            className="object-contain bg-white"
            priority
            quality={100}
            style={{ boxShadow: 'none', border: 'none', background: 'white' }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
