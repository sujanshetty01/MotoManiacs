import React, { useState, useEffect, useRef } from 'react';
import { Event } from '../types';
import EventCard from './EventCard';

interface FeaturedEventsCarouselProps {
    events: Event[];
}

const FeaturedEventsCarousel: React.FC<FeaturedEventsCarouselProps> = ({ events }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cardsPerView, setCardsPerView] = useState(3);
    const containerRef = useRef<HTMLDivElement>(null);
    const carouselInnerRef = useRef<HTMLDivElement>(null);

    // Calculate cards per view based on screen size
    useEffect(() => {
        const updateCardsPerView = () => {
            if (window.innerWidth < 768) {
                setCardsPerView(1);
            } else if (window.innerWidth < 1024) {
                setCardsPerView(2);
            } else {
                setCardsPerView(3);
            }
        };

        updateCardsPerView();
        const handleResize = () => {
            updateCardsPerView();
            // Reset to first slide when viewport changes significantly
            setCurrentIndex(0);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculate translate value based on current index
    useEffect(() => {
        const updateTransform = () => {
            if (carouselInnerRef.current && containerRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                const gap = 32; // gap-8 = 2rem = 32px
                const cardWidth = (containerWidth - (gap * (cardsPerView - 1))) / cardsPerView;
                const translateX = currentIndex * (cardWidth + gap);
                carouselInnerRef.current.style.transform = `translateX(-${translateX}px)`;
            }
        };

        updateTransform();
        
        // Use ResizeObserver to update on container size changes
        const resizeObserver = new ResizeObserver(updateTransform);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        // Also listen to window resize for cardsPerView changes
        const handleResize = () => {
            updateTransform();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', handleResize);
        };
    }, [currentIndex, cardsPerView]);

    const maxIndex = Math.max(0, events.length - cardsPerView);

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(Math.min(index, maxIndex));
    };

    if (events.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-xl text-gray-500 dark:text-gray-400">No featured events available at the moment.</p>
            </div>
        );
    }

    return (
        <div className="relative w-full" ref={containerRef}>
            {/* Carousel Container */}
            <div className="relative overflow-hidden">
                {/* Scrollable Content */}
                <div
                    ref={carouselInnerRef}
                    className="flex gap-8 transition-transform duration-500 ease-in-out"
                >
                    {events.map((event, index) => {
                        // Calculate width accounting for gaps
                        const gapTotal = (cardsPerView - 1) * 32; // 32px per gap (gap-8)
                        const cardWidthPercent = `calc((100% - ${gapTotal}px) / ${cardsPerView})`;
                        
                        return (
                            <div
                                key={event.id}
                                className="flex-shrink-0 animate-fade-in-up"
                                style={{
                                    width: cardWidthPercent,
                                    minWidth: cardWidthPercent,
                                    maxWidth: cardWidthPercent,
                                    animationDelay: `${index * 100}ms`,
                                }}
                            >
                                <EventCard event={event} />
                            </div>
                        );
                    })}
                </div>

                {/* Navigation Buttons */}
                {events.length > cardsPerView && (
                    <>
                        {/* Previous Button */}
                        <button
                            onClick={goToPrevious}
                            aria-label="Previous events"
                            className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 md:-translate-x-6 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white p-3 md:p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border border-gray-200 dark:border-gray-700 hover:bg-red-600 hover:text-white hover:border-red-600 group"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 md:h-6 md:w-6 transition-transform group-hover:-translate-x-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* Next Button */}
                        <button
                            onClick={goToNext}
                            aria-label="Next events"
                            className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 md:translate-x-6 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white p-3 md:p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border border-gray-200 dark:border-gray-700 hover:bg-red-600 hover:text-white hover:border-red-600 group"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 md:h-6 md:w-6 transition-transform group-hover:translate-x-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}

                {/* Gradient Overlays for better visibility of navigation buttons */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent pointer-events-none z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent pointer-events-none z-10"></div>
            </div>

            {/* Indicator Dots */}
            {events.length > cardsPerView && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`transition-all duration-300 rounded-full ${
                                index === currentIndex
                                    ? 'w-8 h-3 bg-red-600'
                                    : 'w-3 h-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FeaturedEventsCarousel;

