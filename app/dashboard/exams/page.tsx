import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Calendar, BookOpen, TrendingUp } from "lucide-react"
import Link from "next/link"
import type { Exam } from "@/lib/types"

export default async function ExamsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: exams } = await supabase
    .from("exams")
    .select("*")
    .eq("teacher_id", user.id)
    .order("exam_date", { ascending: false })

  const { data: students } = await supabase.from("students").select("id").eq("teacher_id", user.id)

  const totalStudents = students?.length || 0

  return (
    <div className="space-y-6 p-4 md:p-6 pb-24 md:pb-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exams & Marks</h1>
          <p className="text-muted-foreground">Manage exams and student performance</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/exams/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Exam
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exams?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Across all subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {exams?.filter((exam) => new Date(exam.exam_date) > new Date()).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Scheduled ahead</p>
          </CardContent>
        </Card>
      </div>

      {/* Exams List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">All Exams</h2>
        {!exams || exams.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No exams yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first exam to start tracking student performance
              </p>
              <Button asChild>
                <Link href="/dashboard/exams/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Exam
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam: Exam) => {
              const examDate = new Date(exam.exam_date)
              const isPast = examDate < new Date()

              return (
                <Link key={exam.id} href={`/dashboard/exams/${exam.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{exam.exam_name}</CardTitle>
                          <CardDescription>{exam.subject}</CardDescription>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isPast ? "bg-gray-100 text-gray-700" : "bg-green-100 text-green-700"
                          }`}
                        >
                          {isPast ? "Completed" : "Upcoming"}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{examDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Total Marks:</span>
                          <span className="font-semibold">{exam.total_marks}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Passing Marks:</span>
                          <span className="font-semibold">{exam.passing_marks}</span>
                        </div>
                        {exam.class_grade && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Class:</span>
                            <span className="font-semibold">{exam.class_grade}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
