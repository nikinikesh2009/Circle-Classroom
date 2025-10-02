import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { MobileNav } from "@/components/mobile-nav"
import { StudentForm } from "@/components/student-form"

export default async function NewStudentPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-6 p-6 pb-24 md:pb-6">
        <div>
          <h1 className="text-3xl font-bold">Add New Student</h1>
          <p className="text-muted-foreground">Enter student information</p>
        </div>
        <StudentForm />
      </main>
      <MobileNav />
    </div>
  )
}
