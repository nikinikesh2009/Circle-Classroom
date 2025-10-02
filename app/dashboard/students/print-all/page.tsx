import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { BulkIdCards } from "@/components/bulk-id-cards"

export default async function PrintAllCardsPage() {
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

  const { data: profile } = await supabase.from("teacher_profiles").select("*").eq("id", user.id).single()

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Print All ID Cards</h1>
          <p className="text-muted-foreground">Print ID cards for all students</p>
        </div>
        <BulkIdCards students={students || []} schoolName={profile?.school_name || "School"} />
      </main>
    </div>
  )
}
