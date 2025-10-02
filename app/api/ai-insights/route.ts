import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

export async function POST(request: Request) {
  try {
    console.log("[v0] Starting AI insights generation")

    if (!GEMINI_API_KEY) {
      console.log("[v0] Gemini API key not found")
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Fetching attendance data for user:", user.id)

    // Fetch all students
    const { data: students } = await supabase
      .from("students")
      .select("*")
      .eq("teacher_id", user.id)
      .order("name", { ascending: true })

    // Fetch all attendance records
    const { data: attendanceRecords } = await supabase
      .from("attendance")
      .select("*")
      .eq("teacher_id", user.id)
      .order("date", { ascending: false })

    if (!students || !attendanceRecords) {
      console.log("[v0] No data found")
      return NextResponse.json({ error: "No data found" }, { status: 404 })
    }

    console.log("[v0] Found", students.length, "students and", attendanceRecords.length, "attendance records")

    // Prepare data for AI analysis
    const studentStats = students.map((student) => {
      const records = attendanceRecords.filter((r) => r.student_id === student.id)
      const present = records.filter((r) => r.status === "present").length
      const absent = records.filter((r) => r.status === "absent").length
      const late = records.filter((r) => r.status === "late").length
      const excused = records.filter((r) => r.status === "excused").length
      const total = records.length
      const rate = total > 0 ? Math.round((present / total) * 100) : 0

      return {
        name: student.name,
        studentId: student.student_id,
        totalDays: total,
        present,
        absent,
        late,
        excused,
        attendanceRate: rate,
      }
    })

    const classAverage =
      studentStats.length > 0
        ? Math.round(studentStats.reduce((sum, s) => sum + s.attendanceRate, 0) / studentStats.length)
        : 0

    // Create prompt for Gemini
    const prompt = `You are an educational attendance analyst. Analyze the following classroom attendance data and provide actionable insights.

Class Statistics:
- Total Students: ${students.length}
- Class Average Attendance Rate: ${classAverage}%

Individual Student Data:
${studentStats
  .map(
    (s) =>
      `- ${s.name} (ID: ${s.studentId}): ${s.attendanceRate}% attendance (${s.present} present, ${s.absent} absent, ${s.late} late, ${s.excused} excused out of ${s.totalDays} days)`,
  )
  .join("\n")}

Please provide:
1. Overall class attendance analysis (2-3 sentences)
2. Students who need attention (identify students with attendance rates below 80% or concerning patterns)
3. Positive trends (students with excellent attendance or improvement)
4. Actionable recommendations for the teacher (3-4 specific suggestions)

Format your response in clear sections with bullet points where appropriate. Be concise and practical.`

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`
    console.log("[v0] Calling Gemini API with model: gemini-2.0-flash")

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    })

    console.log("[v0] Gemini API response status:", response.status)

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] Gemini API error:", errorData)
      throw new Error(`Failed to get AI insights: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    console.log("[v0] Successfully received AI insights")

    const insights = data.candidates[0].content.parts[0].text

    return NextResponse.json({
      insights,
      stats: {
        totalStudents: students.length,
        classAverage,
        studentStats,
      },
    })
  } catch (error) {
    console.error("[v0] Error generating AI insights:", error)
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 })
  }
}
