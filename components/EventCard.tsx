
import React from 'react';
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
    const eventDate = new Date(event.date);

    return (
        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-red-500/20 border border-gray-800">
            <div className="relative">
                <img className="w-full h-56 object-cover" src={event.image} alt={event.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl font-bold text-white">{event.title}</h3>
                </div>
                <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">{event.type}</div>
            </div>
            <div className="p-6">
                <div className="flex items-center text-gray-400 mb-2">
                    <CalendarIcon/>
                    <span>{eventDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center text-gray-400 mb-4">
                    <LocationIcon/>
                    <span>{event.venue}</span>
                </div>
                <p className="text-gray-300 mb-4 h-16 overflow-hidden">{event.description}</p>
                <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-red-500">${event.price}</span>
                    <Link to={`/book/${event.id}`} className="bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-300">
                        Book Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
