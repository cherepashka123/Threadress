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
    <div className="flex justify-center my-4 md:my-8 perspective-[2000px]">
      <motion.div
        className="relative rounded-2xl overflow-hidden w-full max-w-[90vw] md:max-w-[1000px] aspect-[5/3]"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
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
        {/* Main image with hover effect */}
        <motion.div
          className="relative w-full h-full"
          animate={{
            scale: isHovered ? 1.03 : 1,
          }}
          transition={{ duration: 0.4 }}
        >
          <Image
            src="/Threadress.png"
            alt="Threadress Prototype"
            fill
            className="object-cover"
            priority
            quality={100}
          />

          {/* Interactive overlay effects */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-[#8b6f5f]/10 to-transparent opacity-0 transition-opacity duration-300"
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
          />

          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 opacity-0"
            animate={{
              opacity: isHovered ? 1 : 0,
              background: [
                'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                'linear-gradient(45deg, transparent 50%, rgba(255,255,255,0.1) 100%, transparent 100%)',
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />

          {/* Border glow effect */}
          <motion.div
            className="absolute -inset-0.5 rounded-2xl opacity-0"
            animate={{
              opacity: isHovered ? 1 : 0,
              boxShadow: [
                '0 0 20px rgba(99, 102, 241, 0.2)',
                '0 0 30px rgba(99, 102, 241, 0.3)',
                '0 0 20px rgba(99, 102, 241, 0.2)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        </motion.div>

        {/* Interactive corner accents */}
        {[
          'top-0 left-0',
          'top-0 right-0',
          'bottom-0 left-0',
          'bottom-0 right-0',
        ].map((position, index) => (
          <motion.div
            key={index}
            className={`absolute w-8 md:w-16 h-8 md:h-16 ${position} pointer-events-none`}
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0.8,
            }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at ${position.includes('left') ? '0%' : '100%'} ${
                  position.includes('top') ? '0%' : '100%'
                }, rgba(99, 102, 241, 0.2), transparent)`,
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
