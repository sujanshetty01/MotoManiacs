# Firebase Storage Image Upload Instructions

## Overview
Upload the 4 provided local images to Firebase Storage to use in your CMS content.

## Local Image Paths
You have these images available:
1. `/mnt/data/89b5bf1b-b587-4a8d-b507-edf0250b6691.png` - Ecosystem diagram
2. `/mnt/data/329cdbe7-539a-4c79-8a62-390c3ff2e5c7.png` - Vision/Mission hero
3. `/mnt/data/002d2c88-df00-4d01-869f-8dfef43b648a.png` - Institution campus
4. `/mnt/data/e4e957d2-0325-47c6-9cdf-451365a43f94.png` - Track and cars

## Setup Firebase Storage

### 1. Enable Firebase Storage

```bash
# Login to Firebase CLI
firebase login

# Initialize Storage (if not already done)
firebase init storage
```

### 2. Configure Storage Security Rules

Create/update `storage.rules`:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow anyone to read images
    match /images/{imageId} {
      allow read: if true;
      allow write: if request.auth != null && 
                     get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Campus/Talent uploads
    match /campus-registrations/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    match /talent-submissions/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Product images
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                     get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

Deploy rules:
```bash
firebase deploy --only storage
```

## Upload Images

### Method 1: Via Firebase Console (Easiest)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Storage** in the left sidebar
4. Click **Upload files**
5. Create a folder called `images`
6. Upload your 4 images with these names:
   - `ecosystem-diagram.png`
   - `vision-mission-hero.png`
   - `institution-campus.png`
   - `track-cars.png`
7. Click on each image and copy the **Download URL**

### Method 2: Using Firebase CLI

```bash
# Navigate to your images directory
cd /mnt/data

# Upload images using gsutil (requires Google Cloud SDK)
gsutil cp 89b5bf1b-b587-4a8d-b507-edf0250b6691.png gs://YOUR-BUCKET-NAME/images/ecosystem-diagram.png
gsutil cp 329cdbe7-539a-4c79-8a62-390c3ff2e5c7.png gs://YOUR-BUCKET-NAME/images/vision-mission-hero.png
gsutil cp 002d2c88-df00-4d01-869f-8dfef43b648a.png gs://YOUR-BUCKET-NAME/images/institution-campus.png
gsutil cp e4e957d2-0325-47c6-9cdf-451365a43f94.png gs://YOUR-BUCKET-NAME/images/track-cars.png

# Make them publicly readable
gsutil acl ch -u AllUsers:R gs://YOUR-BUCKET-NAME/images/*.png
```

Replace `YOUR-BUCKET-NAME` with your actual Firebase Storage bucket name (found in Firebase Console).

### Method 3: Programmatic Upload (Node.js)

Create a file `scripts/uploadImages.js`:

```javascript
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('../path-to-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'your-bucket-name.appspot.com'
});

const bucket = admin.storage().bucket();

async function uploadImage(localPath, remotePath) {
  await bucket.upload(localPath, {
    destination: remotePath,
    metadata: {
      contentType: 'image/png',
      cacheControl: 'public, max-age=31536000',
    },
  });
  
  // Make the file publicly accessible
  await bucket.file(remotePath).makePublic();
  
  // Get the public URL
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${remotePath}`;
  console.log(`Uploaded: ${remotePath}`);
  console.log(`URL: ${publicUrl}\n`);
  
  return publicUrl;
}

async function uploadAll() {
  const images = [
    {
      local: '/mnt/data/89b5bf1b-b587-4a8d-b507-edf0250b6691.png',
      remote: 'images/ecosystem-diagram.png'
    },
    {
      local: '/mnt/data/329cdbe7-539a-4c79-8a62-390c3ff2e5c7.png',
      remote: 'images/vision-mission-hero.png'
    },
    {
      local: '/mnt/data/002d2c88-df00-4d01-869f-8dfef43b648a.png',
      remote: 'images/institution-campus.png'
    },
    {
      local: '/mnt/data/e4e957d2-0325-47c6-9cdf-451365a43f94.png',
      remote: 'images/track-cars.png'
    },
  ];

  const urls = {};
  for (const image of images) {
    const url = await uploadImage(image.local, image.remote);
    urls[image.remote] = url;
  }
  
  console.log('All images uploaded!');
  console.log('URLs:', JSON.stringify(urls, null, 2));
}

uploadAll().catch(console.error);
```

Run:
```bash
node scripts/uploadImages.js
```

## Update CMS Data with Image URLs

After uploading, update the seed script `scripts/seedCMSData.ts`:

```typescript
const IMAGES = {
  ecosystemDiagram: 'https://storage.googleapis.com/YOUR-BUCKET/images/ecosystem-diagram.png',
  visionMissionHero: 'https://storage.googleapis.com/YOUR-BUCKET/images/vision-mission-hero.png',
  institutionCampus: 'https://storage.googleapis.com/YOUR-BUCKET/images/institution-campus.png',
  trackAndCars: 'https://storage.googleapis.com/YOUR-BUCKET/images/track-cars.png',
};
```

Or update directly in Firestore Console:
1. Go to **Firestore Database**
2. Find the document you want to update
3. Edit the `imageUrl` or `heroImagePath` field
4. Paste the Storage URL

## Get Your Bucket Name

Find your bucket name:
1. Firebase Console → Storage
2. Look at the URL: `gs://YOUR-BUCKET-NAME.appspot.com`
3. Or check `firebaseConfig.storageBucket` in your app config

## Troubleshooting

**Error: Storage not initialized**
- Run `firebase init storage` in your project directory

**403 Forbidden when accessing images**
- Check storage.rules are deployed
- Make sure files are public or user is authenticated

**Images not showing in app**
- Verify the URL is correct
- Check browser console for CORS errors
- Ensure storage.rules allow read access

**Large file sizes**
- Compress images before uploading (recommended < 500KB)
- Use tools like TinyPNG or ImageOptim

## Production Checklist

- [ ] All 4 images uploaded to Storage
- [ ] Images are publicly readable
- [ ] URLs updated in seedCMSData.ts
- [ ] Seed script run successfully
- [ ] Images displaying in /ecosystem page
- [ ] Storage rules deployed
- [ ] CORS configured if needed

## CORS Configuration (if needed)

Create `cors.json`:
```json
[
  {
    "origin": ["*"],
    "method": ["GET"],
    "maxAgeSeconds": 3600
  }
]
```

Apply CORS:
```bash
gsutil cors set cors.json gs://YOUR-BUCKET-NAME
```
