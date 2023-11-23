// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_DB_APIKEY,
  authDomain: import.meta.env.VITE_DB_AUTHDOMAIN,
  projectId: import.meta.env.VITE_DB_PROJECTID,
  storageBucket: import.meta.env.VITE_DB_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_DB_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_DB_APPID,
  measurementId: import.meta.env.VITE_DB_MEASUREMENTID,
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
