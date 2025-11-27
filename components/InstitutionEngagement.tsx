import React from 'react';
import { motion } from 'framer-motion';
import { InstitutionCard } from '../types';

interface InstitutionEngagementProps {
  cards: InstitutionCard[];
}

const InstitutionEngagement: React.FC<InstitutionEngagementProps> = ({ cards }) => {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Institution Engagement
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Partnering with educational institutions to foster the next generation of motorsport talent.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            <div 
              className="h-2 w-full" 
              style={{ backgroundColor: card.accentColor || '#dc2626' }}
            ></div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                {card.title}
              </h3>
              <ul className="space-y-3">
                {card.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start text-gray-600 dark:text-gray-300">
                    <span className="mr-2 text-red-500 mt-1">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InstitutionEngagement;
