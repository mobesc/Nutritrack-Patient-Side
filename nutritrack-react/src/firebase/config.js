// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDPR7r8yjAZnlDVfv6tHkIKXv7m07NKEOA",
  authDomain: "btyeme-929ff.firebaseapp.com",
  projectId: "btyeme-929ff",
  storageBucket: "btyeme-929ff.firebasestorage.app",
  messagingSenderId: "99600800864",
  appId: "1:99600800864:web:2d95baaaf45aac7ebf7705",
  measurementId: "G-K63CLVT0K4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

export { db, auth };
export default app;