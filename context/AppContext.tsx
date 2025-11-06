import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Event, Booking, User } from '../types';
import { mockBookings } from '../data/mockData';
import { signIn, signUp, signOutUser, onAuthStateChange } from '../services/authService';
import { getEvents, addEvent as addEventToFirestore, updateEvent as updateEventInFirestore, deleteEvent as deleteEventFromFirestore, subscribeToEvents } from '../services/eventsService';
import { seedEvents } from '../scripts/seedEvents';

// Make seedEvents available in browser console for development
if (typeof window !== 'undefined') {
  (window as any).seedEvents = seedEvents;
}

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
  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with true to wait for auth check
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) return savedTheme;
    const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return userPrefersDark ? 'dark' : 'light';
  });

  // Load events from Firestore on initialization (works even when logged out)
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const loadedEvents = await getEvents();
        setEvents(loadedEvents);
      } catch (error) {
        console.error('Error loading events:', error);
        // Keep empty array if loading fails
        setEvents([]);
      }
    };

    loadEvents();

    // Set up real-time listener for events
    const unsubscribeEvents = subscribeToEvents((updatedEvents) => {
      setEvents(updatedEvents);
    });

    return () => {
      unsubscribeEvents();
    };
  }, []);

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
    try {
      // Add to Firestore - real-time listener will update state automatically
      await addEventToFirestore(event);
    } catch (error: any) {
      console.error('Error adding event:', error);
      throw new Error(error.message || 'Failed to add event');
    }
  };

  const updateEvent = async (updatedEvent: Event) => {
    try {
      // Update in Firestore - real-time listener will update state automatically
      await updateEventInFirestore(updatedEvent);
    } catch (error: any) {
      console.error('Error updating event:', error);
      throw new Error(error.message || 'Failed to update event');
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      // Delete from Firestore - real-time listener will update state automatically
      await deleteEventFromFirestore(eventId);
    } catch (error: any) {
      console.error('Error deleting event:', error);
      throw new Error(error.message || 'Failed to delete event');
    }
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