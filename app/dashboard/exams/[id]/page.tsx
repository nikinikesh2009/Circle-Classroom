import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, BookOpen, Award, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"
import { ExamMarksTable } from "@/components/exam-marks-table"

export default async function ExamDetailPage({ params }: { params: { id: string } }) {
  if (params.id === "new") {
    redirect("/dashboard/exams/new")
  }

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

  const { data: examMarks } = await supabase
    .from("exam_marks")
    .select(
      `
      *,
      students (
        id,
        name,
        student_id,
        photo_url,
        class_grade,
        section
      )
    `,
    )
    .eq("exam_id", params.id)

  const { data: students } = await supabase.from("students").select("*").eq("teacher_id", user.id)

  // Calculate statistics
  const totalStudents = students?.length || 0
  const studentsWithMarks = examMarks?.length || 0
  const averageMarks =
    examMarks && examMarks.length > 0
      ? (examMarks.reduce((sum, mark) => sum + mark.marks_obtained, 0) / examMarks.length).toFixed(2)
      : "0"
  const passedStudents = examMarks?.filter((mark) => mark.marks_obtained >= exam.passing_marks).length || 0
  const passPercentage = studentsWithMarks > 0 ? ((passedStudents / studentsWithMarks) * 100).toFixed(1) : "0"

  const examDate = new Date(exam.exam_date)

  return (
    <div className="space-y-6 p-4 md:p-6 pb-24 md:pb-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{exam.exam_name}</h1>
          <p className="text-muted-foreground">{exam.subject}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/dashboard/exams/${params.id}/add-marks`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Marks
            </Link>
          </Button>
        </div>
      </div>

      {/* Exam Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Exam Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-semibold">{examDate.toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Total Marks</p>
                <p className="font-semibold">{exam.total_marks}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Passing Marks</p>
                <p className="font-semibold">{exam.passing_marks}</p>
              </div>
            </div>
            {exam.class_grade && (
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Class</p>
                  <p className="font-semibold">{exam.class_grade}</p>
                </div>
              </div>
            )}
          </div>
          {exam.description && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">{exam.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">In your class</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marks Entered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentsWithMarks}</div>
            <p className="text-xs text-muted-foreground">{totalStudents - studentsWithMarks} remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Marks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageMarks}</div>
            <p className="text-xs text-muted-foreground">Out of {exam.total_marks}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{passPercentage}%</div>
            <p className="text-xs text-muted-foreground">
              {passedStudents} of {studentsWithMarks} passed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Marks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Marks</CardTitle>
          <CardDescription>View and manage marks for all students</CardDescription>
        </CardHeader>
        <CardContent>
          <ExamMarksTable examMarks={examMarks || []} exam={exam} />
        </CardContent>
      </Card>
    </div>
  )
}
