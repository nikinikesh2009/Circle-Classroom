import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { MobileNav } from "@/components/mobile-nav"
import { AttendanceReports } from "@/components/attendance-reports"
import { AIInsightsCard } from "@/components/ai-insights-card"

export default async function ReportsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

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

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-6 p-6 pb-24 md:pb-6">
        <div className="animate-fade-in">
          <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
            Reports
          </h1>
          <p className="text-muted-foreground">View attendance reports and export data</p>
        </div>
        <AIInsightsCard />
        <AttendanceReports students={students || []} attendanceRecords={attendanceRecords || []} />
      </main>
      <MobileNav />
    </div>
  )
}
