import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { MobileNav } from "@/components/mobile-nav"
import { BulkImportForm } from "@/components/bulk-import-form"

export default async function ImportStudentsPage() {
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
          <h1 className="text-3xl font-bold">Import Students</h1>
          <p className="text-muted-foreground">Upload a CSV file to add multiple students at once</p>
        </div>
        <BulkImportForm />
      </main>
      <MobileNav />
    </div>
  )
}
