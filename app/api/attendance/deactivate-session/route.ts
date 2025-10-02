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

    const body = await request.json()
    const { sessionId } = body

    const { error } = await supabase
      .from("attendance_sessions")
      .update({ is_active: false })
      .eq("id", sessionId)
      .eq("teacher_id", user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deactivating session:", error)
    return NextResponse.json({ error: "Failed to deactivate session" }, { status: 500 })
  }
}
