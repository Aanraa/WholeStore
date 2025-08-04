// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCaIh-qyXdt210-1ngj2kslTcqukYMbUc",
  authDomain: "wholestore-e2218.firebaseapp.com",
  projectId: "wholestore-e2218",
  storageBucket: "wholestore-e2218.firebasestorage.app",
  messagingSenderId: "195294244728",
  appId: "1:195294244728:web:5059e958cd732f5738228d",
  measurementId: "G-LKRCRFE6TD",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, db, auth, analytics, provider };
