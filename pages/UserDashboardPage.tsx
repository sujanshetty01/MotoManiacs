import React from 'react';
import { useAppContext } from '../hooks/useAppContext';

const UserDashboardPage: React.FC = () => {
    const { bookings, events, cancelBooking, currentUser } = useAppContext();

    const userBookings = bookings
        .filter(booking => booking.userId === currentUser?.id)
        .map(booking => {
            const event = events.find(e => e.id === booking.eventId);
            return { ...booking, event };
        }).sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold text-center mb-8 uppercase tracking-wider">My Bookings</h1>
            
            {userBookings.length > 0 ? (
                <div className="space-y-6">
                    {userBookings.map(({ id, event, tickets, totalPrice, status, bookingDate }) => (
                        <div key={id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            {event ? (
                                <>
                                    <div className="flex-grow">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{event.title}</h2>
                                        <p className="text-gray-500 dark:text-gray-400">{new Date(event.date).toLocaleDateString()}</p>
                                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Booked on: {new Date(bookingDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-left md:text-right">
                                        <p className="font-bold text-lg">{tickets} Ticket{tickets > 1 ? 's' : ''}</p>
                                        <p className="text-xl font-bold text-red-500">${totalPrice.toFixed(2)}</p>
                                        <span className={`px-3 py-1 text-sm font-semibold rounded-full mt-2 inline-block ${status === 'Confirmed' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-black'}`}>
                                            {status}
                                        </span>
                                    </div>
                                    <div className="flex flex-col space-y-2 mt-4 md:mt-0 md:ml-6">
                                        <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 text-sm">Download Ticket</button>
                                        {status === 'Confirmed' && (
                                            <button onClick={() => cancelBooking(id)} className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white font-bold py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 text-sm">Cancel</button>
                                        )}
                                    </div>
                                </>
                            ) : (
                               <p>Event details not available.</p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-xl text-gray-500 dark:text-gray-400">You have no bookings yet.</p>
                    <a href="/#/events" className="mt-4 inline-block text-red-500 hover:text-red-400 font-semibold">Explore Events</a>
                </div>
            )}
        </div>
    );
};

export default UserDashboardPage;