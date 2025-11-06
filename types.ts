export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export enum EventType {
  Car = 'Car',
  Bike = 'Bike',
  All = 'All',
}

export interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  price: number;
  description: string;
  duration: string;
  images: string[];
  type: EventType;
  featured: boolean;
}

export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  phone: string;
  tickets: number;
  totalPrice: number;
  bookingDate: string;
  status: 'Confirmed' | 'Cancelled';
}