// src/firebase/config.js
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRJf0LiSGxoyii835styrM9RL4y6XHPAU",
  authDomain: "medally-53135.firebaseapp.com",
  projectId: "medally-53135",
  storageBucket: "medally-53135.firebasestorage.app",
  messagingSenderId: "522527456075",
  appId: "1:522527456075:web:98dd30e3d7a1079efb86ce",
  measurementId: "G-D56PTC54TE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
