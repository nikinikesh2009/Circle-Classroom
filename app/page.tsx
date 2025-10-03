"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check authentication and redirect accordingly
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is authenticated, go to dashboard
        router.push("/dashboard")
      } else {
        // User is not authenticated, go to login
        router.push("/login")
      }
    })

    return () => unsubscribe()
  }, [router])

  // Show loading state while checking auth
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin text-4xl mb-4">⏳</div>
        <p className="text-muted-foreground">Loading Circle Classroom...</p>
      </div>
    </div>
  )
}
