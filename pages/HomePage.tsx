import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import FeaturedEventsCarousel from '../components/FeaturedEventsCarousel';
import Button from '../components/Button';

const HomePage: React.FC = () => {
    const { events } = useAppContext();
    const featuredEvents = events.filter(event => event.featured);

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <div className="relative h-[60vh] md:h-[80vh] flex items-center justify-center text-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop" 
                        alt="Motorsport background"
                        className="w-full h-full object-cover transition-all duration-700 brightness-[0.4] dark:brightness-[0.3] scale-110 hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-transparent"></div>
                </div>
                <div className="relative z-10 p-6 max-w-4xl mx-auto">
                    <div className="animate-fade-in-up">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight uppercase mb-6 drop-shadow-2xl" 
                            style={{ 
                                textShadow: '0 0 30px rgba(229, 9, 20, 0.6), 0 0 60px rgba(229, 9, 20, 0.4)',
                                letterSpacing: '-0.02em'
                            }}>
                            MotoManiacs
                        </h1>
                        <p className="mt-4 text-xl md:text-3xl text-gray-100 font-light mb-8 drop-shadow-lg">
                            Fuel Your Passion for Motorsports
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link to="/events" className="group">
                                <Button size="lg" className="transform transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-red-500/50 px-8 py-4 text-lg font-semibold">
                                    Explore Events
                                    <svg className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Events Section */}
            <div className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-block mb-4">
                            <span className="text-red-600 font-bold text-sm uppercase tracking-widest">Featured</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">
                            Featured Events
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto"></div>
                        <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Discover our handpicked selection of the most exciting motorsport events
                        </p>
                    </div>
                    <FeaturedEventsCarousel events={featuredEvents} />
                    <div className="text-center mt-12">
                        <Link to="/events">
                            <Button size="lg" variant="secondary" className="group transform transition-all duration-300 hover:scale-105 px-8">
                                View All Events
                                <svg className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;