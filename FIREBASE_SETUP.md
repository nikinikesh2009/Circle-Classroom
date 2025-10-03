# Firebase Setup Instructions

To use the authentication features in Circle Classroom, you need to set up Firebase and add the required environment variables.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Once created, click on the web icon (</>) to add a web app
4. Register your app with a nickname (e.g., "Circle Classroom")
5. Copy the Firebase configuration values

## Step 2: Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click "Get started"
3. Enable **Email/Password** sign-in method
4. Click "Save"

## Step 3: Set Up Firestore Database

1. In your Firebase project, go to **Firestore Database** in the left sidebar
2. Click "Create database"
3. Choose "Start in production mode" (we'll add security rules later)
4. Select a location close to your users
5. Click "Enable"

## Step 4: Set Up Storage (for classroom logos)

1. In your Firebase project, go to **Storage** in the left sidebar
2. Click "Get started"
3. Choose "Start in production mode"
4. Click "Done"

## Step 5: Add Environment Variables to Vercel

In your v0 project, you need to add the following environment variables:

1. Click the **Gear icon** (⚙️) in the top right of v0
2. Go to **Environment Variables**
3. Add these variables with your Firebase config values:

\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
\`\`\`

## Step 6: Security Rules (Optional but Recommended)

### Firestore Rules
Go to Firestore Database → Rules and add:

\`\`\`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /classrooms/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
\`\`\`

### Storage Rules
Go to Storage → Rules and add:

\`\`\`
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /classroom-logos/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
\`\`\`

## Testing

After setting up:
1. Go to `/register` to create a new classroom account
2. Fill in the form and submit
3. You should be redirected to `/dashboard`
4. Check Firebase Console → Authentication to see your new user
5. Check Firestore Database to see the classroom data

## Troubleshooting

- **"Firebase: Error (auth/configuration-not-found)"**: Make sure all environment variables are set correctly
- **"Missing or insufficient permissions"**: Check your Firestore security rules
- **Logo upload fails**: Check your Storage security rules and ensure the bucket is set up correctly
