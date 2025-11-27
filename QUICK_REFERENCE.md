# MotoManiacs - Quick Reference Guide

## TypeScript Interfaces

### CMS & Marketing

```typescript
export interface CMSPage {
  id: string;
  slug: string;
  title: string;
  metaDescription?: string;
  sections: PageSection[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PageSection {
  sectionId: string;
  sectionType: 'ecosystem' | 'visionMission' | 'institutionEngagement' | 'trackAndCars' | 'hero' | 'custom';
  title?: string;
  content?: string;
  imageUrl?: string;
  order: number;
}

export interface EcosystemSegment {
  id: string;
  iconName: string;
  title: string;
  shortDescription: string;
  order: number;
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
  bullets: string[];
  accentColor: string;
  order: number;
}
```

### Campus & Talent

```typescript
export type SubmissionStatus = 'Pending' | 'Reviewing' | 'Approved' | 'Rejected' | 'Contacted';

export interface CampusRegistration {
  id: string;
  collegeName: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  preferredDates: string[];
  message?: string;
  status: SubmissionStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
}

export interface TalentSubmission {
  id: string;
  studentName: string;
  collegeName: string;
  contactEmail: string;
  contactPhone: string;
  profileLink?: string;
  resumeUrl: string;
  demoVideoUrl?: string;
  skillCategories: string[];
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
  assignedTo?: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'InProgress' | 'Completed';
  createdAt: string;
  completedAt?: string;
  notes?: string;
}
```

### Products & Store

```typescript
export interface Product {
  id: string;
  title: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  inventory: number;
  images: string[];
  description: string;
  shortDescription?: string;
  categories: string[];
  brand?: string;
  featured: boolean;
  specifications?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
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
```

### Quick Book

```typescript
export interface AvailabilitySlot {
  id: string;
  eventId?: string;
  date: string;
  timeSlot: string;
  capacity: number;
  booked: number;
  available: number;
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
```

---

## Firestore Collections

| Collection | Public Read | User Write | Admin Write |
|------------|-------------|------------|-------------|
| `pages` | ✅ | ❌ | ✅ |
| `ecosystemSegments` | ✅ | ❌ | ✅ |
| `visionMission` | ✅ | ❌ | ✅ |
| `institutionCards` | ✅ | ❌ | ✅ |
| `campusRegistrations` | ❌ (admin only) | ✅ (create) | ✅ (full) |
| `talentSubmissions` | ❌ (admin only) | ✅ (create) | ✅ (full) |
| `reviewTasks` | ❌ | ❌ | ✅ |
| `products` | ✅ | ❌ | ✅ |
| `orders` | 👤 (own only) | ✅ (create) | ✅ (full) |
| `availabilitySlots` | ✅ | ❌ | ✅ |
| `quickBookings` | 👤 (own only) | ✅ (create) | ✅ (full) |

---

## Service Functions

### CMS Service

```typescript
// Pages
getAllPages(): Promise<CMSPage[]>
getPageBySlug(slug: string): Promise<CMSPage | null>
createPage(page: Omit<CMSPage, 'id'>): Promise<CMSPage>
updatePage(page: CMSPage): Promise<void>
deletePage(pageId: string): Promise<void>

// Ecosystem Segments
getEcosystemSegments(): Promise<EcosystemSegment[]>
createEcosystemSegment(segment: Omit<EcosystemSegment, 'id'>): Promise<EcosystemSegment>
updateEcosystemSegment(segment: EcosystemSegment): Promise<void>
deleteEcosystemSegment(segmentId: string): Promise<void>

// Vision & Mission
getVisionMission(): Promise<VisionMission | null>
updateVisionMission(vm: Omit<VisionMission, 'id' | 'updatedAt'>): Promise<void>

// Institution Cards
getInstitutionCards(): Promise<InstitutionCard[]>
createInstitutionCard(card: Omit<InstitutionCard, 'id'>): Promise<InstitutionCard>
updateInstitutionCard(card: InstitutionCard): Promise<void>
deleteInstitutionCard(cardId: string): Promise<void>
```

### Campus Service

```typescript
// Campus Registrations
createCampusRegistration(reg: Omit<CampusRegistration, 'id' | 'submittedAt' | 'status'>): Promise<CampusRegistration>
getAllCampusRegistrations(): Promise<CampusRegistration[]>
getCampusRegistrationById(id: string): Promise<CampusRegistration | null>
updateCampusRegistrationStatus(id: string, status: SubmissionStatus, notes?: string, reviewedBy?: string): Promise<void>

// Talent Submissions
createTalentSubmission(sub: Omit<TalentSubmission, 'id' | 'submittedAt' | 'status'>, resumeFile: File, videoFile?: File): Promise<TalentSubmission>
getAllTalentSubmissions(): Promise<TalentSubmission[]>
getTalentSubmissionById(id: string): Promise<TalentSubmission | null>
updateTalentSubmissionStatus(id: string, status: SubmissionStatus, notes?: string, reviewedBy?: string): Promise<void>

// Review Tasks
createReviewTask(task: Omit<ReviewTask, 'id' | 'createdAt' | 'status'>): Promise<ReviewTask>
getAllReviewTasks(): Promise<ReviewTask[]>
updateReviewTaskStatus(id: string, status: 'Open' | 'InProgress' | 'Completed', notes?: string): Promise<void>

// File Upload
uploadFile(file: File, path: string): Promise<string>
```

### Products Service

```typescript
// Products
getAllProducts(): Promise<Product[]>
getProductById(id: string): Promise<Product | null>
getProductsByCategory(category: string): Promise<Product[]>
getFeaturedProducts(limit?: number): Promise<Product[]>
searchProducts(searchTerm: string): Promise<Product[]>
createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>
updateProduct(product: Product): Promise<void>
deleteProduct(productId: string): Promise<void>
updateProductInventory(productId: string, quantityChange: number): Promise<void>

// Orders
createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order>
getUserOrders(userId: string): Promise<Order[]>
getAllOrders(): Promise<Order[]>
getOrderById(orderId: string): Promise<Order | null>
updateOrderStatus(orderId: string, status: Order['status']): Promise<void>
```

### Availability Service

```typescript
// Availability Slots
getAllAvailabilitySlots(): Promise<AvailabilitySlot[]>
getAvailabilitySlotsByDateRange(startDate: string, endDate: string): Promise<AvailabilitySlot[]>
getAvailabilitySlotById(id: string): Promise<AvailabilitySlot | null>
getAvailableSlots(): Promise<AvailabilitySlot[]>
getSlotsByEventId(eventId: string): Promise<AvailabilitySlot[]>
createAvailabilitySlot(slot: Omit<AvailabilitySlot, 'id' | 'available'>): Promise<AvailabilitySlot>
updateAvailabilitySlot(slot: AvailabilitySlot): Promise<void>

// Quick Bookings
createQuickBooking(booking: Omit<QuickBooking, 'id' | 'bookingDate' | 'status'>): Promise<QuickBooking>
getUserQuickBookings(userId: string): Promise<QuickBooking[]>
getAllQuickBookings(): Promise<QuickBooking[]>
cancelQuickBooking(bookingId: string): Promise<void>
```

---

## Cloud Functions

### Function: onTalentSubmissionCreate

**Trigger:** New document in `talentSubmissions` collection

**Actions:**
1. Creates a `reviewTask` document
2. Sends notification to admins (logged in emulator)
3. Updates submission with notification status

**Usage in Emulator:**
```bash
firebase emulators:start --only functions,firestore
```

### Function: onCampusRegistrationCreate

**Trigger:** New document in `campusRegistrations` collection

**Actions:**
1. Creates a `reviewTask` document (high priority)
2. Sends notification to admins
3. Updates registration with notification status

---

## Quick Commands

### Development
```bash
# Start dev server
npm run dev

# Start emulators
firebase emulators:start

# Seed CMS data
npx ts-node scripts/seedCMSData.ts

# Build for production
npm run build
```

### Cloud Functions
```bash
cd functions

# Install dependencies
npm install

# Build functions
npm run build

# Test locally
npm run serve

# Deploy to production
npm run deploy
```

### Firebase CLI
```bash
# Deploy rules only
firebase deploy --only firestore:rules
firebase deploy --only storage:rules

# Deploy functions only
firebase deploy --only functions

# Deploy everything
firebase deploy
```

### Testing
```bash
# Run tests
npm test

# Run tests with emulator
firebase emulators:exec --only firestore "npm test"

# Watch mode
npm test -- --watch
```

---

## Environment Variables

### Frontend (.env)
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### Cloud Functions
```bash
firebase functions:config:set admin.email="admin@motomaniacs.com"
```

---

## Routes to Add

Update `App.tsx`:

```typescript
// Marketing & Content
<Route path="/ecosystem" element={<EcosystemPage />} />

// Campus & Talent
<Route path="/campus" element={<CampusPage />} />
<Route path="/talent-hunt/submit" element={<TalentHuntPage />} />

// Superstore
<Route path="/store" element={<StorePage />} />
<Route path="/store/:id" element={<ProductDetailPage />} />
<Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
```

---

## Common Patterns

### Loading CMS Content
```typescript
import { getPageBySlug } from '../services/cmsService';

const [page, setPage] = useState<CMSPage | null>(null);

useEffect(() => {
  const loadPage = async () => {
    const data = await getPageBySlug('ecosystem');
    setPage(data);
  };
  loadPage();
}, []);
```

### Admin-Only Component
```typescript
import { useAppContext } from '../hooks/useAppContext';

const MyAdminComponent = () => {
  const { currentUser } = useAppContext();
  
  if (currentUser?.role !== 'admin') {
    return <div>Access denied</div>;
  }
  
  return <div>Admin content</div>;
};
```

### File Upload
```typescript
import { uploadFile } from '../services/campusService';

const handleFileUpload = async (file: File) => {
  const url = await uploadFile(file, `uploads/${Date.now()}_${file.name}`);
  console.log('Uploaded:', url);
};
```

---

## Troubleshooting

### Emulator not starting
```bash
# Kill processes on ports
npx kill-port 9099 5001 8080 9199 4000

# Restart emulators
firebase emulators:start
```

### Cloud Function not triggering
- Check function is deployed/running in emulator
- Verify collection name matches exactly
- Check Emulator UI logs at http://localhost:4000

### Storage CORS errors
```bash
# Set CORS policy
gsutil cors set cors.json gs://your-bucket-name
```

### Permission denied errors
- Check Firestore rules match collection names
- Verify user has correct role
- Test with admin user first

---

## Production Deployment Checklist

- [ ] Environment variables configured
- [ ] Images uploaded to Storage
- [ ] Seed data populated
- [ ] Firestore rules deployed
- [ ] Storage rules deployed
- [ ] Cloud Functions deployed
- [ ] Frontend built and deployed
- [ ] Admin user created and promoted
- [ ] Test all user flows
- [ ] Monitor error logs
