import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { AddMarksForm } from "@/components/add-marks-form"

export default async function AddMarksPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: exam } = await supabase.from("exams").select("*").eq("id", params.id).eq("teacher_id", user.id).single()

  if (!exam) {
    notFound()
  }

  const { data: students } = await supabase.from("students").select("*").eq("teacher_id", user.id).order("name")

  const { data: existingMarks } = await supabase.from("exam_marks").select("student_id").eq("exam_id", params.id)

  const existingStudentIds = new Set(existingMarks?.map((m) => m.student_id) || [])
  const availableStudents = students?.filter((s) => !existingStudentIds.has(s.id)) || []

  return (
    <div className="space-y-6 p-4 md:p-6 pb-24 md:pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Marks</h1>
        <p className="text-muted-foreground">
          {exam.exam_name} - {exam.subject}
        </p>
      </div>

      <AddMarksForm exam={exam} students={availableStudents} />
    </div>
  )
}
