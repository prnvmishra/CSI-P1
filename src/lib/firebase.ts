import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAS_vynwdrLUcyGKwHDQ2X5d6_7B36D6XQ",
  authDomain: "studio-3416878682-1164f.firebaseapp.com",
  projectId: "studio-3416878682-1164f",
  storageBucket: "studio-3416878682-1164f.appspot.com", // Fixed the storage bucket URL
  messagingSenderId: "954287430091",
  appId: "1:954287430091:web:5284c3d1726c6fd56cfe4e"
};

// Initialize Firebase
let app;
let auth;
let db;
let storage;

// Only initialize on client side
try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  if (typeof window !== 'undefined') {
    console.log('Firebase initialized successfully');
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  if (typeof window !== 'undefined') {
    console.error('Firebase initialization failed. Please check your configuration.');
  }
}

// Export initialized services
export { app, auth, db, storage, getAuth };
