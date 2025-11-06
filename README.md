<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1PenTzQoOi9U6zCO5nu8Ptv0ZFYDP5B5g

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password provider)
   - Enable Firestore Database
   - Copy your Firebase configuration from Project Settings
   - Create a `.env.local` file in the root directory and add your Firebase config:
     ```env
     VITE_FIREBASE_API_KEY=your-api-key
     VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your-project-id
     VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
     VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
     ```
   - See `.env.example` for reference

3. Run the app:
   ```bash
   npm run dev
   ```

## Firebase Setup Instructions

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Enable Google Analytics (optional)

### 2. Enable Authentication
1. In your Firebase project, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. Click "Save"

### 3. Enable Firestore Database
1. Go to **Firestore Database** in your Firebase project
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location and click "Enable"

### 4. Set Up User Roles (Optional)
To manually assign admin roles:
1. Go to **Firestore Database
2. Create a collection called `users`
3. Add a document with the user's UID as the document ID
4. Add a field `role` with value `"admin"` or `"user"`

Alternatively, you can use the `setUserRole` function from `services/authService.ts` programmatically.

### 5. Security Rules (Recommended)
Update your Firestore security rules to protect user data:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Features

- ✅ Email/Password Authentication
- ✅ User Registration
- ✅ Role-based Access Control (Admin/User)
- ✅ Persistent Authentication State
- ✅ Protected Routes
- ✅ Automatic Role Assignment (defaults to 'user')
