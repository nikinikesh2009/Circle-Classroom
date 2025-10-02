import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ExamForm } from "@/components/exam-form"

export default async function NewExamPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="space-y-6 p-4 md:p-6 pb-24 md:pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Exam</h1>
        <p className="text-muted-foreground">Add a new exam to track student performance</p>
      </div>

      <ExamForm />
    </div>
  )
}
