import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Event, EventType } from '../types';

// Firestore collection name for events
const EVENTS_COLLECTION = 'events';

/**
 * Convert Firestore document to Event
 */
const firestoreToEvent = (doc: any): Event => {
  const data = doc.data();
  let dateString = '';
  
  // Handle date conversion - could be Timestamp, string, or Date
  if (data.date) {
    if (data.date.toDate) {
      // Firestore Timestamp
      dateString = data.date.toDate().toISOString();
    } else if (data.date instanceof Date) {
      // JavaScript Date
      dateString = data.date.toISOString();
    } else if (typeof data.date === 'string') {
      // ISO string
      dateString = data.date;
    }
  }
  
  return {
    id: doc.id,
    title: data.title || '',
    date: dateString,
    venue: data.venue || '',
    price: data.price || 0,
    description: data.description || '',
    duration: data.duration || '',
    images: data.images || [],
    type: data.type || EventType.All,
    featured: data.featured || false,
  };
};

/**
 * Convert Event to Firestore document data
 */
const eventToFirestore = (event: Omit<Event, 'id'> | Event): any => {
  // Convert ISO date string to Firestore Timestamp for proper querying
  let dateValue: any = event.date;
  if (typeof event.date === 'string' && event.date) {
    try {
      // Try to parse and convert to Timestamp
      const date = new Date(event.date);
      if (!isNaN(date.getTime())) {
        dateValue = Timestamp.fromDate(date);
      }
    } catch (error) {
      // If parsing fails, keep as string
      console.warn('Could not parse date:', event.date);
    }
  }
  
  return {
    title: event.title,
    date: dateValue,
    venue: event.venue,
    price: event.price,
    description: event.description,
    duration: event.duration,
    images: event.images,
    type: event.type,
    featured: event.featured,
    updatedAt: serverTimestamp(),
  };
};

/**
 * Get all events from Firestore
 */
export const getEvents = async (): Promise<Event[]> => {
  try {
    const eventsRef = collection(db, EVENTS_COLLECTION);
    const q = query(eventsRef, orderBy('date', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const events: Event[] = [];
    querySnapshot.forEach((doc) => {
      events.push(firestoreToEvent(doc));
    });
    
    return events;
  } catch (error) {
    console.error('Error getting events:', error);
    throw new Error('Failed to load events');
  }
};

/**
 * Get a single event by ID
 */
export const getEventById = async (eventId: string): Promise<Event | null> => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    const eventSnap = await getDoc(eventRef);
    
    if (eventSnap.exists()) {
      return firestoreToEvent(eventSnap);
    }
    
    return null;
  } catch (error) {
    console.error('Error getting event:', error);
    throw new Error('Failed to load event');
  }
};

/**
 * Add a new event to Firestore
 */
export const addEvent = async (event: Omit<Event, 'id'>): Promise<Event> => {
  try {
    const eventsRef = collection(db, EVENTS_COLLECTION);
    const eventData = eventToFirestore(event);
    eventData.createdAt = serverTimestamp();
    
    const docRef = await addDoc(eventsRef, eventData);
    
    return {
      ...event,
      id: docRef.id,
    };
  } catch (error) {
    console.error('Error adding event:', error);
    throw new Error('Failed to add event');
  }
};

/**
 * Update an existing event in Firestore
 */
export const updateEvent = async (event: Event): Promise<void> => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, event.id);
    const eventData = eventToFirestore(event);
    
    await updateDoc(eventRef, eventData);
  } catch (error) {
    console.error('Error updating event:', error);
    throw new Error('Failed to update event');
  }
};

/**
 * Delete an event from Firestore
 */
export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    await deleteDoc(eventRef);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw new Error('Failed to delete event');
  }
};

/**
 * Listen to real-time updates of events
 */
export const subscribeToEvents = (
  callback: (events: Event[]) => void
): (() => void) => {
  const eventsRef = collection(db, EVENTS_COLLECTION);
  const q = query(eventsRef, orderBy('date', 'asc'));
  
  return onSnapshot(
    q,
    (querySnapshot) => {
      const events: Event[] = [];
      querySnapshot.forEach((doc) => {
        events.push(firestoreToEvent(doc));
      });
      callback(events);
    },
    (error) => {
      console.error('Error listening to events:', error);
    }
  );
};

