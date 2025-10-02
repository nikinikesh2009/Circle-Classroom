import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { StudentIdCard } from "@/components/student-id-card"

export default async function StudentQRPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: student } = await supabase.from("students").select("*").eq("id", id).eq("teacher_id", user.id).single()

  if (!student) {
    redirect("/dashboard/students")
  }

  const { data: profile } = await supabase.from("teacher_profiles").select("*").eq("id", user.id).single()

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Student ID Card</h1>
          <p className="text-muted-foreground">Print or download the student ID card with QR code</p>
        </div>
        <StudentIdCard student={student} schoolName={profile?.school_name || "School"} />
      </main>
    </div>
  )
}
