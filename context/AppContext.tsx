import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Event, Booking, User } from '../types';
import { mockEvents, mockBookings, mockUsers } from '../data/mockData';

interface AppContextType {
  events: Event[];
  bookings: Booking[];
  currentUser: User | null;
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: number) => void;
  addBooking: (booking: Omit<Booking, 'id' | 'userId'>) => void;
  cancelBooking: (bookingId: number) => void;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from session storage", error);
      sessionStorage.removeItem('currentUser');
    }
  }, []);

  const addEvent = (event: Omit<Event, 'id'>) => {
    setEvents(prev => [...prev, { ...event, id: Date.now() }]);
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents(prev => prev.map(event => (event.id === updatedEvent.id ? updatedEvent : event)));
  };

  const deleteEvent = (eventId: number) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const addBooking = (booking: Omit<Booking, 'id' | 'userId'>) => {
    if (!currentUser) {
        throw new Error("User must be logged in to make a booking.");
    }
    const newBooking = {
        ...booking,
        id: Date.now(),
        userId: currentUser.id,
    };
    setBookings(prev => [...prev, newBooking]);
  };
  
  const cancelBooking = (bookingId: number) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? {...b, status: 'Cancelled'} : b));
  };

  const login = (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => { // Simulate network delay
        const user = mockUsers.find(u => u.email === email && u.password === password);
        if (user) {
          setCurrentUser(user);
          sessionStorage.setItem('currentUser', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
  };

  const value = { 
      events, 
      bookings, 
      currentUser, 
      addEvent, 
      updateEvent, 
      deleteEvent, 
      addBooking, 
      cancelBooking, 
      login, 
      logout 
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};