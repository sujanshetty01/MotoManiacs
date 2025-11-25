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

export interface TicketType {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  price: number; // Base price, kept for backward compatibility
  ticketTypes?: TicketType[]; // New field for multiple ticket types
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
  ticketType?: string; // Name of the ticket type (e.g., "VIP")
  totalPrice: number;
  bookingDate: string;
  status: 'Confirmed' | 'Cancelled';
}

// ============================================
// CMS & Marketing Content Types
// ============================================

export interface PageSection {
  sectionId: string;
  sectionType: 'ecosystem' | 'visionMission' | 'institutionEngagement' | 'trackAndCars' | 'hero' | 'custom';
  title?: string;
  content?: string;
  imageUrl?: string;
  order: number;
}

export interface CMSPage {
  id: string;
  slug: string; // e.g., 'ecosystem', 'about'
  title: string;
  metaDescription?: string;
  sections: PageSection[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EcosystemSegment {
  id: string;
  iconName: string; // Name of icon (for icon library lookup)
  title: string;
  shortDescription: string;
  order: number; // 0-5 for 6 segments in circle
}

export interface VisionMission {
  id: string;
  visionText: string;
  missionText: string;
  heroImagePath: string;
  updatedAt: string;
}

export interface InstitutionCard {
  id: string;
  title: string;
  bullets: string[]; // Array of bullet points
  accentColor: string; // Hex color code
  order: number;
}

// ============================================
// Campus Activation & Talent Hunt Types
// ============================================

export type SubmissionStatus = 'Pending' | 'Reviewing' | 'Approved' | 'Rejected' | 'Contacted';

export interface CampusRegistration {
  id: string;
  collegeName: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  preferredDates: string[]; // Array of ISO date strings
  message?: string;
  status: SubmissionStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string; // Admin user ID
  adminNotes?: string;
}

export interface TalentSubmission {
  id: string;
  studentName: string;
  collegeName: string;
  contactEmail: string;
  contactPhone: string;
  profileLink?: string; // LinkedIn, portfolio, etc.
  resumeUrl: string; // Firebase Storage URL
  demoVideoUrl?: string; // Firebase Storage URL or YouTube link
  skillCategories: string[]; // e.g., ['Driver', 'Mechanic', 'Marketing']
  submittedAt: string;
  status: SubmissionStatus;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
}

export interface ReviewTask {
  id: string;
  submissionType: 'campus' | 'talent';
  submissionId: string;
  assignedTo?: string; // Admin user ID
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'InProgress' | 'Completed';
  createdAt: string;
  completedAt?: string;
  notes?: string;
}

// ============================================
// Motorsports Superstore Types
// ============================================

export interface Product {
  id: string;
  title: string;
  sku: string;
  price: number;
  compareAtPrice?: number; // Original price for discount display
  inventory: number;
  images: string[]; // Array of image URLs
  description: string;
  shortDescription?: string;
  categories: string[]; // e.g., ['Helmets', 'Safety Gear']
  brand?: string;
  featured: boolean;
  specifications?: Record<string, string>; // Key-value pairs
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: {
    productId: string;
    productTitle: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Arrive & Drive - Quick Book Types
// ============================================

export interface AvailabilitySlot {
  id: string;
  eventId?: string; // Optional - can be standalone track day
  date: string; // ISO date string
  timeSlot: string; // e.g., "10:00 AM - 12:00 PM"
  capacity: number;
  booked: number;
  available: number; // Calculated: capacity - booked
  price: number;
  vehicleType: 'Car' | 'Bike' | 'Both';
  trackLocation: string;
}

export interface QuickBooking {
  id: string;
  slotId: string;
  userId: string;
  userName: string;
  userEmail: string;
  phone: string;
  vehicleType: 'Car' | 'Bike';
  participants: number;
  totalPrice: number;
  bookingDate: string;
  status: 'Confirmed' | 'Cancelled';
}