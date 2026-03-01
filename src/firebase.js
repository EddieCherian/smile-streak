// Firebase core
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Firebase auth (this is what you were missing)
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your config
const firebaseConfig = {
  apiKey: "AIzaSyCaKMTrcVwnl7xQhVUGC8GM9a4TOrgWJGs",
  authDomain: "smilestreak-91302.firebaseapp.com",
  projectId: "smilestreak-91302",
  storageBucket: "smilestreak-91302.firebasestorage.app",
  messagingSenderId: "698479190257",
  appId: "1:698479190257:web:f34315d38f3f9c5c0b8950",
  measurementId: "G-03FTR93G2G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics (optional but fine to keep)
export const analytics = getAnalytics(app);

// AUTH SETUP (this is what your App.jsx needs)
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
