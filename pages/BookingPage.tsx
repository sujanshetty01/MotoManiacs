import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import Button from '../components/Button';
import { Booking } from '../types';

const BookingPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { events, addBooking, currentUser } = useAppContext();
  
  const [event, setEvent] = useState(events.find(e => e.id === Number(eventId)));
  const [tickets, setTickets] = useState(1);
  const [name, setName] = useState(currentUser?.email.split('@')[0].replace(/\b\w/g, l => l.toUpperCase()) || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<Booking | null>(null);

  useEffect(() => {
    const foundEvent = events.find(e => e.id === Number(eventId));
    if (!foundEvent) {
        navigate('/events'); // Redirect if event not found
    }
    setEvent(foundEvent);
  }, [eventId, events, navigate]);

  if (!event) {
    return <div className="text-center py-10">Loading event details...</div>;
  }
  
  const coverImage = event.images && event.images.length > 0 ? event.images[0] : 'https://picsum.photos/seed/fallback/800/600';
  const totalPrice = event.price * tickets;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
        alert('You must be logged in to book.');
        return;
    }
    if (!name || !email || !phone || tickets < 1) {
      alert('Please fill all fields and select at least one ticket.');
      return;
    }
    const newBooking = {
      eventId: event.id,
      userName: name,
      userEmail: email,
      phone,
      tickets,
      totalPrice,
      bookingDate: new Date().toISOString(),
      status: 'Confirmed' as 'Confirmed',
    };
    addBooking(newBooking);
    setBookingDetails({ ...newBooking, id: Date.now(), userId: currentUser.id });
    setIsBooked(true);
  };
  
  if (isBooked && bookingDetails) {
    return (
      <div className="container mx-auto px-6 py-12 text-center animate-fade-in">
        <h1 className="text-4xl text-green-500 font-bold mb-4">Booking Confirmed!</h1>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{event.title}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{new Date(event.date).toLocaleString()}</p>
          <div className="text-left space-y-3">
             <p><strong className="text-gray-600 dark:text-gray-300">Booking ID:</strong> {bookingDetails.id}</p>
             <p><strong className="text-gray-600 dark:text-gray-300">Name:</strong> {bookingDetails.userName}</p>
             <p><strong className="text-gray-600 dark:text-gray-300">Tickets:</strong> {bookingDetails.tickets}</p>
             <p><strong className="text-gray-600 dark:text-gray-300">Total Price:</strong> ${bookingDetails.totalPrice.toFixed(2)}</p>
          </div>
          <p className="mt-6 text-gray-500 dark:text-gray-500">A confirmation email has been sent to {bookingDetails.userEmail}.</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-8">Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden md:flex">
        <div className="md:w-1/2">
            <img src={coverImage} alt={event.title} className="w-full h-full object-cover"/>
        </div>
        <div className="p-8 md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{event.venue}</p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500" required />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500" required />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="block text-gray-700 dark:text-gray-300 mb-2">Phone</label>
              <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500" required />
            </div>
            <div className="mb-6">
              <label htmlFor="tickets" className="block text-gray-700 dark:text-gray-300 mb-2">Number of Tickets</label>
              <input type="number" id="tickets" min="1" max="10" value={tickets} onChange={e => setTickets(Number(e.target.value))} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500" required />
            </div>

            <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                <span className="text-lg font-bold">Total Price:</span>
                <span className="text-2xl font-bold text-red-500">${totalPrice.toFixed(2)}</span>
            </div>

            <Button type="submit" className="w-full mt-6" size="lg">Confirm Booking</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;