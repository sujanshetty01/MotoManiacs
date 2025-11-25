import React from 'react';
import { motion } from 'framer-motion';

const TrackAndCars: React.FC = () => {
  const categories = [
    {
      id: 'track-days',
      title: 'Track Days',
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Experience the thrill of speed on professional racing circuits.',
    },
    {
      id: 'off-road',
      title: 'Off-Road',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1bcfb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Conquer challenging terrains with our off-road adventures.',
    },
    {
      id: 'karting',
      title: 'Go-Karting',
      image: 'https://images.unsplash.com/photo-1599474155164-6e942d627e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Competitive karting for beginners and pros alike.',
    },
    {
      id: 'sim-racing',
      title: 'Sim Racing',
      image: 'https://images.unsplash.com/photo-1593699199602-e79b84292f25?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Virtual racing with state-of-the-art simulators.',
    }
  ];

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900 rounded-3xl my-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Tracks & Cars
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our diverse range of motorsport activities and vehicles.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative h-80 rounded-xl overflow-hidden cursor-pointer shadow-lg"
            >
              <img 
                src={category.image} 
                alt={category.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
              
              <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-bold text-white mb-2">{category.title}</h3>
                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {category.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrackAndCars;
