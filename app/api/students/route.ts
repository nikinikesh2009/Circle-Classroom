import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getStudents, addStudent } from "@/lib/supabase/db"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const students = await getStudents(user.id)
    return NextResponse.json(students)
  } catch (error) {
    console.error("Error fetching students:", error)
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

    const studentData = await request.json()
    const studentId = await addStudent(user.id, studentData)

    if (!studentId) {
      return NextResponse.json({ error: "Failed to add student" }, { status: 500 })
    }

    return NextResponse.json({ id: studentId }, { status: 201 })
  } catch (error) {
    console.error("Error adding student:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
