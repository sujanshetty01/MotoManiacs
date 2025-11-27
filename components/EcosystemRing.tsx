import React from 'react';
import { motion } from 'framer-motion';
import { EcosystemSegment } from '../types';

interface EcosystemRingProps {
  segments: EcosystemSegment[];
}

const EcosystemRing: React.FC<EcosystemRingProps> = ({ segments }) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-square flex items-center justify-center">
      {/* Central Hub */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute z-20 w-32 h-32 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/50"
      >
        <div className="text-white text-center font-bold">
          <div className="text-2xl">MOTO</div>
          <div className="text-sm">MANIACS</div>
        </div>
      </motion.div>

      {/* Orbiting Segments */}
      {segments.map((segment, index) => {
        const angle = (index * 360) / segments.length;
        const radius = 160; // Distance from center
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <motion.div
            key={segment.id}
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{ opacity: 1, x, y }}
            transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
            className="absolute z-10 w-48 flex flex-col items-center"
            style={{ transform: `translate(-50%, -50%)` }}
          >
            <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 border-4 border-red-500 flex items-center justify-center shadow-md mb-2 hover:scale-110 transition-transform duration-300 cursor-pointer">
              <span className="text-2xl" role="img" aria-label={segment.title}>
                {/* Fallback icon if no specific icon library is used */}
                🏁
              </span>
            </div>
            <div className="text-center bg-white/90 dark:bg-gray-800/90 p-2 rounded-lg shadow-sm backdrop-blur-sm">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">{segment.title}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{segment.shortDescription}</p>
            </div>
          </motion.div>
        );
      })}

      {/* Connecting Lines (Decorative) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 dark:opacity-10">
        <circle cx="50%" cy="50%" r="160" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-gray-400" />
      </svg>
    </div>
  );
};

export default EcosystemRing;
