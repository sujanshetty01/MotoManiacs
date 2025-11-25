# MotoManiacs Feature Expansion - Progress Checklist

## ✅ Phase 1: Foundation (COMPLETED)

- [x] TypeScript interfaces added to `types.ts`
- [x] CMS service created (`services/cmsService.ts`)
- [x] Campus/Talent service created (`services/campusService.ts`)
- [x] Products service created (`services/productsService.ts`)
- [x] Availability service created (`services/availabilityService.ts`)
- [x] Firestore security rules (`firestore.rules`)
- [x] Cloud Functions setup (`functions/`)
- [x] Seed script created (`scripts/seedCMSData.ts`)
- [x] Image upload guide (`scripts/uploadImages.md`)
- [x] Documentation created

## 🔧 Phase 2: Setup & Configuration

- [ ] Install Cloud Functions dependencies
  ```bash
  cd functions
  npm install
  cd ..
  ```

- [ ] Install test dependencies
  ```bash
  npm install -D vitest @testing-library/react @testing-library/jest-dom ts-node
  ```

- [ ] Update `firebase.json` with emulator config

- [ ] Enable Firebase Storage in console

- [ ] Upload 4 images to Firebase Storage
  - [ ] Ecosystem diagram (`ecosystem-diagram.png`)
  - [ ] Vision/Mission hero (`vision-mission-hero.png`)
  - [ ] Institution campus (`institution-campus.png`)
  - [ ] Track and cars (`track-cars.png`)

- [ ] Update image URLs in `scripts/seedCMSData.ts`

- [ ] Run seed script
  ```bash
  npx ts-node scripts/seedCMSData.ts
  ```

- [ ] Deploy Firestore rules
  ```bash
  firebase deploy --only firestore:rules
  ```

- [ ] Deploy Storage rules (create storage.rules first)
  ```bash
  firebase deploy --only storage:rules
  ```

- [ ] Build and test Cloud Functions locally
  ```bash
  cd functions
  npm run build
  firebase emulators:start --only functions,firestore
  ```

## 🎨 Phase 3: Ecosystem Page Components

- [ ] Create `components/EcosystemRing.tsx`
  - [ ] Render 6 segments in a circle
  - [ ] Add icons for each segment
  - [ ] Accessible labels
  - [ ] Responsive design
  - [ ] Hover effects

- [ ] Create `components/VisionMission.tsx`
  - [ ] Left image column
  - [ ] Right two-column text layout
  - [ ] Vision section
  - [ ] Mission section
  - [ ] Responsive breakpoints

- [ ] Create `components/InstitutionEngagement.tsx`
  - [ ] Red card design for each card
  - [ ] Background campus image
  - [ ] Bullet points list
  - [ ] Gradient overlays
  - [ ] Responsive grid

- [ ] Create `components/TrackAndCars.tsx`
  - [ ] Event categories list
  - [ ] Image showcase
  - [ ] Call-to-action buttons
  - [ ] Responsive layout

- [ ] Create `pages/EcosystemPage.tsx`
  - [ ] Load page data from CMS
  - [ ] Load ecosystem segments
  - [ ] Load vision/mission
  - [ ] Load institution cards
  - [ ] Render sections in order
  - [ ] Loading states
  - [ ] Error handling

- [ ] Add route to `App.tsx`
  ```typescript
  <Route path="/ecosystem" element={<EcosystemPage />} />
  ```

- [ ] Test `/ecosystem` page in browser

## 🏫 Phase 4: Campus & Talent Pages

- [ ] Create `pages/CampusPage.tsx`
  - [ ] Form with all fields
  - [ ] Date picker for preferred dates
  - [ ] Form validation
  - [ ] Submit to `createCampusRegistration`
  - [ ] Success message
  - [ ] Error handling

- [ ] Create `pages/TalentHuntPage.tsx`
  - [ ] Form with all fields
  - [ ] File upload for resume
  - [ ] Optional video upload
  - [ ] Skills multi-select
  - [ ] Progress indicator
  - [ ] Submit to `createTalentSubmission`
  - [ ] Success confirmation

- [ ] Create `components/AdminReviewQueue.tsx`
  - [ ] Tabs for Campus / Talent
  - [ ] List submissions
  - [ ] Status badges
  - [ ] Action buttons (Approve/Reject/Contact)
  - [ ] Notes editor
  - [ ] Filter by status
  - [ ] Integrate with existing admin auth

- [ ] Add routes to `App.tsx`
  ```typescript
  <Route path="/campus" element={<CampusPage />} />
  <Route path="/talent-hunt/submit" element={<TalentHuntPage />} />
  ```

- [ ] Add review queue to admin dashboard

- [ ] Test campus submission flow

- [ ] Test talent submission flow

- [ ] Verify Cloud Function triggers

- [ ] Check review tasks are created

## 🛒 Phase 5: Superstore

- [ ] Create `context/CartContext.tsx`
  - [ ] Cart state management
  - [ ] Add to cart function
  - [ ] Update quantity function
  - [ ] Remove from cart function
  - [ ] Calculate totals (subtotal, tax, total)
  - [ ] Persist to localStorage
  - [ ] Clear cart function

- [ ] Wrap app with CartProvider in `index.tsx`

- [ ] Create `components/Cart.tsx`
  - [ ] Cart dropdown/drawer
  - [ ] Cart items list
  - [ ] Quantity controls
  - [ ] Remove buttons
  - [ ] Total summary
  - [ ] Checkout button

- [ ] Create `pages/StorePage.tsx`
  - [ ] Product grid layout
  - [ ] Search bar
  - [ ] Category filter sidebar
  - [ ] Pagination
  - [ ] Product cards
  - [ ] Add to cart buttons
  - [ ] Loading states

- [ ] Create `pages/ProductDetailPage.tsx`
  - [ ] Image carousel
  - [ ] Product title and price
  - [ ] Description
  - [ ] Specifications table
  - [ ] Stock indicator
  - [ ] Add to cart with quantity
  - [ ] Related products section

- [ ] Create `pages/CheckoutPage.tsx`
  - [ ] Cart review section
  - [ ] Shipping address form
  - [ ] Order summary
  - [ ] Submit to `createOrder`
  - [ ] Order confirmation
  - [ ] PDF invoice option

- [ ] Create `components/admin/ProductManager.tsx`
  - [ ] Product list table
  - [ ] Add product form
  - [ ] Edit product modal
  - [ ] Delete confirmation
  - [ ] Image upload
  - [ ] Inventory management
  - [ ] Category management

- [ ] Add routes to `App.tsx`
  ```typescript
  <Route path="/store" element={<StorePage />} />
  <Route path="/store/:id" element={<ProductDetailPage />} />
  <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
  ```

- [ ] Add Products tab to admin dashboard

- [ ] Test product browsing

- [ ] Test add to cart

- [ ] Test checkout flow

- [ ] Verify order creation

## ⚡ Phase 6: Quick Book Widget

- [ ] Create `components/QuickBook.tsx`
  - [ ] Availability calendar
  - [ ] Time slot selection
  - [ ] Vehicle type selector
  - [ ] Participant count input
  - [ ] Price calculation
  - [ ] Book button
  - [ ] Call `createQuickBooking`
  - [ ] Success confirmation

- [ ] Modify `pages/EventDetailsPage.tsx`
  - [ ] Add QuickBook widget section
  - [ ] Pass eventId to widget
  - [ ] Load slots for event
  - [ ] Conditional rendering

- [ ] Test widget on event pages

- [ ] Verify bookings are created

- [ ] Check availability updates

## 🎛️ Phase 7: Admin CMS UI

- [ ] Modify `pages/AdminDashboardPage.tsx`
  - [ ] Add "Content Management" tab
  - [ ] Add "Products" tab (already done above)
  - [ ] Add "Review Queue" tab (already done above)

- [ ] Create `components/admin/CMSEditor.tsx`
  - [ ] Page editor
    - [ ] Create/edit/delete pages
    - [ ] Section builder
    - [ ] Publish toggle
  - [ ] Ecosystem segments editor
    - [ ] Add/edit/delete segments
    - [ ] Reorder segments
  - [ ] Vision/Mission editor
    - [ ] Text editors for vision/mission
    - [ ] Image uploader
  - [ ] Institution cards editor
    - [ ] Add/edit/delete cards
    - [ ] Bullet point editor
    - [ ] Color picker
    - [ ] Reorder cards

- [ ] Test CMS editing flows

- [ ] Verify changes appear on frontend

## 🧪 Phase 8: Testing

- [ ] Create `vitest.config.ts`

- [ ] Create `__tests__/components/EcosystemRing.test.tsx`
  - [ ] Renders correct number of segments
  - [ ] Shows segment titles
  - [ ] Icons display correctly
  - [ ] Accessible labels present
  - [ ] Click handlers work

- [ ] Create `__tests__/components/QuickBook.test.tsx`
  - [ ] Renders availability correctly
  - [ ] Date selection works
  - [ ] Calls booking service
  - [ ] Handles errors
  - [ ] Shows success state

- [ ] Create `__tests__/services/cmsService.test.ts`
  - [ ] getAllPages returns pages
  - [ ] getPageBySlug finds page
  - [ ] createPage works
  - [ ] Error handling

- [ ] Create `__tests__/integration/campusRegistration.test.ts`
  - [ ] Form submission creates doc
  - [ ] Cloud Function triggers
  - [ ] Review task created
  - [ ] Run with emulator

- [ ] Run all tests
  ```bash
  npm test
  ```

- [ ] Run tests with emulator
  ```bash
  firebase emulators:exec --only firestore "npm test"
  ```

- [ ] Fix any failing tests

## 🚀 Phase 9: Final Integration & Testing

- [ ] Test all new routes
  - [ ] `/ecosystem`
  - [ ] `/campus`
  - [ ] `/talent-hunt/submit`
  - [ ] `/store`
  - [ ] `/store/:id`
  - [ ] `/checkout`

- [ ] Test admin flows
  - [ ] CMS editing
  - [ ] Product management
  - [ ] Review queue

- [ ] Test user flows
  - [ ] Campus registration
  - [ ] Talent submission
  - [ ] Product browsing
  - [ ] Checkout
  - [ ] Quick booking

- [ ] Verify Cloud Functions
  - [ ] Talent notification
  - [ ] Campus notification
  - [ ] Review tasks created

- [ ] Check responsive design
  - [ ] Mobile
  - [ ] Tablet
  - [ ] Desktop

- [ ] Accessibility audit
  - [ ] Keyboard navigation
  - [ ] Screen reader compatibility
  - [ ] ARIA labels

- [ ] Performance check
  - [ ] Lazy load components
  - [ ] Image optimization
  - [ ] Code splitting

## 📦 Phase 10: Production Deployment

- [ ] Build production bundle
  ```bash
  npm run build
  ```

- [ ] Test production build locally
  ```bash
  npm run preview
  ```

- [ ] Deploy Firestore rules
  ```bash
  firebase deploy --only firestore:rules
  ```

- [ ] Deploy Storage rules
  ```bash
  firebase deploy --only storage:rules
  ```

- [ ] Deploy Cloud Functions
  ```bash
  firebase deploy --only functions
  ```

- [ ] Deploy frontend
  ```bash
  firebase deploy --only hosting
  ```

- [ ] Create admin user(s)

- [ ] Promote admin users in Firestore

- [ ] Verify all features in production

- [ ] Monitor error logs

- [ ] Set up error tracking (Sentry, etc.)

- [ ] Set up analytics

## 📚 Phase 11: Documentation

- [ ] Update README.md with new features

- [ ] Document CMS usage for admins

- [ ] Create admin user guide

- [ ] Document API endpoints

- [ ] Add inline code comments

- [ ] Create deployment runbook

- [ ] Document troubleshooting steps

## ✨ Bonus/Optional Features

- [ ] Email notifications for submissions (integrate SendGrid, Mailgun, etc.)

- [ ] PDF generation for orders

- [ ] Advanced search with Algolia

- [ ] Social sharing for products/events

- [ ] Wishlists

- [ ] Product reviews

- [ ] Loyalty/rewards program

- [ ] Multi-language support

- [ ] Dark mode persistence

- [ ] PWA features

---

## Progress Summary

**Total Tasks:** ~120  
**Completed:** ~15 (Phase 1)  
**Remaining:** ~105  

**Estimated Time:**
- Backend/Foundation: ✅ 11 hours (DONE)
- Setup & Config: 🔧 2 hours
- Frontend Development: 🎨 25 hours
- Testing: 🧪 7 hours
- Deployment & Docs: 📦 3 hours

**Total Remaining: ~37 hours**

---

## How to Use This Checklist

1. Mark items as complete: Change `- [ ]` to `- [x]`
2. Work through phases sequentially
3. Test after each phase
4. Commit to git after each completed section
5. Keep this file updated as you progress

---

Last Updated: ${new Date().toISOString()}
