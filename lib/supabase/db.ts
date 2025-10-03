import { createClient as createServerClient } from "./server"
import type { Student, AttendanceRecord } from "../types"

// ============ STUDENTS ============

export async function addStudent(teacherId: string, studentData: Omit<Student, "id">): Promise<string | null> {
  const supabase = await createServerClient()

  try {
    const { data, error } = await supabase
      .from("students")
      .insert({
        teacher_id: teacherId,
        name: studentData.name,
        email: studentData.email,
        grade: studentData.grade,
        attendance: studentData.attendance,
        last_active: studentData.lastActive,
        status: studentData.status,
      })
      .select("id")
      .single()

    if (error) throw error
    return data.id
  } catch (error) {
    console.error("Error adding student:", error)
    return null
  }
}

export async function getStudents(teacherId: string): Promise<Student[]> {
  const supabase = await createServerClient()

  try {
    const { data, error } = await supabase.from("students").select("*").eq("teacher_id", teacherId).order("name")

    if (error) throw error

    return (data || []).map((student) => ({
      id: student.id,
      name: student.name,
      email: student.email,
      grade: student.grade,
      attendance: student.attendance,
      lastActive: student.last_active,
      status: student.status,
    }))
  } catch (error) {
    console.error("Error fetching students:", error)
    return []
  }
}

export async function updateStudent(
  teacherId: string,
  studentId: string,
  studentData: Partial<Student>,
): Promise<boolean> {
  const supabase = await createServerClient()

  try {
    const updateData: any = {}
    if (studentData.name !== undefined) updateData.name = studentData.name
    if (studentData.email !== undefined) updateData.email = studentData.email
    if (studentData.grade !== undefined) updateData.grade = studentData.grade
    if (studentData.attendance !== undefined) updateData.attendance = studentData.attendance
    if (studentData.lastActive !== undefined) updateData.last_active = studentData.lastActive
    if (studentData.status !== undefined) updateData.status = studentData.status

    const { error } = await supabase.from("students").update(updateData).eq("id", studentId).eq("teacher_id", teacherId)

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error updating student:", error)
    return false
  }
}

export async function deleteStudent(teacherId: string, studentId: string): Promise<boolean> {
  const supabase = await createServerClient()

  try {
    const { error } = await supabase.from("students").delete().eq("id", studentId).eq("teacher_id", teacherId)

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error deleting student:", error)
    return false
  }
}

// ============ ATTENDANCE ============

export async function markAttendance(
  teacherId: string,
  attendanceData: Omit<AttendanceRecord, "id">,
): Promise<string | null> {
  const supabase = await createServerClient()

  try {
    const { data, error } = await supabase
      .from("attendance")
      .insert({
        teacher_id: teacherId,
        student_id: attendanceData.studentId,
        student_name: attendanceData.studentName,
        date: attendanceData.date,
        status: attendanceData.status,
      })
      .select("id")
      .single()

    if (error) throw error
    return data.id
  } catch (error) {
    console.error("Error marking attendance:", error)
    return null
  }
}

export async function getAttendanceRecords(
  teacherId: string,
  startDate?: string,
  endDate?: string,
): Promise<AttendanceRecord[]> {
  const supabase = await createServerClient()

  try {
    let query = supabase.from("attendance").select("*").eq("teacher_id", teacherId)

    if (startDate && endDate) {
      query = query.gte("date", startDate).lte("date", endDate)
    }

    const { data, error } = await query.order("date", { ascending: false })

    if (error) throw error

    return (data || []).map((record) => ({
      id: record.id,
      studentId: record.student_id,
      studentName: record.student_name,
      date: record.date,
      status: record.status,
    }))
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
  const supabase = await createServerClient()

  try {
    const { data, error } = await supabase
      .from("attendance")
      .select("status")
      .eq("teacher_id", teacherId)
      .eq("date", date)

    if (error) throw error

    const stats = { present: 0, absent: 0, late: 0 }
    data?.forEach((record) => {
      if (record.status === "present") stats.present++
      else if (record.status === "absent") stats.absent++
      else if (record.status === "late") stats.late++
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
  const supabase = await createServerClient()

  try {
    // Get all students
    const { data: students, error: studentsError } = await supabase
      .from("students")
      .select("attendance, status")
      .eq("teacher_id", teacherId)

    if (studentsError) throw studentsError

    const totalStudents = students?.length || 0
    const activeStudents = students?.filter((s) => s.status === "active").length || 0

    // Calculate average attendance
    let totalAttendance = 0
    students?.forEach((student) => {
      totalAttendance += student.attendance || 0
    })
    const averageAttendance = totalStudents > 0 ? Math.round(totalAttendance / totalStudents) : 0

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const dateString = sevenDaysAgo.toISOString().split("T")[0]

    const { data: recentRecords, error: recentError } = await supabase
      .from("attendance")
      .select("id")
      .eq("teacher_id", teacherId)
      .gte("date", dateString)

    if (recentError) throw recentError

    const recentActivity = recentRecords?.length || 0

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
