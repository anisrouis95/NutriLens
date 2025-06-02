// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Import Authentication
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAm8LfjQPj4fpoFkiakYBmxU1U_eOpv1HE",
  authDomain: "nutrilens-5b5ba.firebaseapp.com",
  projectId: "nutrilens-5b5ba",
  storageBucket: "nutrilens-5b5ba.firebasestorage.app",
  messagingSenderId: "182754163246",
  appId: "1:182754163246:web:39a8278c0bbecae58a7dbf",
  measurementId: "G-7BJ32ZZYVR"
};
//

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Export the app and service instances
export { app, auth, db };