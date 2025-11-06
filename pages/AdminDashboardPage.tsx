import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import Button from '../components/Button';
import { Event, EventType } from '../types';

type Tab = 'events' | 'bookings';

const StatCard: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
    </div>
);

const AdminDashboardPage: React.FC = () => {
    const { events, bookings, addEvent, updateEvent, deleteEvent, currentUser } = useAppContext();
    const [activeTab, setActiveTab] = useState<Tab>('events');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    
    const totalRevenue = bookings
        .filter(b => b.status === 'Confirmed')
        .reduce((sum, b) => sum + b.totalPrice, 0);

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

    if (currentUser?.role !== 'admin') return null;

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold uppercase tracking-wider">Admin Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Events" value={events.length} />
                <StatCard title="Total Bookings" value={bookings.length} />
                <StatCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} />
            </div>

            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                <button onClick={() => setActiveTab('events')} className={`py-2 px-4 font-semibold transition-colors ${activeTab === 'events' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500 dark:text-gray-400'}`}>Manage Events</button>
                <button onClick={() => setActiveTab('bookings')} className={`py-2 px-4 font-semibold transition-colors ${activeTab === 'bookings' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500 dark:text-gray-400'}`}>View Bookings</button>
            </div>

            {activeTab === 'events' && (
                <div>
                    <Button onClick={openAddModal} className="mb-6">Add New Event</Button>
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-100 dark:bg-gray-800">
                                <tr>
                                    <th className="p-4">Title</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Venue</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map((event, index) => (
                                    <tr key={event.id} className={`border-t border-gray-200 dark:border-gray-700 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900/50' : 'bg-white dark:bg-gray-900'} hover:bg-gray-100 dark:hover:bg-gray-800/50`}>
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
                 <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-x-auto">
                     <table className="w-full text-left">
                         <thead className="bg-gray-100 dark:bg-gray-800">
                             <tr>
                                 <th className="p-4">Event</th>
                                 <th className="p-4">User</th>
                                 <th className="p-4">Tickets</th>
                                 <th className="p-4">Total Price</th>
                                 <th className="p-4">Status</th>
                             </tr>
                         </thead>
                         <tbody>
                             {bookings.map((booking, index) => {
                                 const event = events.find(e => e.id === booking.eventId);
                                 return (
                                     <tr key={booking.id} className={`border-t border-gray-200 dark:border-gray-700 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900/50' : 'bg-white dark:bg-gray-900'} hover:bg-gray-100 dark:hover:bg-gray-800/50`}>
                                         <td className="p-4">{event?.title || 'N/A'}</td>
                                         <td className="p-4">{booking.userName}<br/><span className="text-sm text-gray-500 dark:text-gray-400">{booking.userEmail}</span></td>
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

// --- Helper components for EventModal form fields ---
const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">{label}</label>
        <input {...props} className="w-full bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
    </div>
);
const TextareaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">{label}</label>
        <textarea {...props} className="w-full bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"></textarea>
    </div>
);
const SelectField: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string, children: React.ReactNode }> = ({ label, children, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">{label}</label>
        <select {...props} className="w-full bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500">
            {children}
        </select>
    </div>
);


const EventModal: React.FC<{event: Event | null, onSave: (eventData: any) => void, onClose: () => void}> = ({ event, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        title: event?.title || '',
        date: event?.date ? new Date(event.date).toISOString().substring(0, 16) : '',
        venue: event?.venue || '',
        price: event?.price || 0,
        description: event?.description || '',
        duration: event?.duration || '',
        images: event?.images || [],
        type: event?.type || EventType.Car,
        featured: event?.featured || false
    });
    const [newImageUrl, setNewImageUrl] = useState('');
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
             const { checked } = e.target as HTMLInputElement;
             setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
             setFormData(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
        }
    };
    
    const handleAddImage = () => {
        if (newImageUrl.trim() && !formData.images.includes(newImageUrl.trim())) {
            try {
                new URL(newImageUrl); // Basic URL validation
                setFormData(prev => ({ ...prev, images: [...prev.images, newImageUrl.trim()] }));
                setNewImageUrl('');
            } catch (error) {
                alert('Please enter a valid image URL.');
            }
        }
    };

    const handleRemoveImage = (urlToRemove: string) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter(url => url !== urlToRemove) }));
    };

    const handleSetAsCover = (urlToSet: string) => {
        setFormData(prev => ({ ...prev, images: [urlToSet, ...prev.images.filter(url => url !== urlToSet)] }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.images.length === 0) {
            alert("Please add at least one image for the event.");
            return;
        }
        const dataToSave = { ...formData, date: new Date(formData.date).toISOString() };
        if (event) {
            onSave({ ...dataToSave, id: event.id });
        } else {
            onSave(dataToSave);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-8 w-full max-w-3xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">{event ? 'Edit Event' : 'Add New Event'}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <InputField label="Title" name="title" value={formData.title} onChange={handleChange} placeholder="Event Title" required/>
                        <InputField label="Date and Time" name="date" type="datetime-local" value={formData.date} onChange={handleChange} required/>
                        <InputField label="Venue" name="venue" value={formData.venue} onChange={handleChange} placeholder="Location" required/>
                        <InputField label="Price ($)" name="price" type="number" value={formData.price} onChange={handleChange} placeholder="0" required/>
                        <InputField label="Duration" name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g., 4 hours" required/>
                        <SelectField label="Type" name="type" value={formData.type} onChange={handleChange}>
                            <option value={EventType.Car}>Car</option>
                            <option value={EventType.Bike}>Bike</option>
                        </SelectField>
                        <div className="md:col-span-2">
                             <TextareaField label="Description" name="description" value={formData.description} onChange={handleChange} placeholder="Event description..." className="h-24" required/>
                        </div>
                         <div className="flex items-center md:col-span-2">
                            <input id="featured" name="featured" type="checkbox" checked={formData.featured} onChange={handleChange} className="h-4 w-4 text-red-600 bg-gray-300 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-red-500" />
                            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">Featured Event</label>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2 mt-2 border-t border-gray-200 dark:border-gray-700 pt-4">Event Images</h3>
                        <div className="flex gap-2 mb-4">
                            <input type="url" value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" className="flex-grow bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
                            <Button type="button" onClick={handleAddImage} variant="secondary">Add</Button>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-2 rounded-md bg-gray-100 dark:bg-black/20 min-h-[8rem]">
                            {formData.images.map((url, index) => (
                                <div key={index} className="relative group border-2 border-gray-300 dark:border-gray-700 rounded-md overflow-hidden aspect-video">
                                    <img src={url} alt={`Event image ${index + 1}`} className="w-full h-full object-cover" />
                                    {index === 0 && <span className="absolute top-1 left-1 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">Cover</span>}
                                    <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-1 p-1">
                                        {index > 0 && <Button type="button" size="sm" onClick={() => handleSetAsCover(url)} className="w-full text-xs">Set Cover</Button>}
                                        <Button type="button" size="sm" variant="secondary" onClick={() => handleRemoveImage(url)} className="w-full text-xs">Remove</Button>
                                    </div>
                                </div>
                            ))}
                             {formData.images.length === 0 && <div className="col-span-full flex items-center justify-center"><p className="text-gray-500">No images added yet.</p></div>}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Save Event</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminDashboardPage;