// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAB2ZzClhpz2DVX6250iavvYP1lWFgUoQY",
  authDomain: "klc-market.firebaseapp.com",
  projectId: "klc-market",
  storageBucket: "klc-market.firebasestorage.app",
  messagingSenderId: "404873955631",
  appId: "1:404873955631:web:1800ea0530045e4836b9da",
  measurementId: "G-J2CB033NKF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);
