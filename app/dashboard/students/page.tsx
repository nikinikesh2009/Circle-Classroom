import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { MobileNav } from "@/components/mobile-nav"
import { StudentList } from "@/components/student-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function StudentsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: students } = await supabase
    .from("students")
    .select("*")
    .eq("teacher_id", user.id)
    .order("name", { ascending: true })

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-6 p-4 md:p-6 pb-24 md:pb-6 animate-fade-in">
        <div className="flex items-center justify-between animate-slide-up">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Students
            </h1>
            <p className="text-muted-foreground">Manage your classroom roster</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="hidden md:flex bg-transparent">
              <Link href="/dashboard/students/import">Import CSV</Link>
            </Button>
            <Button
              asChild
              className="gradient-primary text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Link href="/dashboard/students/new">
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden md:inline">Add Student</span>
                <span className="md:hidden">Add</span>
              </Link>
            </Button>
          </div>
        </div>
        <StudentList students={students || []} />
      </main>
      <MobileNav />
    </div>
  )
}
