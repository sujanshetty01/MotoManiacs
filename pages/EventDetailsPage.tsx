import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import Button from '../components/Button';
import { TicketType } from '../types';
import QuickBook from '../components/QuickBook';

const EventDetailsPage: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const { events } = useAppContext();
    const navigate = useNavigate();
    const [event, setEvent] = useState(events.find(e => e.id === eventId));

    useEffect(() => {
        const foundEvent = events.find(e => e.id === eventId);
        if (foundEvent) {
            setEvent(foundEvent);
        }
    }, [eventId, events]);

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Event not found</h2>
                    <Link to="/events" className="text-red-500 hover:underline">Back to Events</Link>
                </div>
            </div>
        );
    }

    // Mock ticket types if not present (since we just added the field)
    const ticketTypes: TicketType[] = event.ticketTypes || [
        { id: 'gen', name: 'General Access', price: event.price, description: 'Standard entry to the event area.' },
        { id: 'vip', name: 'VIP Pass', price: event.price * 2, description: 'Premium seating, lounge access, and complimentary drinks.' },
        { id: 'pit', name: 'Pit Lane Access', price: event.price * 3, description: 'Exclusive access to the pit lane and meet-and-greet opportunities.' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white pb-20">
            {/* Hero Banner */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <img 
                    src={event.images[0] || 'https://picsum.photos/seed/motorsport/1920/1080'} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-4xl">
                    <div className="inline-block px-4 py-1 bg-red-600 text-white text-sm font-bold uppercase tracking-wider rounded-full mb-4">
                        {event.type}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">{event.title}</h1>
                    <div className="flex flex-wrap gap-6 text-white/90 text-lg">
                        <div className="flex items-center gap-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {event.venue}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-800">
                            <h2 className="text-2xl font-bold mb-4 uppercase tracking-wide border-l-4 border-red-600 pl-4">About the Event</h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                                {event.description}
                            </p>
                            <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                                Experience the roar of engines and the thrill of competition. This event brings together the best racers and the most passionate fans for an unforgettable day of motorsport action.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-800">
                            <h2 className="text-2xl font-bold mb-6 uppercase tracking-wide border-l-4 border-red-600 pl-4">Ticket Options</h2>
                            <div className="space-y-4">
                                {ticketTypes.map((ticket) => (
                                    <div key={ticket.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-red-500 transition-colors duration-300">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{ticket.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{ticket.description}</p>
                                        </div>
                                        <div className="mt-4 md:mt-0 flex items-center gap-4">
                                            <span className="text-2xl font-black text-red-600">${ticket.price}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-800 sticky top-24">
                            <h3 className="text-xl font-bold mb-6 uppercase tracking-wide text-center">Event Details</h3>
                            
                            <div className="space-y-6 mb-8">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold uppercase">Duration</p>
                                        <p className="font-bold">{event.duration}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold uppercase">Starting Price</p>
                                        <p className="font-bold text-xl">${event.price}</p>
                                    </div>
                                </div>
                            </div>

                            <Button 
                                onClick={() => navigate(`/book/${event.id}`)} 
                                size="lg" 
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-red-600/30 transition-all duration-300"
                            >
                                Book Tickets Now
                            </Button>
                            <p className="text-center text-xs text-gray-500 mt-4 mb-8">
                                Secure payment • Instant confirmation
                            </p>

                            <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                                <QuickBook eventId={event.id} eventTitle={event.title} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailsPage;
