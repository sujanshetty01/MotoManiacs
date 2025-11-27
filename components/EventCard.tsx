import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../types';

interface EventCardProps {
    event: Event;
}

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
);
const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);


const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const eventDate = new Date(event.date);
    const images = event.images && event.images.length > 0 ? event.images : ['https://picsum.photos/seed/fallback/800/600'];

    const handleControlClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }

    const goToPrevious = (e: React.MouseEvent) => {
        handleControlClick(e);
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = (e: React.MouseEvent) => {
        handleControlClick(e);
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex: number, e: React.MouseEvent) => {
        handleControlClick(e);
        setCurrentIndex(slideIndex);
    };

    return (
        <div className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transform transition-all duration-500 hover:-translate-y-2 border border-gray-200 dark:border-gray-800">
            <div className="relative group/image h-64 overflow-hidden">
                <div 
                    style={{ backgroundImage: `url(${images[currentIndex]})` }} 
                    className="w-full h-full bg-center bg-cover transition-all duration-700 ease-in-out group-hover:scale-110"
                ></div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {images.length > 1 && (
                    <>
                        <button 
                            onClick={goToPrevious} 
                            aria-label="Previous image" 
                            className="hidden group-hover/image:flex absolute top-1/2 -translate-y-1/2 left-3 text-white p-2 bg-black/60 backdrop-blur-sm rounded-full cursor-pointer z-10 hover:bg-black/80 transition-all duration-300 hover:scale-110"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button 
                            onClick={goToNext} 
                            aria-label="Next image" 
                            className="hidden group-hover/image:flex absolute top-1/2 -translate-y-1/2 right-3 text-white p-2 bg-black/60 backdrop-blur-sm rounded-full cursor-pointer z-10 hover:bg-black/80 transition-all duration-300 hover:scale-110"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                            {images.map((_, slideIndex) => (
                                <button 
                                    key={slideIndex} 
                                    aria-label={`Go to image ${slideIndex + 1}`} 
                                    onClick={(e) => goToSlide(slideIndex, e)} 
                                    className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${
                                        currentIndex === slideIndex 
                                            ? 'bg-red-500 w-6' 
                                            : 'bg-white/50 hover:bg-white/80'
                                    }`}
                                ></button>
                            ))}
                        </div>
                    </>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-2 drop-shadow-lg line-clamp-2">{event.title}</h3>
                </div>
                <div className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg backdrop-blur-sm">
                    {event.type}
                </div>
                {event.featured && (
                    <div className="absolute top-3 left-3 bg-yellow-500 text-black text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Featured
                    </div>
                )}
            </div>
            <div className="p-6 space-y-4">
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                    <CalendarIcon/>
                    <span className="font-medium">{eventDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                    <LocationIcon/>
                    <span className="font-medium">{event.venue}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-2 min-h-[2.5rem]">{event.description}</p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div>
                        <span className="text-3xl font-black text-red-600">${event.price}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">per ticket</span>
                    </div>
                    <Link 
                        to={`/book/${event.id}`} 
                        className="bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-2.5 px-6 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                    >
                        Book Now
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EventCard;