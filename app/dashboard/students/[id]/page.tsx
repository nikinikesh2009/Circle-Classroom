import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { MobileNav } from "@/components/mobile-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Heart,
  GraduationCap,
  FileText,
  Edit,
  Award as IdCard,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

export default async function StudentProfilePage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("id", params.id)
    .eq("teacher_id", user.id)
    .single()

  if (!student) {
    redirect("/dashboard/students")
  }

  // Fetch attendance stats
  const { data: attendanceRecords } = await supabase.from("attendance").select("status").eq("student_id", student.id)

  const totalDays = attendanceRecords?.length || 0
  const presentDays = attendanceRecords?.filter((a) => a.status === "present").length || 0
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0

  // Fetch exam marks
  const { data: examMarks } = await supabase
    .from("exam_marks")
    .select(
      `
      *,
      exams:exam_id (
        exam_name,
        subject,
        total_marks,
        exam_date
      )
    `,
    )
    .eq("student_id", student.id)
    .order("created_at", { ascending: false })

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-6 p-4 md:p-6 pb-24 md:pb-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {student.photo_url ? (
              <img
                src={student.photo_url || "/placeholder.svg"}
                alt={student.name}
                className="h-20 w-20 rounded-full border-4 border-primary object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-primary bg-primary/10 text-3xl font-bold text-primary">
                {student.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">{student.name}</h1>
              <p className="text-muted-foreground">ID: {student.student_id}</p>
              <Badge variant={attendancePercentage >= 75 ? "default" : "destructive"} className="mt-2">
                {attendancePercentage}% Attendance
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/dashboard/students/${student.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/dashboard/students/${student.id}/qr`}>
                <IdCard className="mr-2 h-4 w-4" />
                ID Card
              </Link>
            </Button>
          </div>
        </div>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {student.date_of_birth && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{new Date(student.date_of_birth).toLocaleDateString()}</p>
                </div>
              </div>
            )}
            {student.gender && (
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium capitalize">{student.gender}</p>
                </div>
              </div>
            )}
            {student.blood_group && (
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Blood Group</p>
                  <p className="font-medium">{student.blood_group}</p>
                </div>
              </div>
            )}
            {student.class_grade && (
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Class</p>
                  <p className="font-medium">
                    {student.class_grade} {student.section && `- ${student.section}`}
                  </p>
                </div>
              </div>
            )}
            {student.address && (
              <div className="flex items-start gap-3 md:col-span-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{student.address}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Guardian Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Guardian Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {student.guardian_name && (
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Guardian Name</p>
                  <p className="font-medium">{student.guardian_name}</p>
                </div>
              </div>
            )}
            {student.guardian_contact && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="font-medium">{student.guardian_contact}</p>
                </div>
              </div>
            )}
            {student.guardian_email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{student.guardian_email}</p>
                </div>
              </div>
            )}
            {student.emergency_contact && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Emergency Contact</p>
                  <p className="font-medium">{student.emergency_contact}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attendance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Attendance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-4 text-center">
                <p className="text-3xl font-bold text-green-600">{presentDays}</p>
                <p className="text-sm text-muted-foreground">Present Days</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-3xl font-bold text-red-600">{totalDays - presentDays}</p>
                <p className="text-sm text-muted-foreground">Absent Days</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-3xl font-bold text-blue-600">{attendancePercentage}%</p>
                <p className="text-sm text-muted-foreground">Attendance Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exam Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Exam Results
            </CardTitle>
            <CardDescription>Latest exam performance</CardDescription>
          </CardHeader>
          <CardContent>
            {!examMarks || examMarks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No exam results yet</p>
            ) : (
              <div className="space-y-3">
                {examMarks.slice(0, 5).map((mark: any) => (
                  <div key={mark.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-semibold">{mark.exams.exam_name}</p>
                      <p className="text-sm text-muted-foreground">{mark.exams.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(mark.exams.exam_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        {mark.marks_obtained}/{mark.exams.total_marks}
                      </p>
                      {mark.grade && (
                        <Badge variant="outline" className="mt-1">
                          Grade: {mark.grade}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Information */}
        {(student.medical_notes || student.previous_school) && (
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {student.medical_notes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Medical Notes</p>
                  <p className="rounded-lg border p-3 bg-yellow-50">{student.medical_notes}</p>
                </div>
              )}
              {student.previous_school && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Previous School</p>
                  <p className="rounded-lg border p-3">{student.previous_school}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
      <MobileNav />
    </div>
  )
}
