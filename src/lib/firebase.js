// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// REPLACE THIS WITH YOUR ACTUAL CONFIG FROM FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyDk7BUQPeOFilXF4X5TA5M-1oGv7_OOLhE",
  authDomain: "skilldeck-b4d7c.firebaseapp.com",
  projectId: "skilldeck-b4d7c",
  storageBucket: "skilldeck-b4d7c.firebasestorage.app",
  messagingSenderId: "717090985065",
  appId: "1:717090985065:web:7196ff59cad5449fedfef8",
  measurementId: "G-HKM3EYSN9Y"
};

const app = initializeApp(firebaseConfig);

// Export the tools we need
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);