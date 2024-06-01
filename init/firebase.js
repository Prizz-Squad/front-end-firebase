// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaST_JAJqksSa62WPzMnLve_4gVx_4vBc",
  authDomain: "junxtion-x-management.firebaseapp.com",
  projectId: "junxtion-x-management",
  storageBucket: "junxtion-x-management.appspot.com",
  messagingSenderId: "231467926860",
  appId: "1:231467926860:web:8f52650c07dbcb5adf3be9",
  measurementId: "G-EJ6M7YNTCM",
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
// export const analytics = getAnalytics(app)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
