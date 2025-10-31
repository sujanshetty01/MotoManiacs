import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import Button from '../components/Button';
import { Event, EventType } from '../types';

type Tab = 'events' | 'bookings';

const AdminDashboardPage: React.FC = () => {
    const { events, bookings, addEvent, updateEvent, deleteEvent, currentUser, logout } = useAppContext();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('events');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const openAddModal = () => {
        setEditingEvent(null);
        setIsModalOpen(true);
    };

    const openEditModal = (event: Event) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };
    
    const handleSaveEvent = (eventData: Event | Omit<Event, 'id'>) => {
        if ('id' in eventData) {
            updateEvent(eventData);
        } else {
            addEvent(eventData);
        }
        setIsModalOpen(false);
    };

    // Render null if not admin, protected route will handle redirect
    if (currentUser?.role !== 'admin') return null;

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold uppercase tracking-wider">Admin Dashboard</h1>
              <Button onClick={handleLogout} variant="secondary">Logout</Button>
            </div>

            <div className="flex border-b border-gray-700 mb-6">
                <button onClick={() => setActiveTab('events')} className={`py-2 px-4 font-semibold transition-colors ${activeTab === 'events' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}>Manage Events</button>
                <button onClick={() => setActiveTab('bookings')} className={`py-2 px-4 font-semibold transition-colors ${activeTab === 'bookings' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}>View Bookings</button>
            </div>

            {activeTab === 'events' && (
                <div>
                    <Button onClick={openAddModal} className="mb-6">Add New Event</Button>
                    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="p-4">Title</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Venue</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map(event => (
                                    <tr key={event.id} className="border-t border-gray-700">
                                        <td className="p-4">{event.title}</td>
                                        <td className="p-4">{new Date(event.date).toLocaleDateString()}</td>
                                        <td className="p-4">{event.venue}</td>
                                        <td className="p-4">${event.price}</td>
                                        <td className="p-4 flex space-x-2">
                                            <Button size="sm" onClick={() => openEditModal(event)}>Edit</Button>
                                            <Button size="sm" variant="secondary" onClick={() => deleteEvent(event.id)}>Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {activeTab === 'bookings' && (
                 <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-x-auto">
                     <table className="w-full text-left">
                         <thead className="bg-gray-800">
                             <tr>
                                 <th className="p-4">Event</th>
                                 <th className="p-4">User</th>
                                 <th className="p-4">Tickets</th>
                                 <th className="p-4">Total Price</th>
                                 <th className="p-4">Status</th>
                             </tr>
                         </thead>
                         <tbody>
                             {bookings.map(booking => {
                                 const event = events.find(e => e.id === booking.eventId);
                                 return (
                                     <tr key={booking.id} className="border-t border-gray-700">
                                         <td className="p-4">{event?.title || 'N/A'}</td>
                                         <td className="p-4">{booking.userName}<br/><span className="text-sm text-gray-400">{booking.userEmail}</span></td>
                                         <td className="p-4">{booking.tickets}</td>
                                         <td className="p-4">${booking.totalPrice.toFixed(2)}</td>
                                         <td className="p-4">
                                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${booking.status === 'Confirmed' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-black'}`}>
                                                {booking.status}
                                            </span>
                                         </td>
                                     </tr>
                                 );
                             })}
                         </tbody>
                     </table>
                 </div>
            )}
            {isModalOpen && <EventModal event={editingEvent} onSave={handleSaveEvent} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

const EventModal: React.FC<{event: Event | null, onSave: (eventData: any) => void, onClose: () => void}> = ({ event, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        title: event?.title || '',
        date: event?.date ? new Date(event.date).toISOString().substring(0, 16) : '',
        venue: event?.venue || '',
        price: event?.price || 0,
        description: event?.description || '',
        duration: event?.duration || '',
        image: event?.image || 'https://picsum.photos/seed/newevent/800/600',
        type: event?.type || EventType.Car,
        featured: event?.featured || false
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
             const { checked } = e.target as HTMLInputElement;
             setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
             setFormData(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave = { ...formData, date: new Date(formData.date).toISOString() };
        if (event) {
            onSave({ ...dataToSave, id: event.id });
        } else {
            onSave(dataToSave);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-gray-900 rounded-lg p-8 w-full max-w-2xl border border-gray-700 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">{event ? 'Edit Event' : 'Add New Event'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                     {/* Form fields here */}
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full bg-gray-800 p-2 rounded border border-gray-700" required/>
                    <input name="date" type="datetime-local" value={formData.date} onChange={handleChange} className="w-full bg-gray-800 p-2 rounded border border-gray-700" required/>
                    <input name="venue" value={formData.venue} onChange={handleChange} placeholder="Venue" className="w-full bg-gray-800 p-2 rounded border border-gray-700" required/>
                    <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price" className="w-full bg-gray-800 p-2 rounded border border-gray-700" required/>
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full bg-gray-800 p-2 rounded border border-gray-700" required></textarea>
                    <input name="duration" value={formData.duration} onChange={handleChange} placeholder="Duration" className="w-full bg-gray-800 p-2 rounded border border-gray-700" required/>
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-gray-800 p-2 rounded border border-gray-700">
                        <option value={EventType.Car}>Car</option>
                        <option value={EventType.Bike}>Bike</option>
                    </select>
                     <div className="flex items-center">
                        <input name="featured" type="checkbox" checked={formData.featured} onChange={handleChange} className="h-4 w-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500" />
                        <label htmlFor="featured" className="ml-2 block text-sm text-gray-300">Featured Event</label>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Save Event</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminDashboardPage;