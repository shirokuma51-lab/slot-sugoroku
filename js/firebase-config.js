// ============================================================
// firebase-config.js
// ------------------------------------------------------------
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBynp7DQihyLsh3W2IeNS5dLbfDgF2S_94",
  authDomain: "slot-sugoroku.firebaseapp.com",
  projectId: "slot-sugoroku",
  storageBucket: "slot-sugoroku.firebasestorage.app",
  messagingSenderId: "250192309861",
  appId: "1:250192309861:web:2516180263fbeeae0aa08c",
  measurementId: "G-40M2EHCTNM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// ============================================================

export const firebaseConfig = {
  apiKey: "AIzaSyBynp7DQihyLsh3W2IeNS5dLbfDgF2S_94",
  authDomain: "slot-sugoroku.firebaseapp.com",
  projectId: "slot-sugoroku",
  storageBucket: "slot-sugoroku.firebasestorage.app",
  messagingSenderId: "1:250192309861:web:2516180263fbeeae0aa08c",
  appId: "1:250192309861:web:2516180263fbeeae0aa08c",
};
