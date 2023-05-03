// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyBYmmQvYI_cr_5b86FIwUtoS3JojCQv-Uo",

  authDomain: "movielist-app-v2.firebaseapp.com",

  projectId: "movielist-app-v2",

  storageBucket: "movielist-app-v2.appspot.com",

  messagingSenderId: "725220212213",

  appId: "1:725220212213:web:217f05ce88aca54f6ab4bc"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const db = getFirestore()