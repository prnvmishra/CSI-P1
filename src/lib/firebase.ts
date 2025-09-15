// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// IMPORTANT: This is a public configuration.
// For security, ensure you have strong Firebase Rules.
const firebaseConfig = {
  apiKey: "AIzaSyAS_vynwdrLUcyGKwHDQ2X5d6_7B36D6XQ",
  authDomain: "studio-3416878682-1164f.firebaseapp.com",
  projectId: "studio-3416878682-1164f",
  storageBucket: "studio-3416878682-1164f.firebasestorage.app",
  messagingSenderId: "954287430091",
  appId: "1:954287430091:web:5284c3d1726c6fd56cfe4e",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
