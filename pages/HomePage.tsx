import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import EventCard from '../components/EventCard';
import Button from '../components/Button';

const HomePage: React.FC = () => {
    const { events } = useAppContext();
    const featuredEvents = events.filter(event => event.featured).slice(0, 3);

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <div className="relative h-[60vh] md:h-[80vh] flex items-center justify-center text-center overflow-hidden">
                <img 
                    src="https://picsum.photos/seed/hero/1920/1080" 
                    alt="Motorsport background"
                    className="absolute top-0 left-0 w-full h-full object-cover z-0 transition-all duration-300 brightness-75 dark:brightness-50"
                />
                <div className="relative z-10 p-6">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tighter uppercase" style={{ textShadow: '0 0 15px rgba(229, 9, 20, 0.8)' }}>
                        MotoManiacs
                    </h1>
                    <p className="mt-4 text-lg md:text-2xl text-gray-200">
                        Fuel Your Passion for Motorsports
                    </p>
                    <Link to="/events">
                        <Button size="lg" className="mt-8 animate-pulse">Explore Events</Button>
                    </Link>
                </div>
            </div>

            {/* Featured Events Section */}
            <div className="py-16 bg-gray-100 dark:bg-gray-900/50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                         <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white uppercase tracking-wider border-b-2 border-red-600 inline-block pb-2">
                            Featured Events
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                     <div className="text-center mt-12">
                        <Link to="/events">
                            <Button size="lg" variant="secondary">View All Events</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;