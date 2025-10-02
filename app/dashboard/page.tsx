import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { MobileNav } from "@/components/mobile-nav"
import { StatsCards } from "@/components/stats-cards"
import { RecentActivity } from "@/components/recent-activity"

export default async function DashboardPage() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    console.log("[v0] Dashboard - User check:", { user: user?.email, error: userError })

    if (!user || userError) {
      console.log("[v0] Dashboard - No user, redirecting to login")
      redirect("/auth/login")
    }

    let students = []
    let todayAttendance = []

    try {
      const { data: studentsData, error: studentsError } = await supabase
        .from("students")
        .select("*")
        .eq("teacher_id", user.id)

      if (studentsError) {
        console.error("[v0] Dashboard - Students query error:", studentsError)
      } else {
        students = studentsData || []
      }

      const { data: attendanceData, error: attendanceError } = await supabase
        .from("attendance")
        .select("*")
        .eq("teacher_id", user.id)
        .eq("date", new Date().toISOString().split("T")[0])

      if (attendanceError) {
        console.error("[v0] Dashboard - Attendance query error:", attendanceError)
      } else {
        todayAttendance = attendanceData || []
      }
    } catch (dbError) {
      console.error("[v0] Dashboard - Database error:", dbError)
      // Continue with empty data rather than crashing
    }

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
  } catch (error) {
    console.error("[v0] Dashboard - Critical error:", error)
    // If anything fails catastrophically, redirect to login
    redirect("/auth/login")
  }
}
