# Setup Guide for Studio Application

## 🔧 Fixing Firebase Permissions Error

### 1. Deploy Firebase Security Rules

You need to deploy the security rules to fix the permissions error:

```bash
# Install Firebase CLI if you haven't already
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not already done)
firebase init firestore

# Deploy the security rules
firebase deploy --only firestore:rules
```

### 2. Alternative: Update Rules in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `studio-3416878682-1164f`
3. Go to **Firestore Database** → **Rules**
4. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write their own theme history
    match /themeHistory/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Allow users to read and write their own user profiles
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow users to read and write their own prompt history
    match /promptHistory/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

5. Click **Publish**

## 🤖 Fixing Gemini API Key Error

### 1. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy the generated API key

### 2. Set Environment Variable

Create a `.env.local` file in your project root:

```bash
# Create the environment file
touch .env.local
```

Add your API key to `.env.local`:

```
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Restart the Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

## 🚀 Quick Fix Commands

Run these commands to fix both issues:

```bash
# 1. Deploy Firebase rules
firebase deploy --only firestore:rules

# 2. Create environment file (replace with your actual API key)
echo "NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here" > .env.local

# 3. Restart the server
npm run dev
```

## ✅ Verification

After setup, you should see:
- ✅ No Firebase permissions errors
- ✅ AI suggestions working in the Gemini Assistant
- ✅ Theme history being saved to Firebase
- ✅ Dashboard showing real data

## 🔒 Security Notes

- The Firebase configuration is public and safe to expose
- The Gemini API key should be kept secure
- Firebase security rules ensure users can only access their own data
- Never commit `.env.local` to version control

## 🆘 Troubleshooting

If you still see errors:

1. **Firebase Error**: Make sure you're logged in to Firebase CLI and have deployed the rules
2. **Gemini Error**: Verify your API key is correct and has proper permissions
3. **Port Error**: The app runs on port 9002, make sure it's not blocked

The application will work without AI features if you skip the Gemini setup, but the theme tracking and dashboard will still function with Firebase.
