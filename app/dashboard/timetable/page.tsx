import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { MobileNav } from "@/components/mobile-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays } from "lucide-react"

export default async function TimetablePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  const timeSlots = [
    "8:00 AM - 9:00 AM",
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-6 p-4 md:p-6 pb-24 md:pb-6 animate-fade-in">
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Timetable
          </h1>
          <p className="text-muted-foreground">View your weekly class schedule</p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Weekly Schedule
            </CardTitle>
            <CardDescription>Your class timetable for the week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-3 text-left font-semibold text-sm">Time</th>
                    {daysOfWeek.map((day) => (
                      <th key={day} className="p-3 text-left font-semibold text-sm">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot, index) => (
                    <tr key={slot} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-3 text-sm font-medium text-muted-foreground whitespace-nowrap">{slot}</td>
                      {daysOfWeek.map((day) => (
                        <td key={`${day}-${slot}`} className="p-3">
                          <div className="min-h-[60px] rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center text-xs text-muted-foreground hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                            {index === 4 && day === "Monday" ? (
                              <span className="text-muted-foreground/50">Lunch Break</span>
                            ) : (
                              <span className="text-muted-foreground/30">+ Add Class</span>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground text-center">
              📅 Timetable management coming soon! You'll be able to add, edit, and manage your class schedule.
            </p>
          </CardContent>
        </Card>
      </main>
      <MobileNav />
    </div>
  )
}
