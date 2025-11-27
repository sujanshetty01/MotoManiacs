# MotoManiacs Feature Expansion - Implementation Plan

## Overview
Add marketing pages, CMS, campus/talent workflows, superstore, and quick-book widget to existing platform.

## Prioritized Task List

### Phase 1: Foundation (Day 1-2)
**Priority: CRITICAL**

1. **TypeScript Interfaces & Types** ✅
   - Define all new Firestore collection types
   - Add to `types.ts`
   - File: `types.ts`

2. **Firestore Services Layer** ✅
   - `cmsService.ts` - CMS content CRUD
   - `campusService.ts` - Campus registrations & talent submissions
   - `productsService.ts` - Product catalog management
   - `availabilityService.ts` - Quick-book availability
   - Files: `services/*.ts`

3. **Firestore Security Rules** ✅
   - Admin-write-only for CMS, products
   - Public read/user write for campus/talent
   - File: `firestore.rules`

### Phase 2: Marketing & CMS (Day 2-3)
**Priority: HIGH**

4. **Ecosystem Page Components** ✅
   - `EcosystemRing.tsx` - Circular diagram component
   - `VisionMission.tsx` - Vision/mission section
   - `InstitutionEngagement.tsx` - Institution cards
   - `TrackAndCars.tsx` - Event categories display
   - Files: `components/*.tsx`

5. **Ecosystem Page** ✅
   - `/ecosystem` route and page
   - CMS-driven content population
   - File: `pages/EcosystemPage.tsx`

6. **Admin CMS UI** ✅
   - CMS management tab in admin dashboard
   - Forms for editing pages, segments, cards
   - File: `pages/AdminDashboardPage.tsx` (modify)

### Phase 3: Campus & Talent (Day 3-4)
**Priority: HIGH**

7. **Campus Registration Flow** ✅
   - `/campus` page with registration form
   - Firebase Storage integration for attachments
   - File: `pages/CampusPage.tsx`

8. **Talent Hunt Flow** ✅
   - `/talent-hunt/submit` submission form
   - Resume/video upload to Storage
   - File: `pages/TalentHuntPage.tsx`

9. **Admin Review Queue** ✅
   - Campus/Talent submissions list
   - Status management UI
   - File: `components/AdminReviewQueue.tsx`

10. **Cloud Function - Talent Notifications** ✅
    - `onTalentSubmissionCreate` trigger
    - Email notification (simulated)
    - Review task creation
    - File: `functions/src/index.ts`

### Phase 4: Superstore (Day 4-5)
**Priority: MEDIUM**

11. **Product Models & Service** ✅
    - Already in Phase 1
    
12. **Store Pages** ✅
    - `/store` - Product listing with filters
    - `/store/:id` - Product detail page
    - Files: `pages/StorePage.tsx`, `pages/ProductDetailPage.tsx`

13. **Shopping Cart** ✅
    - Client-side cart state (Context)
    - Checkout simulation flow
    - File: `context/CartContext.tsx`

14. **Admin Product Management** ✅
    - Product CRUD in admin dashboard
    - File: Modify `pages/AdminDashboardPage.tsx`

### Phase 5: Quick Book Widget (Day 5)
**Priority: MEDIUM**

15. **QuickBook Widget** ✅
    - Availability display component
    - Integration with existing bookingService
    - File: `components/QuickBook.tsx`

16. **Widget Integration** ✅
    - Add to event pages
    - Add to marketing pages
    - Files: Modify `pages/EventDetailsPage.tsx`

### Phase 6: Testing & Data (Day 6)
**Priority: HIGH**

17. **Seed Script** ✅
    - Populate CMS data
    - Sample products
    - Sample ecosystem segments
    - File: `scripts/seedCMSData.ts`

18. **Image Upload Instructions** ✅
    - Firebase Storage upload commands
    - Reference in CMS docs
    - File: `scripts/uploadImages.md`

19. **Unit Tests** ✅
    - `EcosystemRing.test.tsx`
    - `QuickBook.test.tsx`
    - `cmsService.test.ts`
    - Files: `__tests__/*.test.tsx`

20. **Integration Tests** ✅
    - Campus registration e2e
    - Talent submission e2e
    - File: `__tests__/integration/*.test.ts`

### Phase 7: Documentation (Day 7)
**Priority: MEDIUM**

21. **Developer Documentation** ✅
    - Setup instructions
    - Emulator usage
    - Testing guide
    - File: `docs/DEVELOPMENT.md`

22. **Firebase Emulator Setup** ✅
    - Configuration file
    - Startup instructions
    - File: `firebase.json`, `docs/EMULATOR.md`

## Success Metrics

- [ ] All 4 marketing images referenced in CMS
- [ ] `/ecosystem`, `/campus`, `/talent-hunt/submit`, `/store` accessible
- [ ] Admin can edit CMS content through UI
- [ ] Campus/Talent forms create Firestore docs
- [ ] Cloud Function triggers in emulator
- [ ] QuickBook widget renders on event pages
- [ ] All tests pass with emulator
- [ ] Seed script populates initial data

## Dependencies

### New NPM Packages
```json
{
  "firebase-admin": "^12.0.0",  // For Cloud Functions
  "firebase-functions": "^5.0.0", // For Cloud Functions
  "@testing-library/react": "^14.0.0", // For component tests
  "@testing-library/jest-dom": "^6.0.0", // For test utilities
  "vitest": "^1.0.0" // Test runner
}
```

### Firebase Setup
- Firestore Database ✅ (existing)
- Firebase Storage (new - for file uploads)
- Cloud Functions (new - for notifications)
- Firebase Emulators (dev/test)

## Risk Mitigation

1. **Storage Integration**: If Firebase Storage not enabled, provide fallback to URL inputs
2. **Cloud Functions**: All code emulator-compatible, can deploy later
3. **Image Paths**: Use local paths first, then migrate to Storage URLs
4. **Performance**: Lazy load components, paginate admin lists
5. **Security**: All rules default-deny, explicit admin-only writes

## Next Steps

1. Start with Phase 1 (Foundation) - TypeScript types and services
2. Move to Phase 2 (Marketing & CMS) - visible user impact
3. Implement Phase 3 (Campus & Talent) - new user flows
4. Add Phase 4 (Superstore) - revenue feature
5. Complete Phase 5 (Quick Book) - UX enhancement
6. Finish with Phase 6-7 (Testing & Docs) - production readiness
