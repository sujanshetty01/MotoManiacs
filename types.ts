export interface User {
  id: number;
  email: string;
  password: string; // In a real app, this would be a hash
  role: 'user' | 'admin';
}

export enum EventType {
  Car = 'Car',
  Bike = 'Bike',
  All = 'All',
}

export interface Event {
  id: number;
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
  id: number;
  eventId: number;
  userId: number;
  userName: string;
  userEmail: string;
  phone: string;
  tickets: number;
  totalPrice: number;
  bookingDate: string;
  status: 'Confirmed' | 'Cancelled';
}