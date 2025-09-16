import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, Auth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, Firestore } from "firebase/firestore";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAS_vynwdrLUcyGKwHDQ2X5d6_7B36D6XQ",
  authDomain: "studio-3416878682-1164f.firebaseapp.com",
  projectId: "studio-3416878682-1164f",
  storageBucket: "studio-3416878682-1164f.firebasestorage.app",
  messagingSenderId: "954287430091",
  appId: "1:954287430091:web:5284c3d1726c6fd56cfe4e",
  measurementId: "G-XXXXXXXXXX"
};

// Enable offline persistence
export const enablePersistence = async () => {
  if (typeof window !== 'undefined') {
    try {
      const { enableIndexedDbPersistence } = await import('firebase/firestore');
      await enableIndexedDbPersistence(db!).catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
          console.warn('The current browser does not support all of the features required to enable persistence.');
        }
      });
    } catch (error) {
      console.error('Error enabling Firestore persistence:', error);
    }
  }
};

// Initialize Firebase with proper types
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analytics: Analytics | undefined;

// Initialize Firebase
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  
  // Initialize Firestore with settings
  db = getFirestore(app);
  
  // Enable offline persistence with error handling
  if (typeof window !== 'undefined') {
    import('firebase/firestore').then(({ enableIndexedDbPersistence }) => {
      enableIndexedDbPersistence(db, {
        forceOwnership: false
      }).catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('Persistence failed: Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
          console.warn('Persistence not supported: The current browser does not support all required features.');
        } else {
          console.error('Persistence error:', err);
        }
      });
    }).catch(error => {
      console.error('Error loading Firestore persistence module:', error);
    });
  }

  // Initialize Analytics if in production
  if (process.env.NODE_ENV === 'production') {
    isSupported().then(yes => yes && (analytics = getAnalytics(app)));
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error; // Re-throw to prevent silent failures
}

// Use emulators in development
if (process.env.NODE_ENV === 'development') {
  try {
    // Only connect to emulators if not already connected
    if (!(global as any).emulatorsStarted) {
      try {
        // Connect to Firestore emulator on port 8081
        connectFirestoreEmulator(db, 'localhost', 8081);
        // Connect to Auth emulator on port 9099
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        (global as any).emulatorsStarted = true;
        console.log('Connected to Firebase emulators');
      } catch (error) {
        console.error('Failed to connect to emulators:', error);
      }
    }
  } catch (error) {
    console.error('Emulator connection error:', error);
  }
}

// Initialize App Check in production
if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
    isTokenAutoRefreshEnabled: true
  });
}

export { app, auth, db, analytics };
