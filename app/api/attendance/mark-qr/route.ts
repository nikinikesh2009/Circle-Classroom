import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { qrCodeData, studentId } = body

    // Validate QR code and get session
    const { data: session, error: sessionError } = await supabase
      .from("attendance_sessions")
      .select("*")
      .eq("qr_code_data", qrCodeData)
      .eq("is_active", true)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: "Invalid or expired QR code" }, { status: 400 })
    }

    // Check if session is still valid (within time window)
    const now = new Date()
    const endTime = new Date(session.end_time)

    if (now > endTime) {
      return NextResponse.json({ error: "QR code has expired" }, { status: 400 })
    }

    // Verify student exists and belongs to this teacher
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("*")
      .eq("id", studentId)
      .eq("teacher_id", session.teacher_id)
      .single()

    if (studentError || !student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Check if attendance already marked for this date
    const { data: existingAttendance } = await supabase
      .from("attendance")
      .select("*")
      .eq("student_id", studentId)
      .eq("date", session.date)
      .single()

    if (existingAttendance) {
      return NextResponse.json({ error: "Attendance already marked for today" }, { status: 400 })
    }

    // Mark attendance as present
    const { data: attendance, error: attendanceError } = await supabase
      .from("attendance")
      .insert({
        student_id: studentId,
        teacher_id: session.teacher_id,
        date: session.date,
        status: "present",
        notes: `Marked via QR code: ${session.session_name}`,
      })
      .select()
      .single()

    if (attendanceError) throw attendanceError

    return NextResponse.json({
      success: true,
      attendance,
      message: "Attendance marked successfully!",
    })
  } catch (error) {
    console.error("Error marking attendance:", error)
    return NextResponse.json({ error: "Failed to mark attendance" }, { status: 500 })
  }
}
