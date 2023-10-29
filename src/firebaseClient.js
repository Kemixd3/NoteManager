// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZtyIkaKmxEVtwyGd9KA6S9NkRUN8Onek",
  authDomain: "handlen-cb155.firebaseapp.com",
  projectId: "handlen-cb155",
  storageBucket: "handlen-cb155.appspot.com",
  messagingSenderId: "526465730791",
  appId: "1:526465730791:web:d0fd3a5abd81a8c6237a42",
  measurementId: "G-7RGR0EBCZH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
