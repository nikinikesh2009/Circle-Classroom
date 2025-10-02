import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    console.log("[v0] User check:", { user: user?.email, error: userError })

    if (!user) {
      redirect("/auth/login")
    }

    // If user is authenticated, redirect to dashboard
    redirect("/dashboard")
  } catch (error) {
    console.error("[v0] Root page error:", error)
    // If anything fails, redirect to login
    redirect("/auth/login")
  }
}
