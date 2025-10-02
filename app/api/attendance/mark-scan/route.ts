import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { studentId, date, status } = await request.json()

    // Check if attendance already exists
    const { data: existing } = await supabase
      .from("attendance")
      .select("id")
      .eq("student_id", studentId)
      .eq("date", date)
      .single()

    if (existing) {
      // Update existing attendance
      const { error } = await supabase
        .from("attendance")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", existing.id)

      if (error) throw error
    } else {
      // Insert new attendance
      const { error } = await supabase.from("attendance").insert({
        student_id: studentId,
        teacher_id: user.id,
        date,
        status,
      })

      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking attendance:", error)
    return NextResponse.json({ error: "Failed to mark attendance" }, { status: 500 })
  }
}
