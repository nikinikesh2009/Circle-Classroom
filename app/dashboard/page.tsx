import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { MobileNav } from "@/components/mobile-nav"
import { StatsCards } from "@/components/stats-cards"
import { RecentActivity } from "@/components/recent-activity"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch stats
  const { data: students } = await supabase.from("students").select("*").eq("teacher_id", user.id)

  const { data: todayAttendance } = await supabase
    .from("attendance")
    .select("*")
    .eq("teacher_id", user.id)
    .eq("date", new Date().toISOString().split("T")[0])

  const presentCount = todayAttendance?.filter((a) => a.status === "present").length || 0
  const absentCount = todayAttendance?.filter((a) => a.status === "absent").length || 0

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-6 p-4 md:p-6 pb-24 md:pb-6 animate-fade-in">
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back! Here's your classroom overview.</p>
        </div>
        <StatsCards
          totalStudents={students?.length || 0}
          presentToday={presentCount}
          absentToday={absentCount}
          attendanceRate={students?.length ? Math.round((presentCount / students.length) * 100) : 0}
        />
        <RecentActivity />
      </main>
      <MobileNav />
    </div>
  )
}
