import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { downloadTicket, downloadTicketAsPDF } from '../services/ticketService';
import QRCode from '../components/QRCode';
import { Booking } from '../types';
import ConfirmModal from '../components/ConfirmModal';

const UserDashboardPage: React.FC = () => {
    const { bookings, events, cancelBooking, currentUser } = useAppContext();
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelError, setCancelError] = useState<string | null>(null);

    // Filter out cancelled bookings and get user's active bookings
    const userBookings = bookings
        .filter(booking => booking.userId === currentUser?.id && booking.status !== 'Cancelled')
        .map(booking => {
            const event = events.find(e => e.id === booking.eventId);
            return { ...booking, event };
        }).sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());

    const handleDownloadTicket = async (booking: Booking) => {
        const event = events.find(e => e.id === booking.eventId);
        if (event) {
            await downloadTicket(booking, event);
        } else {
            alert('Event details not found. Cannot generate ticket.');
        }
    };

    const handleDownloadPDF = async (booking: Booking) => {
        const event = events.find(e => e.id === booking.eventId);
        if (event) {
            await downloadTicketAsPDF(booking, event);
        } else {
            alert('Event details not found. Cannot generate PDF.');
        }
    };

    const handleCancelClick = (booking: Booking) => {
        setBookingToCancel(booking);
        setCancelError(null);
        setCancelModalOpen(true);
    };

    const handleCancelConfirm = async () => {
        if (!bookingToCancel) return;

        setIsCancelling(true);
        setCancelError(null);

        try {
            await cancelBooking(bookingToCancel.id);
            // Success - the real-time listener will update the UI automatically
            setCancelModalOpen(false);
            setBookingToCancel(null);
        } catch (error: any) {
            console.error('Error cancelling booking:', error);
            setCancelError(error.message || 'Failed to cancel booking. Please try again.');
            // Keep modal open so user can retry or cancel
        } finally {
            setIsCancelling(false);
        }
    };

    const handleCancelModalClose = () => {
        if (!isCancelling) {
            setCancelModalOpen(false);
            setBookingToCancel(null);
            setCancelError(null);
        }
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold text-center mb-8 uppercase tracking-wider">My Bookings</h1>
            
            {userBookings.length > 0 ? (
                <div className="space-y-6">
                    {userBookings.map((booking) => {
                        const { id, event, tickets, totalPrice, status, bookingDate } = booking;
                        return (
                            <div key={id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                                {event ? (
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
                                            <button 
                                                onClick={() => handleDownloadPDF(booking)}
                                                className="bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-300 text-sm flex items-center justify-center gap-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                                Download PDF
                                            </button>
                                            <button 
                                                onClick={() => handleDownloadTicket(booking)}
                                                className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 text-sm flex items-center justify-center gap-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Print Ticket
                                            </button>
                                            {status === 'Confirmed' && (
                                                <button 
                                                    onClick={() => handleCancelClick(booking)}
                                                    className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white font-bold py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                   <p>Event details not available.</p>
                                )}
                                
                                {/* QR Code Section */}
                                {event && (
                                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                            <div className="flex-shrink-0">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 text-center md:text-left">Quick Check-in QR Code</p>
                                                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                                                    <QRCode value={id} size={120} />
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 text-center font-mono">{id.substring(0, 8).toUpperCase()}</p>
                                            </div>
                                            <div className="flex-grow text-sm text-gray-600 dark:text-gray-400">
                                                <p className="mb-2"><strong>Booking ID:</strong> <span className="font-mono">{id}</span></p>
                                                <p className="text-xs">Present this QR code at the venue for quick entry. The QR code contains your unique booking ID.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-xl text-gray-500 dark:text-gray-400">You have no active bookings yet.</p>
                    <a href="/#/events" className="mt-4 inline-block text-red-500 hover:text-red-400 font-semibold">Explore Events</a>
                </div>
            )}

            {/* Cancel Confirmation Modal */}
            {bookingToCancel && (() => {
                const event = events.find(e => e.id === bookingToCancel.eventId);
                const eventTitle = event?.title || 'this event';
                return (
                    <ConfirmModal
                        isOpen={cancelModalOpen}
                        onClose={handleCancelModalClose}
                        onConfirm={handleCancelConfirm}
                        title="Cancel Booking"
                        message={
                            cancelError 
                                ? cancelError
                                : `Are you sure you want to cancel your booking for "${eventTitle}"? This action cannot be undone.`
                        }
                        confirmText="Yes, Cancel Booking"
                        cancelText="Keep Booking"
                        isLoading={isCancelling}
                        isError={!!cancelError}
                    />
                );
            })()}
        </div>
    );
};

export default UserDashboardPage;