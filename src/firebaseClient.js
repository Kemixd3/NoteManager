// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import dotenv from "dotenv";

// Configure dotenv to load environment variables from the default .env file
dotenv.config();

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_DB_APIKEY,
  authDomain: process.env.REACT_APP_DB_AUTHDOMAIN,
  projectId: process.env.REACT_APP_DB_PROJECTID,
  storageBucket: process.env.REACT_APP_DB_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_DB_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_DB_APPID,
  measurementId: process.env.REACT_APP_DB_MEASUREMENTID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
