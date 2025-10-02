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
    const { sessionName, date, durationMinutes } = body

    // Create session with time window
    const startTime = new Date()
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000)

    // Generate unique QR code data
    const qrCodeData = `${user.id}-${date}-${Date.now()}-${Math.random().toString(36).substring(7)}`

    const { data: session, error } = await supabase
      .from("attendance_sessions")
      .insert({
        teacher_id: user.id,
        session_name: sessionName,
        date,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        qr_code_data: qrCodeData,
        is_active: true,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ session })
  } catch (error) {
    console.error("Error creating QR session:", error)
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: sessions, error } = await supabase
      .from("attendance_sessions")
      .select("*")
      .eq("teacher_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error("Error fetching sessions:", error)
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}
