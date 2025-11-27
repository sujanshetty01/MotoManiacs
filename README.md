
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

3. Set up Google Gemini API (for AI image generation):
   - Get your API key from [Google AI Studio](https://ai.google.dev/)
   - Add it to your `.env.local` file:
     ```env
     VITE_GEMINI_API_KEY=your-gemini-api-key
     ```
   - **Note**: For production, consider using a backend service (e.g., Firebase Cloud Functions) to keep your API key secure.

4. Run the app:
   ```bash
   npm run dev
   ```

## Run with Docker

**Prerequisites:** Docker and Docker Compose installed on your system

### Quick Start

1. **Create environment file:**
   Create a `.env` file in the root directory with your Firebase and Gemini API configuration:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   VITE_GEMINI_API_KEY=your-gemini-api-key
   ```

2. **Build and run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`

### Docker Commands

- **Start the container:**
  ```bash
  docker-compose up -d
  ```

- **Stop the container:**
  ```bash
  docker-compose down
  ```

- **View logs:**
  ```bash
  docker-compose logs -f
  ```

- **Rebuild the container (after code changes):**
  ```bash
  docker-compose up -d --build
  ```

- **Stop and remove containers, networks, and volumes:**
  ```bash
  docker-compose down -v
  ```

### Docker Architecture

The Docker setup uses a **multi-stage build**:
- **Stage 1 (Builder):** Uses Node.js to install dependencies and build the React application
- **Stage 2 (Production):** Uses Nginx to serve the built static files

### Environment Variables

All environment variables are passed as build arguments to the Docker container. Make sure your `.env` file contains all required variables before building.

**Note:** Since Vite embeds environment variables at build time, you need to rebuild the Docker image whenever you change environment variables:
```bash
docker-compose up -d --build
```

### Running on Other Devices

To run this application on another device:

1. **Copy the repository** to the target device (via git clone, USB, etc.)

2. **Install Docker and Docker Compose** on the target device:
   - **Windows:** Download [Docker Desktop](https://www.docker.com/products/docker-desktop)
   - **macOS:** Download [Docker Desktop](https://www.docker.com/products/docker-desktop)
   - **Linux:** Follow [Docker installation guide](https://docs.docker.com/engine/install/)

3. **Create the `.env` file** with your Firebase configuration (see above)

4. **Navigate to the project directory:**
   ```bash
   cd motomaniacs
   ```

5. **Build and run:**
   ```bash
   docker-compose up -d
   ```

6. **Access the application** at `http://localhost:3000` (or `http://<device-ip>:3000` from other devices on the same network)

### Troubleshooting

- **Port already in use:** If port 3000 is already in use, modify the port mapping in `docker-compose.yml`:
  ```yaml
  ports:
    - "8080:80"  # Change 3000 to any available port
  ```

- **Build fails:** Make sure all environment variables are set in your `.env` file

- **Container won't start:** Check logs with `docker-compose logs` to see error messages

- **Changes not reflecting:** Rebuild the container with `docker-compose up -d --build`

## Firebase Setup Instructions

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Enable Google Analytics (optional)

### 2. Enable Authentication
1. In your Firebase project, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
   - Click on "Email/Password"
   - Toggle "Enable" switch
   - Click "Save"
3. Enable **Google** provider (for Google Sign-In)
   - Click on "Google"
   - Toggle "Enable" switch
   - Enter your project support email (or use default)
   - Click "Save"
   - **Note**: You may need to configure OAuth consent screen in Google Cloud Console if prompted

### 3. Enable Firestore Database
1. Go to **Firestore Database** in your Firebase project
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location and click "Enable"

### 4. Assign Admin Roles to Users

By default, all new users are assigned the `"user"` role. To promote a user to admin, you have three options:

#### Method 1: Using Firebase Console (Easiest)

**Step 1: Get the User's UID**
1. Go to **Authentication** > **Users** in your Firebase Console
2. Find the user you want to make an admin
3. Click on the user to view their details
4. Copy their **User UID** (it looks like: `abc123def456ghi789...`)

**Step 2: Update User Document in Firestore**

**⚠️ Important**: If you see "Already used by another document in this collection", the document already exists! You need to **EDIT** it, not create a new one.

1. Go to **Firestore Database** in your Firebase Console
2. Click on the **`users`** collection (it should already exist after the user registered)
3. **Find the document with the User UID** you copied:
   - Look through the list of documents
   - The document ID should match the User UID exactly
   - **OR** use the search/filter if you have many documents
4. **Click on the document** to open it (don't click "Add document")
5. You'll see the existing fields. Now:
   - If `role` field doesn't exist: Click **"Add field"**
   - If `role` field exists: Click on the `role` field value to edit it
6. Set the field:
   - **Field name**: `role`
   - **Field type**: `string`
   - **Field value**: `admin` (change from `user` if it exists)
7. Click **"Update"** (or the checkmark/save button)

**Result**: The user will now have admin privileges when they log out and log back in!

**Troubleshooting:**
- ❌ **"Already used by another document"** → The document exists! Click on it to edit instead of creating new
- ✅ **Document doesn't exist** → Then you can create it with "Add document" using the UID as document ID

#### Method 2: Quick Edit (Recommended - Easiest)

Since documents are auto-created when users register, this is usually the fastest method:

1. Go to **Firestore Database** > **users** collection
2. **Find the document** - Look for the user's UID in the document list
   - You can search by scrolling or using the search if available
   - The document ID is the User UID
3. **Click on the document** to open it
4. **Edit the `role` field**:
   - If `role` exists: Click on its value and change it from `user` to `admin`
   - If `role` doesn't exist: Click **"Add field"**, name it `role`, type `string`, value `admin`
5. Click **"Update"** to save

**That's it!** The user will have admin access after they log out and log back in.

#### Method 3: Programmatically (For Developers)

You can use the `setUserRole` function from `services/authService.ts`:

```typescript
import { setUserRole } from './services/authService';

// Make a user an admin
await setUserRole('user-uid-here', 'admin');

// Or make them a regular user
await setUserRole('user-uid-here', 'user');
```

**Example: Create a simple admin promotion script**

Create a file `scripts/promoteToAdmin.ts`:
```typescript
import { setUserRole } from '../services/authService';

// Replace with actual user UID
const userId = 'your-user-uid-here';
setUserRole(userId, 'admin')
  .then(() => console.log('User promoted to admin!'))
  .catch((error) => console.error('Error:', error));
```

**How to find User UID:**
- **Firebase Console**: Authentication > Users > Click on user
- **In your app**: After login, check `currentUser.id` in the browser console
- **Programmatically**: After user signs in, use `auth.currentUser?.uid`

**Important Notes:**
- The `users` collection is automatically created when a user first registers
- Document ID must match the user's Firebase Auth UID exactly
- Users must log out and log back in for role changes to take effect
- Only authenticated users can access their own user document (see Security Rules)

### 5. Set Up Events Persistence

Events are now stored in Firestore and persist even after logging out. To populate initial events:

**Add Events Manually**
1. Go to **Firestore Database** > **events** collection
2. Click **"Add document"**
3. Add fields matching the Event structure:
   - `title` (string): Event name
   - `date` (string): ISO date string (e.g., "2024-08-15T20:00:00Z")
   - `venue` (string): Event location
   - `price` (number): Ticket price
   - `description` (string): Event description
   - `duration` (string): Event duration (e.g., "4 hours")
   - `images` (array): Array of image URLs
   - `type` (string): "Car", "Bike", or "All"
   - `featured` (boolean): Whether event is featured

**Note**: Events are publicly readable (no authentication required) so all users can see them. Only admins can add/edit/delete events.

### 5. Set Up Bookings Collection

Bookings are automatically created when users book events. The system will:
- Create a `bookings` collection in Firestore automatically
- Store all booking data (user info, event, tickets, price, etc.)
- Allow admins to view all bookings
- Allow users to view only their own bookings

**Important**: When you first query user bookings, Firestore may prompt you to create a composite index. If you see an error with a link, click it to create the required index automatically.

### 6. Set Up Google Gemini API (for AI Image Generation)

The application includes AI-powered image generation for events using Google's Imagen API. To enable this feature:

1. **Get a Gemini API Key:**
   - Go to [Google AI Studio](https://ai.google.dev/)
   - Sign in with your Google account
   - Click "Get API Key" and create a new API key
   - Copy your API key

2. **Add the API Key to Environment Variables:**
   - Add `VITE_GEMINI_API_KEY=your-api-key-here` to your `.env.local` file (for local development)
   - Add `VITE_GEMINI_API_KEY=your-api-key-here` to your `.env` file (for Docker)
   - Rebuild your Docker container if using Docker: `docker-compose up -d --build`

3. **Use Image Generation:**
   - In the Admin Dashboard, when adding or editing an event
   - Click "Generate with AI" button in the Event Images section
   - Configure image generation options (style, mood, aspect ratio, etc.)
   - Click "Generate Images" to create AI-generated images
   - Select and add generated images to your event

**Security Note:** 
- ⚠️ **Important**: Exposing API keys in frontend code is a security risk for production applications.
- For production, consider creating a backend service (e.g., Firebase Cloud Functions) to handle API calls and keep your API key secure.
- You can restrict your API key in Google Cloud Console to limit usage and prevent abuse.

**API Documentation:**
- See [Google Imagen API Documentation](https://ai.google.dev/gemini-api/docs/imagen) for more details on image generation capabilities and limitations.

### 7. Security Rules (Recommended)
Update your Firestore security rules to protect user data and allow public event reading:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Events collection - public read, admin write
    match /events/{eventId} {
      allow read: if true; // Anyone can read events
      allow write: if request.auth != null && isAdmin();
    }
    
    // Bookings collection - users can read their own, admins can read all
    match /bookings/{bookingId} {
      allow read: if request.auth != null && (
        resource.data.userId == request.auth.uid || isAdmin()
      );
      allow create: if request.auth != null && 
                      request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && (
        resource.data.userId == request.auth.uid || isAdmin()
      );
      allow delete: if request.auth != null && isAdmin();
    }
  }
}
```

## Features

- ✅ Email/Password Authentication
- ✅ **Google Authentication** (One-click sign-in)
- ✅ User Registration
- ✅ Role-based Access Control (Admin/User)
- ✅ Persistent Authentication State
- ✅ Protected Routes
- ✅ Automatic Role Assignment (defaults to 'user')
- ✅ **Events Persistence in Firestore** (survives logout)
- ✅ **Real-time Events Updates** (changes sync automatically)
- ✅ **Image URLs Stored in Firestore** (images persist with events)
- ✅ **Bookings Persistence in Firestore** (all bookings saved to database)
- ✅ **Admin Booking Management** (admins can view all user bookings)
- ✅ **Real-time Booking Updates** (bookings sync automatically)
- ✅ **AI Image Generation** (Generate event images using Google Imagen API)
