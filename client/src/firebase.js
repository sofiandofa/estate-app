// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "estate-mern-bd202.firebaseapp.com",
    projectId: "estate-mern-bd202",
    storageBucket: "estate-mern-bd202.appspot.com",
    messagingSenderId: "1030405759908",
    appId: "1:1030405759908:web:156a03f5ceee2db67f1731"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);