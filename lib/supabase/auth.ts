// Supabase authentication helper functions
import { createClient as createBrowserClient } from "./client"
import { createClient as createServerClient } from "./server"

export interface ClassroomData {
  classroom_name: string
  email: string
  school_name: string
  logo_url?: string
  created_at: string
}

// Register a new classroom (client-side)
export async function registerClassroom(
  email: string,
  password: string,
  classroomData: Omit<ClassroomData, "email" | "created_at">,
) {
  const supabase = createBrowserClient()

  try {
    // Sign up with metadata that will be used by the trigger
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
        data: {
          classroom_name: classroomData.classroom_name,
          school_name: classroomData.school_name,
          logo_url: classroomData.logo_url,
        },
      },
    })

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    return { data: null, error: error.message || "Registration failed" }
  }
}

// Login classroom (client-side)
export async function loginClassroom(email: string, password: string) {
  const supabase = createBrowserClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    return { data: null, error: error.message || "Login failed" }
  }
}

// Logout (client-side)
export async function logoutClassroom() {
  const supabase = createBrowserClient()

  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error: any) {
    return { error: error.message || "Logout failed" }
  }
}

export const signOut = logoutClassroom

// Get classroom data (server-side)
export async function getClassroomData(userId: string): Promise<ClassroomData | null> {
  const supabase = await createServerClient()

  try {
    const { data, error } = await supabase.from("classrooms").select("*").eq("id", userId).single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error fetching classroom data:", error)
    return null
  }
}
