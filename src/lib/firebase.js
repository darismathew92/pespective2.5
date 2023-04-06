// Import the functions you need from the SDKs you need
import { getApp,getApps,initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {getStorage} from "firebase/storage";

 // TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPIoWzy6XlIboalKZSB5E0ssuFwPijFdE",
  authDomain: "perspective2-2f35d.firebaseapp.com",
  projectId: "perspective2-2f35d",
  storageBucket: "perspective2-2f35d.appspot.com",
  messagingSenderId: "225571571679",
  appId: "1:225571571679:web:9a30bc7e5b664217f9a66a",
  measurementId: "G-GZMPJEJC4W"
};

// Initialize Firebase
const app =!getApps().length ? initializeApp(firebaseConfig) : getApp();
if (typeof window !== 'undefined') {
  const analytics = getAnalytics(app);
}
const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

export {
  app,
  db,
  auth,
  storage,
}
