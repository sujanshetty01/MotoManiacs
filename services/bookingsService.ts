import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Booking } from '../types';

// Firestore collection name for bookings
const BOOKINGS_COLLECTION = 'bookings';

/**
 * Convert Firestore document to Booking
 */
const firestoreToBooking = (doc: any): Booking => {
  const data = doc.data();
  let bookingDateString = '';
  
  // Handle date conversion
  if (data.bookingDate) {
    if (data.bookingDate.toDate) {
      bookingDateString = data.bookingDate.toDate().toISOString();
    } else if (data.bookingDate instanceof Date) {
      bookingDateString = data.bookingDate.toISOString();
    } else if (typeof data.bookingDate === 'string') {
      bookingDateString = data.bookingDate;
    }
  }
  
  return {
    id: doc.id,
    eventId: data.eventId || '',
    userId: data.userId || '',
    userName: data.userName || '',
    userEmail: data.userEmail || '',
    phone: data.phone || '',
    tickets: data.tickets || 0,
    totalPrice: data.totalPrice || 0,
    bookingDate: bookingDateString,
    status: data.status || 'Confirmed',
  };
};

/**
 * Convert Booking to Firestore document data
 */
const bookingToFirestore = (booking: Omit<Booking, 'id'> | Booking): any => {
  // Convert ISO date string to Firestore Timestamp
  let bookingDateValue: any = booking.bookingDate;
  if (typeof booking.bookingDate === 'string' && booking.bookingDate) {
    try {
      const date = new Date(booking.bookingDate);
      if (!isNaN(date.getTime())) {
        bookingDateValue = Timestamp.fromDate(date);
      }
    } catch (error) {
      console.warn('Could not parse booking date:', booking.bookingDate);
    }
  }
  
  return {
    eventId: booking.eventId,
    userId: booking.userId,
    userName: booking.userName,
    userEmail: booking.userEmail,
    phone: booking.phone,
    tickets: booking.tickets,
    totalPrice: booking.totalPrice,
    bookingDate: bookingDateValue,
    status: booking.status,
    updatedAt: serverTimestamp(),
  };
};

/**
 * Get all bookings (admin only)
 */
export const getAllBookings = async (): Promise<Booking[]> => {
  try {
    const bookingsRef = collection(db, BOOKINGS_COLLECTION);
    const q = query(bookingsRef, orderBy('bookingDate', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const bookings: Booking[] = [];
    querySnapshot.forEach((doc) => {
      bookings.push(firestoreToBooking(doc));
    });
    
    return bookings;
  } catch (error) {
    console.error('Error getting bookings:', error);
    throw new Error('Failed to load bookings');
  }
};

/**
 * Get bookings for a specific user
 */
export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  try {
    const bookingsRef = collection(db, BOOKINGS_COLLECTION);
    const q = query(
      bookingsRef,
      where('userId', '==', userId),
      orderBy('bookingDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const bookings: Booking[] = [];
    querySnapshot.forEach((doc) => {
      bookings.push(firestoreToBooking(doc));
    });
    
    return bookings;
  } catch (error) {
    console.error('Error getting user bookings:', error);
    throw new Error('Failed to load bookings');
  }
};

/**
 * Get a single booking by ID
 */
export const getBookingById = async (bookingId: string): Promise<Booking | null> => {
  try {
    const bookingRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    const bookingSnap = await getDoc(bookingRef);
    
    if (bookingSnap.exists()) {
      return firestoreToBooking(bookingSnap);
    }
    
    return null;
  } catch (error) {
    console.error('Error getting booking:', error);
    throw new Error('Failed to load booking');
  }
};

/**
 * Add a new booking to Firestore
 */
export const addBooking = async (booking: Omit<Booking, 'id'>): Promise<Booking> => {
  try {
    const bookingsRef = collection(db, BOOKINGS_COLLECTION);
    const bookingData = bookingToFirestore(booking);
    bookingData.createdAt = serverTimestamp();
    
    console.log('Adding booking to Firestore:', bookingData);
    const docRef = await addDoc(bookingsRef, bookingData);
    console.log('Booking added successfully with ID:', docRef.id);
    
    return {
      ...booking,
      id: docRef.id,
    };
  } catch (error: any) {
    console.error('Error adding booking to Firestore:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Provide more specific error messages
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please check your Firestore security rules.');
    } else if (error.code === 'unavailable') {
      throw new Error('Firestore is unavailable. Please check your internet connection.');
    } else {
      throw new Error(`Failed to add booking: ${error.message || 'Unknown error'}`);
    }
  }
};

/**
 * Update an existing booking in Firestore
 */
export const updateBooking = async (booking: Booking): Promise<void> => {
  try {
    const bookingRef = doc(db, BOOKINGS_COLLECTION, booking.id);
    const bookingData = bookingToFirestore(booking);
    
    await updateDoc(bookingRef, bookingData);
  } catch (error) {
    console.error('Error updating booking:', error);
    throw new Error('Failed to update booking');
  }
};

/**
 * Cancel a booking (update status to Cancelled)
 */
export const cancelBooking = async (bookingId: string): Promise<void> => {
  try {
    const bookingRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    await updateDoc(bookingRef, {
      status: 'Cancelled',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw new Error('Failed to cancel booking');
  }
};

/**
 * Listen to real-time updates of all bookings (admin only)
 */
export const subscribeToAllBookings = (
  callback: (bookings: Booking[]) => void
): (() => void) => {
  const bookingsRef = collection(db, BOOKINGS_COLLECTION);
  const q = query(bookingsRef, orderBy('bookingDate', 'desc'));
  
  return onSnapshot(
    q,
    (querySnapshot) => {
      const bookings: Booking[] = [];
      querySnapshot.forEach((doc) => {
        bookings.push(firestoreToBooking(doc));
      });
      callback(bookings);
    },
    (error: any) => {
      console.error('Error listening to bookings:', error);
      // Call callback with empty array on error so UI doesn't show stale data
      callback([]);
    }
  );
};

/**
 * Listen to real-time updates of user bookings
 */
export const subscribeToUserBookings = (
  userId: string,
  callback: (bookings: Booking[]) => void
): (() => void) => {
  const bookingsRef = collection(db, BOOKINGS_COLLECTION);
  const q = query(
    bookingsRef,
    where('userId', '==', userId),
    orderBy('bookingDate', 'desc')
  );
  
  return onSnapshot(
    q,
    (querySnapshot) => {
      const bookings: Booking[] = [];
      querySnapshot.forEach((doc) => {
        bookings.push(firestoreToBooking(doc));
      });
      callback(bookings);
    },
    (error: any) => {
      console.error('Error listening to user bookings:', error);
      // If index is missing, Firestore provides a link in error.message
      if (error.code === 'failed-precondition') {
        console.error('Firestore index required. Error details:', error.message);
        if (error.message && error.message.includes('https://')) {
          console.error('Index creation link:', error.message.match(/https:\/\/[^\s]+/)?.[0]);
        }
      }
      // Call callback with empty array on error so UI doesn't show stale data
      callback([]);
    }
  );
};

