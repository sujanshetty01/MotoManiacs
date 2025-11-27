import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import EcosystemRing from '../components/EcosystemRing';
import VisionMission from '../components/VisionMission';
import InstitutionEngagement from '../components/InstitutionEngagement';
import TrackAndCars from '../components/TrackAndCars';
import { 
  getEcosystemSegments, 
  getVisionMission, 
  getInstitutionCards 
} from '../services/cmsService';
import { 
  EcosystemSegment, 
  VisionMission as VisionMissionType, 
  InstitutionCard 
} from '../types';

const EcosystemPage: React.FC = () => {
  const [segments, setSegments] = useState<EcosystemSegment[]>([]);
  const [visionMission, setVisionMission] = useState<VisionMissionType | null>(null);
  const [institutionCards, setInstitutionCards] = useState<InstitutionCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [segmentsData, visionMissionData, cardsData] = await Promise.all([
          getEcosystemSegments(),
          getVisionMission(),
          getInstitutionCards()
        ]);

        setSegments(segmentsData);
        setVisionMission(visionMissionData);
        setInstitutionCards(cardsData);
      } catch (error) {
        console.error('Error fetching ecosystem data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white pb-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black z-0"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600"
            >
              The MotoManiacs Ecosystem
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl text-gray-300"
            >
              A comprehensive platform connecting enthusiasts, institutions, and industry leaders in the world of motorsports.
            </motion.p>
          </div>

          <div className="flex justify-center mb-20">
            <EcosystemRing segments={segments} />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 space-y-24 -mt-10 relative z-10">
        {/* Vision & Mission */}
        {visionMission && (
          <section>
            <VisionMission data={visionMission} />
          </section>
        )}

        {/* Institution Engagement */}
        {institutionCards.length > 0 && (
          <section>
            <InstitutionEngagement cards={institutionCards} />
          </section>
        )}

        {/* Tracks & Cars */}
        <section>
          <TrackAndCars />
        </section>
      </div>
    </div>
  );
};

export default EcosystemPage;
