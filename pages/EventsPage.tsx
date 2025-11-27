import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import EventCard from '../components/EventCard';
import { EventType } from '../types';

const EventsPage: React.FC = () => {
  const { events } = useAppContext();
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState<EventType>(EventType.All);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam) {
      // Check if the param matches any EventType value
      const matchedType = Object.values(EventType).find(t => t === filterParam);
      if (matchedType) {
        setFilter(matchedType as EventType);
      }
    }
  }, [searchParams]);

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
      className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 transform whitespace-nowrap ${
        filter === type 
          ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg scale-105' 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-red-600 font-bold text-sm uppercase tracking-widest">Discover</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">
            All Events
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find your next adrenaline rush. Explore our complete collection of motorsport events.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex flex-wrap gap-2 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-x-auto max-w-full">
            <FilterButton type={EventType.All} label="All" />
            <FilterButton type={EventType.Car} label="Cars" />
            <FilterButton type={EventType.Bike} label="Bikes" />
            <FilterButton type={EventType.TrackDay} label="Track Days" />
            <FilterButton type={EventType.OffRoad} label="Off-Road" />
            <FilterButton type={EventType.Karting} label="Karting" />
            <FilterButton type={EventType.SimRacing} label="Sim Racing" />
          </div>
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 shadow-md hover:shadow-lg"
            />
          </div>
        </div>

        {/* Events Count */}
        {filteredEvents.length > 0 && (
          <div className="mb-8 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold">{filteredEvents.length}</span> event{filteredEvents.length !== 1 ? 's' : ''} found
          </div>
        )}

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <div key={event.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                <EventCard event={event} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No events found</h3>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">Try adjusting your search or filter criteria.</p>
            <button
              onClick={() => {
                setFilter(EventType.All);
                setSearchTerm('');
              }}
              className="text-red-600 hover:text-red-700 font-semibold underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;