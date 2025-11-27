import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Event, Booking, User } from '../types';
import { signIn, signUp, signInWithGoogle, signOutUser, onAuthStateChange } from '../services/authService';
import { getEvents, addEvent as addEventToFirestore, updateEvent as updateEventInFirestore, deleteEvent as deleteEventFromFirestore, subscribeToEvents } from '../services/eventsService';
import { addBooking as addBookingToFirestore, cancelBooking as cancelBookingInFirestore, subscribeToAllBookings, subscribeToUserBookings } from '../services/bookingsService';

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
  loginWithGoogle: () => Promise<User>;
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

  // Set up auth state listener and bookings subscription
  useEffect(() => {
    let unsubscribeBookings: (() => void) | null = null;

    const unsubscribe = onAuthStateChange(async (user) => {
      setCurrentUser(user);
      setIsLoading(false);
      
      // Unsubscribe from previous bookings listener
      if (unsubscribeBookings) {
        unsubscribeBookings();
        unsubscribeBookings = null;
      }
      
      // Set up bookings subscription based on user role
      if (user) {
        try {
          if (user.role === 'admin') {
            // Admin sees all bookings
            unsubscribeBookings = subscribeToAllBookings((bookings) => {
              setBookings(bookings);
            });
          } else {
            // Regular users see only their bookings
            unsubscribeBookings = subscribeToUserBookings(user.id, (bookings) => {
              setBookings(bookings);
            });
          }
        } catch (error: any) {
          console.error('Error setting up bookings subscription:', error);
          // If there's an index error, show helpful message
          if (error.code === 'failed-precondition') {
            console.warn('Firestore index required. Check console for index creation link.');
          }
          setBookings([]);
        }
      } else {
        setBookings([]);
      }
    });

    return () => {
      unsubscribe();
      if (unsubscribeBookings) {
        unsubscribeBookings();
      }
    };
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
    try {
      // Add to Firestore - real-time listener will update state automatically
      const bookingWithUserId = {
        ...booking,
        userId: currentUser.id,
      };
      console.log('AppContext: Adding booking with userId:', currentUser.id);
      const createdBooking = await addBookingToFirestore(bookingWithUserId);
      console.log('AppContext: Booking created successfully:', createdBooking.id);
      // Don't manually update state - let the real-time listener handle it
      return createdBooking;
    } catch (error: any) {
      console.error('AppContext: Error adding booking:', error);
      // Re-throw the error so the UI can handle it
      throw error;
    }
  };
  
  const cancelBooking = async (bookingId: string) => {
    try {
      // Update in Firestore - real-time listener will update state automatically
      await cancelBookingInFirestore(bookingId);
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      throw new Error(error.message || 'Failed to cancel booking');
    }
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

  const loginWithGoogle = async (): Promise<User> => {
    setIsLoading(true);
    try {
      const user = await signInWithGoogle();
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
      loginWithGoogle,
      logout 
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
