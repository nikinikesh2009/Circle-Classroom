"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Box, CircularProgress } from "@mui/material"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    console.log("[v0] Home page mounted, checking auth state...")
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("[v0] Auth state changed:", user ? "User logged in" : "No user")
      if (user) {
        console.log("[v0] Redirecting to dashboard...")
        router.replace("/dashboard")
      } else {
        console.log("[v0] Redirecting to login...")
        router.replace("/login")
      }
    })

    return () => unsubscribe()
  }, [router])

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f7fa",
      }}
    >
      <CircularProgress size={40} />
    </Box>
  )
}
