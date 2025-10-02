import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // This endpoint allows public access to student list for QR scanning
    // In production, you might want to add additional security
    const { data: students, error } = await supabase
      .from("students")
      .select("id, name, student_id")
      .order("name", { ascending: true })

    if (error) throw error

    return NextResponse.json({ students })
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}
