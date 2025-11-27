import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import Button from '../components/Button';
import QRCode from '../components/QRCode';
import { downloadTicketAsPDF } from '../services/ticketService';
import { Booking } from '../types';

const BookingPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { events, addBooking, currentUser } = useAppContext();
  
  const [event, setEvent] = useState(events.find(e => e.id === eventId));
  const [tickets, setTickets] = useState(1);
  const [selectedTicketType, setSelectedTicketType] = useState<string>('General Access');
  const [name, setName] = useState(currentUser?.email.split('@')[0].replace(/\b\w/g, l => l.toUpperCase()) || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<Booking | null>(null);

  useEffect(() => {
    const foundEvent = events.find(e => e.id === eventId);
    if (!foundEvent) {
        navigate('/events'); // Redirect if event not found
    }
    setEvent(foundEvent);
  }, [eventId, events, navigate]);

  if (!event) {
    return <div className="text-center py-10">Loading event details...</div>;
  }
  
  // Mock ticket types if not present
  const ticketTypes = event.ticketTypes || [
      { id: 'gen', name: 'General Access', price: event.price, description: 'Standard entry to the event area.' },
      { id: 'vip', name: 'VIP Pass', price: event.price * 2, description: 'Premium seating, lounge access, and complimentary drinks.' },
      { id: 'pit', name: 'Pit Lane Access', price: event.price * 3, description: 'Exclusive access to the pit lane and meet-and-greet opportunities.' },
  ];

  const currentTicketType = ticketTypes.find(t => t.name === selectedTicketType) || ticketTypes[0];
  const totalPrice = currentTicketType.price * tickets;
  const coverImage = event.images && event.images.length > 0 ? event.images[0] : 'https://picsum.photos/seed/fallback/800/600';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
        alert('You must be logged in to book.');
        return;
    }
    if (!name || !email || !phone || tickets < 1) {
      alert('Please fill all fields and select at least one ticket.');
      return;
    }
    try {
        const newBooking = {
            eventId: event.id,
            userName: name,
            userEmail: email,
            phone,
            tickets,
            ticketType: selectedTicketType,
            totalPrice,
            bookingDate: new Date().toISOString(),
            status: 'Confirmed' as 'Confirmed',
        };
        console.log('BookingPage: Attempting to create booking...');
        const createdBooking = await addBooking(newBooking);
        console.log('BookingPage: Booking created successfully:', createdBooking);
        setBookingDetails(createdBooking);
        setIsBooked(true);
    } catch (error: any) {
        console.error("BookingPage: Booking failed:", error);
        const errorMessage = error?.message || "There was an issue with your booking. Please try again.";
        alert(`Booking Error: ${errorMessage}\n\nCheck the browser console for more details.`);
    }
  };
  
  if (isBooked && bookingDetails) {
    return (
      <div className="container mx-auto px-6 py-12 text-center animate-fade-in">
        <h1 className="text-4xl text-green-500 font-bold mb-4">Booking Confirmed!</h1>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-8 max-w-2xl mx-auto shadow-xl">
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{event.title}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{new Date(event.date).toLocaleString()}</p>
          
          {/* QR Code Display */}
          <div className="flex flex-col items-center mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Scan for quick check-in</p>
            <QRCode value={bookingDetails.id} size={180} />
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-3 font-mono">{bookingDetails.id.substring(0, 8).toUpperCase()}</p>
          </div>
          
          <div className="text-left space-y-3 border-t border-gray-200 dark:border-gray-800 pt-6">
             <p><strong className="text-gray-600 dark:text-gray-300">Booking ID:</strong> {bookingDetails.id}</p>
             <p><strong className="text-gray-600 dark:text-gray-300">Name:</strong> {bookingDetails.userName}</p>
             <p><strong className="text-gray-600 dark:text-gray-300">Ticket Type:</strong> {bookingDetails.ticketType}</p>
             <p><strong className="text-gray-600 dark:text-gray-300">Tickets:</strong> {bookingDetails.tickets}</p>
             <p><strong className="text-gray-600 dark:text-gray-300">Total Price:</strong> <span className="text-red-600 font-bold">${bookingDetails.totalPrice.toFixed(2)}</span></p>
          </div>
          <p className="mt-6 text-gray-500 dark:text-gray-500 text-sm">A confirmation email has been sent to {bookingDetails.userEmail}.</p>
          
          {/* Download PDF Button */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={async () => await downloadTicketAsPDF(bookingDetails, event)} 
              className="bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Download Ticket (PDF)
            </Button>
            <Button onClick={() => navigate('/dashboard')} variant="secondary">Go to Dashboard</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden md:flex">
        <div className="md:w-1/2 relative">
            <img src={coverImage} alt={event.title} className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/50"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white md:hidden">
                <h2 className="text-2xl font-bold">{event.title}</h2>
                <p className="text-sm opacity-90">{event.venue}</p>
            </div>
        </div>
        <div className="p-8 md:w-1/2">
          <h1 className="text-3xl font-bold mb-2 hidden md:block">{event.title}</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6 hidden md:block">{event.venue}</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">Select Ticket Type</label>
              <div className="grid grid-cols-1 gap-3">
                  {ticketTypes.map((type) => (
                      <div 
                          key={type.id}
                          onClick={() => setSelectedTicketType(type.name)}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 flex justify-between items-center ${
                              selectedTicketType === type.name 
                                  ? 'border-red-600 bg-red-50 dark:bg-red-900/20' 
                                  : 'border-gray-200 dark:border-gray-700 hover:border-red-300'
                          }`}
                      >
                          <div>
                              <p className="font-bold text-gray-900 dark:text-white">{type.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{type.description}</p>
                          </div>
                          <span className="font-bold text-red-600">${type.price}</span>
                      </div>
                  ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tickets" className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">Quantity</label>
                  <input type="number" id="tickets" min="1" max="10" value={tickets} onChange={e => setTickets(Number(e.target.value))} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500" required />
                </div>
                <div>
                   <label htmlFor="phone" className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">Phone</label>
                   <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500" required />
                </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">Full Name</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">Email</label>
              <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500" required />
            </div>

            <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mt-6">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                    <p className="text-xs text-gray-400">{tickets} x {selectedTicketType}</p>
                </div>
                <span className="text-3xl font-black text-red-600">${totalPrice.toFixed(2)}</span>
            </div>

            <Button type="submit" className="w-full mt-6 py-4 text-lg shadow-lg hover:shadow-red-600/30" size="lg">Confirm Booking</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;