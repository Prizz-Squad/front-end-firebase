// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtu_iz5ihGOGcOqq4sXXaI-xk_pWzEC5I",
  authDomain: "junction-x-bc92c.firebaseapp.com",
  projectId: "junction-x-bc92c",
  storageBucket: "junction-x-bc92c.appspot.com",
  messagingSenderId: "931469110488",
  appId: "1:931469110488:web:5ed145ec537039fd6c7bad",
  measurementId: "G-6DXWETW47S",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
