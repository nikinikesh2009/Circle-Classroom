// Firebase configuration and initialization
import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

console.log("[v0] Initializing Firebase...")

const firebaseConfig = {
  apiKey: "AIzaSyAEapCrpDGGMiuDcZEu70T3c2AeZfVear8",
  authDomain: "circle-classroom.firebaseapp.com",
  databaseURL: "https://circle-classroom-default-rtdb.firebaseio.com",
  projectId: "circle-classroom",
  storageBucket: "circle-classroom.firebasestorage.app",
  messagingSenderId: "704930090713",
  appId: "1:704930090713:web:47a0d25c5a42ed18b6f8c8",
}

// Initialize Firebase (singleton pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

console.log("[v0] Firebase initialized successfully")

export { app, auth, db, storage }
