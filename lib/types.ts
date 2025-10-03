export interface Student {
  id: string
  name: string
  email: string
  grade: string
  attendance: number
  lastActive: string
  status: "active" | "inactive"
}

export interface ClassroomStats {
  totalStudents: number
  averageAttendance: number
  activeToday: number
  assignmentsPending: number
}

export interface AttendanceRecord {
  id: string
  studentId: string
  studentName: string
  date: string
  status: "present" | "absent" | "late"
}
