import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAttendanceRecords, markAttendance } from "@/lib/supabase/db"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate") || undefined
    const endDate = searchParams.get("endDate") || undefined

    const records = await getAttendanceRecords(user.id, startDate, endDate)
    return NextResponse.json(records)
  } catch (error) {
    console.error("Error fetching attendance:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const attendanceData = await request.json()
    const recordId = await markAttendance(user.id, attendanceData)

    if (!recordId) {
      return NextResponse.json({ error: "Failed to mark attendance" }, { status: 500 })
    }

    return NextResponse.json({ id: recordId }, { status: 201 })
  } catch (error) {
    console.error("Error marking attendance:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
