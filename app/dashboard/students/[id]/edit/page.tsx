import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { MobileNav } from "@/components/mobile-nav"
import { StudentForm } from "@/components/student-form"

export default async function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
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

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-6 p-6 pb-24 md:pb-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Student</h1>
          <p className="text-muted-foreground">Update student information</p>
        </div>
        <StudentForm student={student} />
      </main>
      <MobileNav />
    </div>
  )
}
