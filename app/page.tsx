"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import { Box, CircularProgress } from "@mui/material"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createBrowserClient()

    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        router.replace("/dashboard")
      } else {
        router.replace("/login")
      }
    }

    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace("/dashboard")
      } else {
        router.replace("/login")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
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
