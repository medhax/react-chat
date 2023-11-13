// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaC40gFCcpxj8VDORQ2cyDZ7gp11ObBIw",
  authDomain: "plaved-gpt.firebaseapp.com",
  databaseURL: "https://plaved-gpt-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "plaved-gpt",
  storageBucket: "plaved-gpt.appspot.com",
  messagingSenderId: "25568148884",
  appId: "1:25568148884:web:7e86a91a98e4975f37a381"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getDatabase(app);
