import React, { useState, useEffect } from 'react';
import { getSlotsByEventId, createQuickBooking, getAvailableSlots } from '../services/availabilityService';
import { AvailabilitySlot, QuickBooking } from '../types';
import Button from './Button';
import InputField from './InputField';
import { useAppContext } from '../hooks/useAppContext';

interface QuickBookProps {
    eventId?: string;
    eventTitle?: string;
}

const QuickBook: React.FC<QuickBookProps> = ({ eventId, eventTitle }) => {
    const { currentUser } = useAppContext();
    const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
    const [participants, setParticipants] = useState(1);
    const [vehicleType, setVehicleType] = useState<'Car' | 'Bike'>('Car');
    const [phone, setPhone] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSlots = async () => {
            setLoading(true);
            try {
                let data;
                if (eventId) {
                    data = await getSlotsByEventId(eventId);
                } else {
                    data = await getAvailableSlots();
                }
                setSlots(data.filter(s => s.available > 0));
            } catch (err) {
                console.error("Error fetching slots", err);
                setError("Failed to load availability.");
            } finally {
                setLoading(false);
            }
        };
        fetchSlots();
    }, [eventId]);

    const handleBook = async () => {
        if (!currentUser) {
            alert("Please login to book.");
            return;
        }
        if (!selectedSlot) return;

        try {
            const bookingData: Omit<QuickBooking, 'id' | 'bookingDate' | 'status'> = {
                slotId: selectedSlot.id,
                userId: currentUser.id,
                userName: currentUser.email, // Using email as name if name not available
                userEmail: currentUser.email,
                phone,
                vehicleType,
                participants,
                totalPrice: selectedSlot.price * participants
            };

            await createQuickBooking(bookingData);
            setBookingSuccess(true);
            // Refresh slots
             if (eventId) {
                const data = await getSlotsByEventId(eventId);
                setSlots(data.filter(s => s.available > 0));
            } else {
                const data = await getAvailableSlots();
                setSlots(data.filter(s => s.available > 0));
            }
            setSelectedSlot(null);
        } catch (err: any) {
            setError(err.message || "Booking failed");
        }
    };

    if (loading) return <div className="p-4 text-center text-gray-500">Loading availability...</div>;
    
    if (bookingSuccess) return (
        <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg text-center border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">Booking Confirmed!</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Your slot has been reserved. Check your email for details.</p>
            <Button onClick={() => setBookingSuccess(false)} className="mt-2">Book Another</Button>
        </div>
    );

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                <span className="mr-2">⚡</span>
                {eventTitle ? `Quick Book: ${eventTitle}` : 'Quick Book - Arrive & Drive'}
            </h3>
            
            {error && <div className="p-3 bg-red-100 text-red-700 rounded mb-4 text-sm">{error}</div>}

            {!selectedSlot ? (
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Select an available time slot:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                        {slots.length === 0 ? (
                            <p className="text-gray-500 italic col-span-2 text-center py-4">No slots available at this time.</p>
                        ) : (
                            slots.map(slot => (
                                <button
                                    key={slot.id}
                                    onClick={() => setSelectedSlot(slot)}
                                    className="p-3 border border-gray-200 dark:border-gray-700 rounded hover:border-red-500 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all text-left group"
                                >
                                    <div className="font-semibold text-gray-900 dark:text-white group-hover:text-red-600">
                                        {new Date(slot.date).toLocaleDateString()}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        {slot.timeSlot}
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs items-center">
                                        <span className="text-gray-900 dark:text-gray-200 font-bold bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">${slot.price}</span>
                                        <span className="text-green-600 dark:text-green-400 font-medium">{slot.available} left</span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-4 animate-fadeIn">
                    <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded border border-gray-200 dark:border-gray-700">
                        <div>
                            <div className="font-bold text-gray-900 dark:text-white">{new Date(selectedSlot.date).toLocaleDateString()}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{selectedSlot.timeSlot}</div>
                        </div>
                        <Button variant="secondary" size="sm" onClick={() => setSelectedSlot(null)}>Change</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Participants</label>
                            <input 
                                type="number" 
                                min="1" 
                                max={selectedSlot.available} 
                                value={participants}
                                onChange={(e) => setParticipants(parseInt(e.target.value))}
                                className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Vehicle Type</label>
                            <select 
                                value={vehicleType}
                                onChange={(e) => setVehicleType(e.target.value as 'Car' | 'Bike')}
                                className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                            >
                                <option value="Car">Car</option>
                                <option value="Bike">Bike</option>
                            </select>
                        </div>
                    </div>

                    <InputField 
                        label="Phone Number" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        placeholder="+1 (555) 000-0000"
                        required
                    />

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-bold text-gray-700 dark:text-gray-300">Total:</span>
                            <span className="text-2xl font-bold text-red-600">${selectedSlot.price * participants}</span>
                        </div>
                        
                        {!currentUser ? (
                             <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded text-sm mb-2">
                                Please log in to complete your booking.
                             </div>
                        ) : (
                            <Button onClick={handleBook} className="w-full py-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                                Confirm Booking
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuickBook;
