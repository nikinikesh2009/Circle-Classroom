import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"
import type { Student, AttendanceRecord } from "./types"

// ============ STUDENTS ============

export async function addStudent(teacherId: string, studentData: Omit<Student, "id">): Promise<string> {
  try {
    const studentsRef = collection(db, "classrooms", teacherId, "students")
    const docRef = await addDoc(studentsRef, {
      ...studentData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding student:", error)
    throw new Error("Failed to add student")
  }
}

export async function getStudents(teacherId: string): Promise<Student[]> {
  try {
    const studentsRef = collection(db, "classrooms", teacherId, "students")
    const q = query(studentsRef, orderBy("name"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Student[]
  } catch (error) {
    console.error("Error fetching students:", error)
    return []
  }
}

export async function updateStudent(teacherId: string, studentId: string, data: Partial<Student>): Promise<void> {
  try {
    const studentRef = doc(db, "classrooms", teacherId, "students", studentId)
    await updateDoc(studentRef, {
      ...data,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error updating student:", error)
    throw new Error("Failed to update student")
  }
}

export async function deleteStudent(teacherId: string, studentId: string): Promise<void> {
  try {
    const studentRef = doc(db, "classrooms", teacherId, "students", studentId)
    await deleteDoc(studentRef)
  } catch (error) {
    console.error("Error deleting student:", error)
    throw new Error("Failed to delete student")
  }
}

// ============ ATTENDANCE ============

export async function markAttendance(teacherId: string, attendanceData: Omit<AttendanceRecord, "id">): Promise<string> {
  try {
    const attendanceRef = collection(db, "classrooms", teacherId, "attendance")
    const docRef = await addDoc(attendanceRef, {
      ...attendanceData,
      createdAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error marking attendance:", error)
    throw new Error("Failed to mark attendance")
  }
}

export async function getAttendanceRecords(
  teacherId: string,
  startDate?: string,
  endDate?: string,
): Promise<AttendanceRecord[]> {
  try {
    const attendanceRef = collection(db, "classrooms", teacherId, "attendance")
    let q = query(attendanceRef, orderBy("date", "desc"))

    if (startDate && endDate) {
      q = query(attendanceRef, where("date", ">=", startDate), where("date", "<=", endDate), orderBy("date", "desc"))
    }

    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as AttendanceRecord[]
  } catch (error) {
    console.error("Error fetching attendance:", error)
    return []
  }
}

export async function getAttendanceStats(
  teacherId: string,
  date: string,
): Promise<{
  present: number
  absent: number
  late: number
}> {
  try {
    const attendanceRef = collection(db, "classrooms", teacherId, "attendance")
    const q = query(attendanceRef, where("date", "==", date))
    const querySnapshot = await getDocs(q)

    const stats = { present: 0, absent: 0, late: 0 }
    querySnapshot.docs.forEach((doc) => {
      const data = doc.data()
      if (data.status === "present") stats.present++
      else if (data.status === "absent") stats.absent++
      else if (data.status === "late") stats.late++
    })

    return stats
  } catch (error) {
    console.error("Error fetching attendance stats:", error)
    return { present: 0, absent: 0, late: 0 }
  }
}

// ============ DASHBOARD STATS ============

export async function getDashboardStats(teacherId: string): Promise<{
  totalStudents: number
  averageAttendance: number
  activeStudents: number
  recentActivity: number
}> {
  try {
    // Get total students
    const studentsRef = collection(db, "classrooms", teacherId, "students")
    const studentsSnapshot = await getDocs(studentsRef)
    const totalStudents = studentsSnapshot.size

    // Get active students (status === 'active')
    const activeQuery = query(studentsRef, where("status", "==", "active"))
    const activeSnapshot = await getDocs(activeQuery)
    const activeStudents = activeSnapshot.size

    // Calculate average attendance from all students
    let totalAttendance = 0
    studentsSnapshot.docs.forEach((doc) => {
      const data = doc.data()
      totalAttendance += data.attendance || 0
    })
    const averageAttendance = totalStudents > 0 ? Math.round(totalAttendance / totalStudents) : 0

    // Get recent activity (attendance records from last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const dateString = sevenDaysAgo.toISOString().split("T")[0]

    const attendanceRef = collection(db, "classrooms", teacherId, "attendance")
    const recentQuery = query(attendanceRef, where("date", ">=", dateString))
    const recentSnapshot = await getDocs(recentQuery)
    const recentActivity = recentSnapshot.size

    return {
      totalStudents,
      averageAttendance,
      activeStudents,
      recentActivity,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      totalStudents: 0,
      averageAttendance: 0,
      activeStudents: 0,
      recentActivity: 0,
    }
  }
}
