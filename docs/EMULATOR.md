# Firebase Emulator Setup

This project uses Firebase Emulators for local development and testing.

## Prerequisites

-   Java (required for Firestore emulator)
-   Firebase CLI: `npm install -g firebase-tools`

## Configuration

The emulator configuration is in `firebase.json`.

## Running Emulators

1.  **Start Emulators**
    ```bash
    firebase emulators:start
    ```

2.  **Connect App to Emulators**
    The app is configured to connect to emulators if `window.location.hostname === 'localhost'`.
    See `firebaseConfig.ts`.

## Seeding Data

To populate the emulator with initial data:

```bash
# Ensure emulators are running
export FIRESTORE_EMULATOR_HOST="localhost:8080"
export FIREBASE_AUTH_EMULATOR_HOST="localhost:9099"

# Run seed script
npx ts-node scripts/seedCMSData.ts
```
