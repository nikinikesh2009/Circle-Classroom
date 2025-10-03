"use client"

import { useState, type FormEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Box, TextField, Button, Typography, Card, CardContent, Alert, CircularProgress } from "@mui/material"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { loginClassroom } from "@/lib/supabase/auth"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    console.log("[v0] Login page mounted, checking auth state...")
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      console.log("[v0] Login page auth state:", user ? "User found, redirecting" : "No user, showing login form")
      if (user) {
        router.replace("/dashboard")
      } else {
        setCheckingAuth(false)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        router.replace("/dashboard")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const validateForm = (): boolean => {
    if (!email || !password) {
      setError("Please fill in all fields")
      return false
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address")
      return false
    }
    return true
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) return

    setLoading(true)
    console.log("[v0] Attempting login...")
    try {
      const { data, error: loginError } = await loginClassroom(email, password)

      if (loginError) {
        throw new Error(loginError)
      }

      console.log("[v0] Login successful, redirecting to dashboard...")
      router.replace("/dashboard")
    } catch (err: any) {
      console.error("[v0] Login failed:", err.message)
      setError(err.message || "Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
        }}
      >
        <CircularProgress size={40} />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
        p: 2,
      }}
    >
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card sx={{ maxWidth: 450, width: "100%", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #1976d2 0%, #4caf50 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "2rem",
                  margin: "0 auto 16px",
                }}
              >
                C
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Circle Classroom
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to your classroom
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                sx={{ mb: 3 }}
                autoComplete="email"
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                sx={{ mb: 3 }}
                autoComplete="current-password"
              />

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mb: 2, height: 48 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
              </Button>

              <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
                Don't have an account?{" "}
                <Link href="/register" style={{ color: "#1976d2", textDecoration: "none", fontWeight: 600 }}>
                  Register here
                </Link>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  )
}
