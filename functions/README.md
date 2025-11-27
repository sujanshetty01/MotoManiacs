# Cloud Functions for MotoManiacs

This directory contains Firebase Cloud Functions for the MotoManiacs platform.

## Functions

### `onTalentSubmissionCreate`
Triggered when a new talent submission is created. Sends notification to admins and creates a review task.

## Setup

1. **Install dependencies:**
   ```bash
   cd functions
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   firebase functions:config:set admin.email="admin@motomaniacs.com"
   ```

3. **Run locally with emulator:**
   ```bash
   cd ..
   firebase emulators:start --only functions,firestore
   ```

4. **Deploy to production:**
   ```bash
   firebase deploy --only functions
   ```

## Local Development

The functions are designed to work with Firebase Emulators:

```bash
# Start all emulators
firebase emulators:start

# Or just functions and firestore
firebase emulators:start --only functions,firestore
```

## Testing

Run tests with:
```bash
cd functions
npm test
```

## Environment Variables

- `admin.email`: Email address to send admin notifications (optional, logs to console in emulator)
