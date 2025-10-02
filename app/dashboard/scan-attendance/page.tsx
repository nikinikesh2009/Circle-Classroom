import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { MobileNav } from "@/components/mobile-nav"
import { ScanAttendanceClient } from "@/components/scan-attendance-client"

export default async function ScanAttendancePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch students for manual selection fallback
  const { data: students } = await supabase.from("students").select("*").eq("teacher_id", user.id).order("name")

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-6 p-4 md:p-6 pb-24 md:pb-6">
        <div>
          <h1 className="text-3xl font-bold">Scan Attendance</h1>
          <p className="text-muted-foreground">Scan student ID cards to mark attendance</p>
        </div>

        <ScanAttendanceClient students={students || []} />
      </main>
      <MobileNav />
    </div>
  )
}
