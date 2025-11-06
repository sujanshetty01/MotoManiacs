import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Event, Booking, User } from '../types';
import { mockEvents, mockBookings } from '../data/mockData';
import { signIn, signUp, signOutUser, onAuthStateChange } from '../services/authService';

type Theme = 'light' | 'dark';

interface AppContextType {
  events: Event[];
  bookings: Booking[];
  currentUser: User | null;
  theme: Theme;
  isLoading: boolean;
  toggleTheme: () => void;
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (event: Event) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  addBooking: (booking: Omit<Booking, 'id' | 'userId'>) => Promise<Booking>;
  cancelBooking: (bookingId: string) => Promise<void>;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with true to wait for auth check
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) return savedTheme;
    const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return userPrefersDark ? 'dark' : 'light';
  });

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setCurrentUser(user);
      setIsLoading(false);
      
      // Load bookings based on user role
      if (user) {
        if (user.role === 'admin') {
          setBookings(mockBookings);
        } else {
          const userBookings = mockBookings.filter(b => b.userId === user.id);
          setBookings(userBookings);
        }
      } else {
        setBookings([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const addEvent = async (event: Omit<Event, 'id'>) => {
    const newEvent = { ...event, id: new Date().getTime().toString() };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = async (updatedEvent: Event) => {
    setEvents(prev => prev.map(event => (event.id === updatedEvent.id ? updatedEvent : event)));
  };

  const deleteEvent = async (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const addBooking = async (booking: Omit<Booking, 'id' | 'userId'>): Promise<Booking> => {
    if (!currentUser) {
        throw new Error("User must be logged in to make a booking.");
    }
    const newBooking: Booking = {
        ...booking,
        id: new Date().getTime().toString(),
        userId: currentUser.id,
    };
    setBookings(prev => [...prev, newBooking]);
    return newBooking;
  };
  
  const cancelBooking = async (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? {...b, status: 'Cancelled'} : b));
  };

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const user = await signIn(email, password);
      // Auth state listener will update currentUser automatically
      return user;
    } catch (error: any) {
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const user = await signUp(email, password);
      // Auth state listener will update currentUser automatically
      return user;
    } catch (error: any) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOutUser();
      // Auth state listener will update currentUser automatically
      setCurrentUser(null);
      setBookings([]);
    } catch (error: any) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = { 
      events, 
      bookings, 
      currentUser, 
      theme,
      isLoading,
      toggleTheme,
      addEvent, 
      updateEvent, 
      deleteEvent, 
      addBooking, 
      cancelBooking, 
      login,
      register,
      logout 
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};