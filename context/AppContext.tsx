import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Event, Booking, User } from '../types';
import { mockEvents, mockBookings, mockUsers } from '../data/mockData';

type Theme = 'light' | 'dark';

interface AppContextType {
  events: Event[];
  bookings: Booking[];
  currentUser: User | null;
  theme: Theme;
  toggleTheme: () => void;
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
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) return savedTheme;
    const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return userPrefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

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
      theme,
      toggleTheme,
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