// Authentication helper functions
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, type User } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { auth, db, storage } from "./firebase"

export { auth, signOut }

export interface ClassroomData {
  classroomName: string
  email: string
  schoolName: string
  logoUrl?: string
  createdAt: Date
}

// Register a new classroom
export async function registerClassroom(
  email: string,
  password: string,
  classroomData: Omit<ClassroomData, "email" | "createdAt">,
  logoFile?: File,
): Promise<User> {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Upload logo if provided
    let logoUrl: string | undefined
    if (logoFile) {
      const logoRef = ref(storage, `classroom-logos/${user.uid}`)
      await uploadBytes(logoRef, logoFile)
      logoUrl = await getDownloadURL(logoRef)
    }

    // Store classroom data in Firestore
    await setDoc(doc(db, "classrooms", user.uid), {
      ...classroomData,
      email,
      logoUrl,
      createdAt: new Date(),
    })

    return user
  } catch (error: any) {
    throw new Error(error.message || "Registration failed")
  }
}

// Login classroom
export async function loginClassroom(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error: any) {
    throw new Error(error.message || "Login failed")
  }
}

// Logout
export async function logoutClassroom(): Promise<void> {
  try {
    await signOut(auth)
  } catch (error: any) {
    throw new Error(error.message || "Logout failed")
  }
}

// Get classroom data
export async function getClassroomData(userId: string): Promise<ClassroomData | null> {
  try {
    const docRef = doc(db, "classrooms", userId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data() as ClassroomData
    }
    return null
  } catch (error) {
    console.error("Error fetching classroom data:", error)
    return null
  }
}
