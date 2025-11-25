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
    Timestamp,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { AvailabilitySlot, QuickBooking } from '../types';

// Collection names
const AVAILABILITY_SLOTS_COLLECTION = 'availabilitySlots';
const QUICK_BOOKINGS_COLLECTION = 'quickBookings';

// ============================================
// Availability Slots
// ============================================

/**
 * Get all availability slots
 */
export const getAllAvailabilitySlots = async (): Promise<AvailabilitySlot[]> => {
    try {
        const slotsRef = collection(db, AVAILABILITY_SLOTS_COLLECTION);
        const q = query(slotsRef, orderBy('date', 'asc'));
        const querySnapshot = await getDocs(q);

        const slots: AvailabilitySlot[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            slots.push({
                id: doc.id,
                ...data,
                available: data.capacity - data.booked,
            } as AvailabilitySlot);
        });

        return slots;
    } catch (error) {
        console.error('Error getting availability slots:', error);
        throw new Error('Failed to load availability slots');
    }
};

/**
 * Get availability slots by date range
 */
export const getAvailabilitySlotsByDateRange = async (
    startDate: string,
    endDate: string
): Promise<AvailabilitySlot[]> => {
    try {
        const slotsRef = collection(db, AVAILABILITY_SLOTS_COLLECTION);
        const startTimestamp = Timestamp.fromDate(new Date(startDate));
        const endTimestamp = Timestamp.fromDate(new Date(endDate));

        const q = query(
            slotsRef,
            where('date', '>=', startDate),
            where('date', '<=', endDate),
            orderBy('date', 'asc')
        );
        const querySnapshot = await getDocs(q);

        const slots: AvailabilitySlot[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            slots.push({
                id: doc.id,
                ...data,
                available: data.capacity - data.booked,
            } as AvailabilitySlot);
        });

        return slots;
    } catch (error) {
        console.error('Error getting availability slots by date range:', error);
        throw new Error('Failed to load availability slots');
    }
};

/**
 * Get availability slot by ID
 */
export const getAvailabilitySlotById = async (
    id: string
): Promise<AvailabilitySlot | null> => {
    try {
        const slotRef = doc(db, AVAILABILITY_SLOTS_COLLECTION, id);
        const docSnap = await getDoc(slotRef);

        if (!docSnap.exists()) {
            return null;
        }

        const data = docSnap.data();
        return {
            id: docSnap.id,
            ...data,
            available: data.capacity - data.booked,
        } as AvailabilitySlot;
    } catch (error) {
        console.error('Error getting availability slot:', error);
        throw new Error('Failed to load availability slot');
    }
};

/**
 * Get available slots (capacity > booked)
 */
export const getAvailableSlots = async (): Promise<AvailabilitySlot[]> => {
    try {
        const allSlots = await getAllAvailabilitySlots();
        return allSlots.filter((slot) => slot.available > 0);
    } catch (error) {
        console.error('Error getting available slots:', error);
        throw new Error('Failed to load available slots');
    }
};

/**
 * Get slots by event ID
 */
export const getSlotsByEventId = async (eventId: string): Promise<AvailabilitySlot[]> => {
    try {
        const slotsRef = collection(db, AVAILABILITY_SLOTS_COLLECTION);
        const q = query(
            slotsRef,
            where('eventId', '==', eventId),
            orderBy('date', 'asc')
        );
        const querySnapshot = await getDocs(q);

        const slots: AvailabilitySlot[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            slots.push({
                id: doc.id,
                ...data,
                available: data.capacity - data.booked,
            } as AvailabilitySlot);
        });

        return slots;
    } catch (error) {
        console.error('Error getting slots by event ID:', error);
        throw new Error('Failed to load event slots');
    }
};

/**
 * Create a new availability slot (admin only)
 */
export const createAvailabilitySlot = async (
    slot: Omit<AvailabilitySlot, 'id' | 'available'>
): Promise<AvailabilitySlot> => {
    try {
        const slotsRef = collection(db, AVAILABILITY_SLOTS_COLLECTION);
        const docRef = await addDoc(slotsRef, {
            ...slot,
            booked: slot.booked || 0,
        });

        return {
            id: docRef.id,
            ...slot,
            available: slot.capacity - (slot.booked || 0),
        };
    } catch (error) {
        console.error('Error creating availability slot:', error);
        throw new Error('Failed to create availability slot');
    }
};

/**
 * Update availability slot (admin only)
 */
export const updateAvailabilitySlot = async (
    slot: AvailabilitySlot
): Promise<void> => {
    try {
        const slotRef = doc(db, AVAILABILITY_SLOTS_COLLECTION, slot.id);
        const { id, available, ...updateData } = slot;
        await updateDoc(slotRef, updateData);
    } catch (error) {
        console.error('Error updating availability slot:', error);
        throw new Error('Failed to update availability slot');
    }
};

// ============================================
// Quick Bookings
// ============================================

/**
 * Create a quick booking
 */
export const createQuickBooking = async (
    booking: Omit<QuickBooking, 'id' | 'bookingDate' | 'status'>
): Promise<QuickBooking> => {
    try {
        // First, check if slot has availability
        const slot = await getAvailabilitySlotById(booking.slotId);
        if (!slot) {
            throw new Error('Availability slot not found');
        }

        if (slot.available < booking.participants) {
            throw new Error('Not enough availability for this booking');
        }

        // Create booking
        const bookingsRef = collection(db, QUICK_BOOKINGS_COLLECTION);
        const docRef = await addDoc(bookingsRef, {
            ...booking,
            bookingDate: new Date().toISOString(),
            status: 'Confirmed',
        });

        // Update slot booked count
        const slotRef = doc(db, AVAILABILITY_SLOTS_COLLECTION, booking.slotId);
        await updateDoc(slotRef, {
            booked: slot.booked + booking.participants,
        });

        return {
            id: docRef.id,
            ...booking,
            bookingDate: new Date().toISOString(),
            status: 'Confirmed',
        };
    } catch (error) {
        console.error('Error creating quick booking:', error);
        throw error instanceof Error ? error : new Error('Failed to create quick booking');
    }
};

/**
 * Get user quick bookings
 */
export const getUserQuickBookings = async (userId: string): Promise<QuickBooking[]> => {
    try {
        const bookingsRef = collection(db, QUICK_BOOKINGS_COLLECTION);
        const q = query(
            bookingsRef,
            where('userId', '==', userId),
            orderBy('bookingDate', 'desc')
        );
        const querySnapshot = await getDocs(q);

        const bookings: QuickBooking[] = [];
        querySnapshot.forEach((doc) => {
            bookings.push({ id: doc.id, ...doc.data() } as QuickBooking);
        });

        return bookings;
    } catch (error) {
        console.error('Error getting user quick bookings:', error);
        throw new Error('Failed to load quick bookings');
    }
};

/**
 * Get all quick bookings (admin only)
 */
export const getAllQuickBookings = async (): Promise<QuickBooking[]> => {
    try {
        const bookingsRef = collection(db, QUICK_BOOKINGS_COLLECTION);
        const q = query(bookingsRef, orderBy('bookingDate', 'desc'));
        const querySnapshot = await getDocs(q);

        const bookings: QuickBooking[] = [];
        querySnapshot.forEach((doc) => {
            bookings.push({ id: doc.id, ...doc.data() } as QuickBooking);
        });

        return bookings;
    } catch (error) {
        console.error('Error getting all quick bookings:', error);
        throw new Error('Failed to load quick bookings');
    }
};

/**
 * Cancel a quick booking
 */
export const cancelQuickBooking = async (bookingId: string): Promise<void> => {
    try {
        // Get booking details
        const bookingRef = doc(db, QUICK_BOOKINGS_COLLECTION, bookingId);
        const bookingSnap = await getDoc(bookingRef);

        if (!bookingSnap.exists()) {
            throw new Error('Booking not found');
        }

        const booking = bookingSnap.data() as QuickBooking;

        // Update booking status
        await updateDoc(bookingRef, {
            status: 'Cancelled',
        });

        // Update slot availability
        const slotRef = doc(db, AVAILABILITY_SLOTS_COLLECTION, booking.slotId);
        const slotSnap = await getDoc(slotRef);

        if (slotSnap.exists()) {
            const slot = slotSnap.data();
            await updateDoc(slotRef, {
                booked: Math.max(0, slot.booked - booking.participants),
            });
        }
    } catch (error) {
        console.error('Error cancelling quick booking:', error);
        throw new Error('Failed to cancel quick booking');
    }
};
