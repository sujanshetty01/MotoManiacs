import React from 'react';
import { motion } from 'framer-motion';
import { VisionMission as VisionMissionType } from '../types';

interface VisionMissionProps {
  data: VisionMissionType;
}

const VisionMission: React.FC<VisionMissionProps> = ({ data }) => {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center py-12">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border-l-4 border-red-600">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Our Vision</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            {data.visionText}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border-l-4 border-blue-600">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Our Mission</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            {data.missionText}
          </p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative h-full min-h-[400px] rounded-2xl overflow-hidden shadow-2xl"
      >
        {data.heroImagePath ? (
          <img 
            src={data.heroImagePath} 
            alt="MotoManiacs Vision" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-red-900 to-black flex items-center justify-center">
            <span className="text-white text-opacity-20 text-6xl font-bold">MOTO</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
      </motion.div>
    </div>
  );
};

export default VisionMission;
