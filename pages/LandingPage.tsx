import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans">
            {/* Hero Section */}
            <div className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop" 
                        alt="Motorcycle racing"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto animate-fade-in-up">
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6 drop-shadow-2xl">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">Ignite</span> Your <br />
                        <span className="text-white">Passion</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-10 font-light tracking-wide max-w-3xl mx-auto">
                        The ultimate destination for motorsport enthusiasts. Experience the thrill, the speed, and the community.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Link to="/events">
                            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 text-xl rounded-full transform hover:scale-105 transition-all duration-300 shadow-red-900/50 shadow-lg border-none">
                                Explore Events
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button size="lg" variant="secondary" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-10 py-4 text-xl rounded-full transform hover:scale-105 transition-all duration-300">
                                Join the Club
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 bg-zinc-900">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div className="p-8 rounded-2xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors duration-300 border border-zinc-700/50 group">
                            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600 transition-colors duration-300">
                                <svg className="w-8 h-8 text-red-500 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-white">Adrenaline Rush</h3>
                            <p className="text-gray-400">Curated events that guarantee heart-pounding action and unforgettable moments.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors duration-300 border border-zinc-700/50 group">
                            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600 transition-colors duration-300">
                                <svg className="w-8 h-8 text-red-500 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-white">Vibrant Community</h3>
                            <p className="text-gray-400">Connect with fellow petrolheads, share experiences, and ride together.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors duration-300 border border-zinc-700/50 group">
                            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600 transition-colors duration-300">
                                <svg className="w-8 h-8 text-red-500 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-white">Exclusive Access</h3>
                            <p className="text-gray-400">Get VIP treatment, pit lane access, and meet-and-greets with pro riders.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop" 
                        alt="Car drifting"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-black uppercase mb-8">Ready to Race?</h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        Don't just watch the action. Be part of it. Secure your spot at the next big event.
                    </p>
                    <Link to="/events">
                        <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-12 py-5 text-xl rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg">
                            Book Your Tickets Now
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
