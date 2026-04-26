// src/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-6MoGomSd56NZfCA9akhxJOBgSI9Smi4",
  authDomain: "ai-storyteller-9dc3a.firebaseapp.com",
  projectId: "ai-storyteller-9dc3a",
  storageBucket: "ai-storyteller-9dc3a.firebasestorage.app",
  messagingSenderId: "141430153134",
  appId: "1:141430153134:web:b71b6626da17c6d1b9723f",
  measurementId: "G-RC482Q52WC"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
