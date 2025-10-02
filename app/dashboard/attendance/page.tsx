import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { MobileNav } from "@/components/mobile-nav"
import { AttendanceTracker } from "@/components/attendance-tracker"

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const selectedDate = params.date || new Date().toISOString().split("T")[0]

  // Fetch students
  const { data: students } = await supabase
    .from("students")
    .select("*")
    .eq("teacher_id", user.id)
    .order("name", { ascending: true })

  // Fetch attendance for selected date
  const { data: attendanceRecords } = await supabase
    .from("attendance")
    .select("*")
    .eq("teacher_id", user.id)
    .eq("date", selectedDate)

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-6 p-4 md:p-6 pb-24 md:pb-6 animate-fade-in">
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Attendance
          </h1>
          <p className="text-muted-foreground">Track daily student attendance</p>
        </div>
        <AttendanceTracker
          students={students || []}
          attendanceRecords={attendanceRecords || []}
          selectedDate={selectedDate}
        />
      </main>
      <MobileNav />
    </div>
  )
}
