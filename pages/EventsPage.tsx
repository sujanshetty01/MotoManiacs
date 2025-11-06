import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import EventCard from '../components/EventCard';
import { EventType } from '../types';

const EventsPage: React.FC = () => {
  const { events } = useAppContext();
  const [filter, setFilter] = useState<EventType>(EventType.All);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = useMemo(() => {
    return events
      .filter(event => {
        if (filter === EventType.All) return true;
        return event.type === filter;
      })
      .filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [events, filter, searchTerm]);

  const FilterButton = ({ type, label }: { type: EventType; label: string }) => (
    <button
      onClick={() => setFilter(type)}
      className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${filter === type ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wider">All Events</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Find your next adrenaline rush.</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex space-x-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
          <FilterButton type={EventType.All} label="All" />
          <FilterButton type={EventType.Car} label="Car Shows" />
          <FilterButton type={EventType.Bike} label="Bike Rallies" />
        </div>
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-md py-2 px-4 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500 dark:text-gray-400">No events found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default EventsPage;