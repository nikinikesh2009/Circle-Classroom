import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { MobileNav } from "@/components/mobile-nav"
import { QrAttendanceGenerator } from "@/components/qr-attendance-generator"

export default async function QrAttendancePage() {
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
      <main className="flex-1 space-y-6 p-4 md:p-6 pb-24 md:pb-6 animate-fade-in">
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            QR Code Attendance
          </h1>
          <p className="text-muted-foreground">
            Generate QR codes for students to scan and mark their attendance automatically
          </p>
        </div>
        <QrAttendanceGenerator />
      </main>
      <MobileNav />
    </div>
  )
}
