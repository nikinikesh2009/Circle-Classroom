import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAttendanceStats } from "@/lib/supabase/db"

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
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json({ error: "Date parameter required" }, { status: 400 })
    }

    const stats = await getAttendanceStats(user.id, date)
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching attendance stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
