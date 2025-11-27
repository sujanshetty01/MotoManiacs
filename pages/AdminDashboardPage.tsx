import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import Button from '../components/Button';
import { Event, EventType } from '../types';
import { generateImages, ImageGenerationConfig } from '../services/imagenService';
import CMSManagement from '../components/CMSManagement';
import AdminReviewQueue from '../components/AdminReviewQueue';
import ProductManagement from '../components/ProductManagement';
import InputField from '../components/InputField';
import TextAreaField from '../components/TextAreaField';

type Tab = 'events' | 'bookings' | 'cms' | 'submissions' | 'products';

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
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    
    const totalRevenue = bookings
        .filter(b => b.status === 'Confirmed')
        .reduce((sum, b) => sum + b.totalPrice, 0);

    const openAddModal = () => {
        setEditingEvent(null);
        setIsModalOpen(true);
        setError(null);
        setSuccessMessage(null);
    };

    const openEditModal = (event: Event) => {
        setEditingEvent(event);
        setIsModalOpen(true);
        setError(null);
        setSuccessMessage(null);
    };
    
    const handleSaveEvent = async (eventData: Event | Omit<Event, 'id'>) => {
        setIsSaving(true);
        setError(null);
        setSuccessMessage(null);
        
        try {
            if ('id' in eventData) {
                await updateEvent(eventData);
                setSuccessMessage('Event updated successfully! Changes are saved to Firebase.');
            } else {
                await addEvent(eventData);
                setSuccessMessage('Event added successfully! It\'s now saved in Firebase.');
            }
            setIsModalOpen(false);
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to save event. Please try again.');
            console.error('Error saving event:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteEvent = async (eventId: string) => {
        if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            return;
        }
        
        try {
            await deleteEvent(eventId);
            setSuccessMessage('Event deleted successfully from Firebase!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to delete event. Please try again.');
            console.error('Error deleting event:', err);
            setTimeout(() => setError(null), 5000);
        }
    };

    if (currentUser?.role !== 'admin') return null;

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold uppercase tracking-wider">Admin Dashboard</h1>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {successMessage && (
                <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 rounded-lg">
                    <strong>Success:</strong> {successMessage}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Events" value={events.length} />
                <StatCard title="Total Bookings" value={bookings.length} />
                <StatCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} />
            </div>

            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
                <button onClick={() => setActiveTab('events')} className={`py-2 px-4 font-semibold transition-colors whitespace-nowrap ${activeTab === 'events' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500 dark:text-gray-400'}`}>Manage Events</button>
                <button onClick={() => setActiveTab('bookings')} className={`py-2 px-4 font-semibold transition-colors whitespace-nowrap ${activeTab === 'bookings' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500 dark:text-gray-400'}`}>View Bookings</button>
                <button onClick={() => setActiveTab('cms')} className={`py-2 px-4 font-semibold transition-colors whitespace-nowrap ${activeTab === 'cms' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500 dark:text-gray-400'}`}>CMS Content</button>
                <button onClick={() => setActiveTab('submissions')} className={`py-2 px-4 font-semibold transition-colors whitespace-nowrap ${activeTab === 'submissions' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500 dark:text-gray-400'}`}>Submissions</button>
                <button onClick={() => setActiveTab('products')} className={`py-2 px-4 font-semibold transition-colors whitespace-nowrap ${activeTab === 'products' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500 dark:text-gray-400'}`}>Products</button>
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
                                            <Button size="sm" variant="secondary" onClick={() => handleDeleteEvent(event.id)}>Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {activeTab === 'bookings' && (
                <div>
                    {bookings.length > 0 ? (
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-x-auto shadow-lg">
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    All User Bookings ({bookings.length})
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    View and manage all bookings made by users
                                </p>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-gray-100 dark:bg-gray-800">
                                    <tr>
                                        <th className="p-4 font-semibold">Booking Date</th>
                                        <th className="p-4 font-semibold">Event</th>
                                        <th className="p-4 font-semibold">User</th>
                                        <th className="p-4 font-semibold">Contact</th>
                                        <th className="p-4 font-semibold">Tickets</th>
                                        <th className="p-4 font-semibold">Total Price</th>
                                        <th className="p-4 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((booking, index) => {
                                        const event = events.find(e => e.id === booking.eventId);
                                        return (
                                            <tr key={booking.id} className={`border-t border-gray-200 dark:border-gray-700 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900/50' : 'bg-white dark:bg-gray-900'} hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors`}>
                                                <td className="p-4 text-sm">
                                                    {new Date(booking.bookingDate).toLocaleDateString('en-US', { 
                                                        year: 'numeric', 
                                                        month: 'short', 
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-medium text-gray-900 dark:text-white">{event?.title || 'Event Deleted'}</div>
                                                    {event && (
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">{event.venue}</div>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-medium text-gray-900 dark:text-white">{booking.userName}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{booking.userEmail}</div>
                                                </td>
                                                <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{booking.phone}</td>
                                                <td className="p-4">
                                                    <span className="font-semibold text-gray-900 dark:text-white">{booking.tickets}</span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">ticket{booking.tickets !== 1 ? 's' : ''}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className="font-bold text-lg text-red-600">${booking.totalPrice.toFixed(2)}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1.5 text-sm font-semibold rounded-full inline-block ${
                                                        booking.status === 'Confirmed' 
                                                            ? 'bg-green-600 text-white' 
                                                            : booking.status === 'Cancelled'
                                                                ? 'bg-red-600 text-white'
                                                                : 'bg-yellow-500 text-white'
                                                    }`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-12 text-center">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Bookings Yet</h3>
                            <p className="text-lg text-gray-500 dark:text-gray-400">
                                Bookings will appear here once users start booking events.
                            </p>
                        </div>
                    )}
                </div>
            )}
            {activeTab === 'cms' && <CMSManagement />}
            {activeTab === 'submissions' && <AdminReviewQueue />}
            {activeTab === 'products' && <ProductManagement />}
            {isModalOpen && <EventModal event={editingEvent} onSave={handleSaveEvent} onClose={() => setIsModalOpen(false)} isSaving={isSaving} />}
        </div>
    );
};

const SelectField: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string, children: React.ReactNode }> = ({ label, children, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">{label}</label>
        <select {...props} className="w-full bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500">
            {children}
        </select>
    </div>
);

const EventModal: React.FC<{event: Event | null, onSave: (eventData: any) => Promise<void>, onClose: () => void, isSaving?: boolean}> = ({ event, onSave, onClose, isSaving = false }) => {
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
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [generationConfig, setGenerationConfig] = useState<ImageGenerationConfig>({
        eventTitle: '',
        description: '',
        numImages: 4,
        aspectRatio: '16:9',
        style: 'photorealistic',
        mood: 'vibrant',
        cameraGuidance: 'editorial',
        imageSize: '1K',
        personGeneration: 'allow_adult',
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

    const handleOpenGenerateModal = () => {
        // Update config with current form data
        setGenerationConfig(prev => ({
            ...prev,
            eventTitle: formData.title || prev.eventTitle,
            description: formData.description || prev.description,
        }));
        setIsGenerateModalOpen(true);
        setGenerationError(null);
        setGeneratedImages([]);
    };

    const handleGenerateImages = async () => {
        if (!formData.title || !formData.description) {
            setGenerationError('Please fill in the event title and description first.');
            return;
        }

        setIsGenerating(true);
        setGenerationError(null);
        setGeneratedImages([]);

        try {
            const config: ImageGenerationConfig = {
                ...generationConfig,
                eventTitle: formData.title,
                description: formData.description,
            };

            const images = await generateImages(config);
            setGeneratedImages(images);
        } catch (error: any) {
            console.error('Error generating images:', error);
            setGenerationError(error.message || 'Failed to generate images. Please check your API key and try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAddGeneratedImage = (imageUrl: string) => {
        if (!formData.images.includes(imageUrl)) {
            setFormData(prev => ({ ...prev, images: [...prev.images, imageUrl] }));
        }
    };

    const handleAddAllGeneratedImages = () => {
        const newImages = generatedImages.filter(img => !formData.images.includes(img));
        if (newImages.length > 0) {
            setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
        }
        setIsGenerateModalOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.images.length === 0) {
            alert("Please add at least one image for the event.");
            return;
        }
        
        const dataToSave = { ...formData, date: new Date(formData.date).toISOString() };
        if (event) {
            await onSave({ ...dataToSave, id: event.id });
        } else {
            await onSave(dataToSave);
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
                             <TextAreaField label="Description" name="description" value={formData.description} onChange={handleChange} placeholder="Event description..." className="h-24" required/>
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
                            <Button type="button" onClick={handleAddImage} variant="secondary">Add URL</Button>
                            <Button type="button" onClick={handleOpenGenerateModal} variant="secondary" className="bg-blue-600 hover:bg-blue-700 text-white">
                                Generate with AI
                            </Button>
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
                        <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>Cancel</Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? 'Saving to Firebase...' : 'Save Event'}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Image Generation Modal */}
            {isGenerateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[60] p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-8 w-full max-w-4xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6">Generate Images with AI</h2>
                        
                        {generationError && (
                            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">
                                <strong>Error:</strong> {generationError}
                            </div>
                        )}

                        <div className="space-y-4 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">
                                        Number of Images
                                    </label>
                                    <select
                                        value={generationConfig.numImages}
                                        onChange={(e) => setGenerationConfig(prev => ({ ...prev, numImages: parseInt(e.target.value) }))}
                                        className="w-full bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">
                                        Aspect Ratio
                                    </label>
                                    <select
                                        value={generationConfig.aspectRatio}
                                        onChange={(e) => setGenerationConfig(prev => ({ ...prev, aspectRatio: e.target.value as any }))}
                                        className="w-full bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        <option value="1:1">1:1 (Square)</option>
                                        <option value="16:9">16:9 (Wide)</option>
                                        <option value="9:16">9:16 (Portrait)</option>
                                        <option value="4:3">4:3 (Standard)</option>
                                        <option value="3:4">3:4 (Portrait)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">
                                        Style
                                    </label>
                                    <input
                                        type="text"
                                        value={generationConfig.style}
                                        onChange={(e) => setGenerationConfig(prev => ({ ...prev, style: e.target.value }))}
                                        placeholder="e.g., photorealistic, vintage film, neon cyberpunk"
                                        className="w-full bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">
                                        Mood / Color Palette
                                    </label>
                                    <input
                                        type="text"
                                        value={generationConfig.mood}
                                        onChange={(e) => setGenerationConfig(prev => ({ ...prev, mood: e.target.value }))}
                                        placeholder="e.g., warm and vibrant, muted pastel"
                                        className="w-full bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">
                                        Camera / Composition
                                    </label>
                                    <select
                                        value={generationConfig.cameraGuidance}
                                        onChange={(e) => setGenerationConfig(prev => ({ ...prev, cameraGuidance: e.target.value }))}
                                        className="w-full bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        <option value="editorial">Editorial</option>
                                        <option value="close-up">Close-up</option>
                                        <option value="wide-angle">Wide-angle</option>
                                        <option value="aerial">Aerial</option>
                                        <option value="poster">Poster Layout</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">
                                        Image Size
                                    </label>
                                    <select
                                        value={generationConfig.imageSize}
                                        onChange={(e) => setGenerationConfig(prev => ({ ...prev, imageSize: e.target.value as '1K' | '2K' }))}
                                        className="w-full bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        <option value="1K">1K (Standard)</option>
                                        <option value="2K">2K (High Resolution)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <Button
                                type="button"
                                onClick={handleGenerateImages}
                                disabled={isGenerating || !formData.title || !formData.description}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {isGenerating ? 'Generating...' : 'Generate Images'}
                            </Button>
                            {generatedImages.length > 0 && (
                                <Button
                                    type="button"
                                    onClick={handleAddAllGeneratedImages}
                                    variant="secondary"
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    Add All to Event
                                </Button>
                            )}
                        </div>

                        {generatedImages.length > 0 && (
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-2">Generated Images</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {generatedImages.map((imgUrl, index) => (
                                        <div key={index} className="relative group border-2 border-gray-300 dark:border-gray-700 rounded-md overflow-hidden aspect-video">
                                            <img src={imgUrl} alt={`Generated image ${index + 1}`} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    onClick={() => handleAddGeneratedImage(imgUrl)}
                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                >
                                                    Add to Event
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setIsGenerateModalOpen(false)}
                                disabled={isGenerating}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboardPage;