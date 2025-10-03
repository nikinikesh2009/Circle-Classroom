"use client"

import { useState, type FormEvent, type ChangeEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  InputLabel,
} from "@mui/material"
import { CloudUpload as UploadIcon } from "@mui/icons-material"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { registerClassroom } from "@/lib/supabase/auth"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    classroomName: "",
    email: "",
    password: "",
    confirmPassword: "",
    schoolName: "",
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        router.push("/dashboard")
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        router.push("/dashboard")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 2 * 1024 * 1024) {
        setError("Logo file size must be less than 2MB")
        return
      }
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file")
        return
      }
      setLogoFile(file)
      setError("")
    }
  }

  const validateForm = (): boolean => {
    const { classroomName, email, password, confirmPassword, schoolName } = formData

    if (!classroomName || !email || !password || !confirmPassword || !schoolName) {
      setError("Please fill in all required fields")
      return false
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address")
      return false
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    return true
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) return

    setLoading(true)
    try {
      const { data, error: registerError } = await registerClassroom(formData.email, formData.password, {
        classroom_name: formData.classroomName,
        school_name: formData.schoolName,
      })

      if (registerError) {
        throw new Error(registerError)
      }

      router.push("/auth/sign-up-success")
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
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
        py: 4,
      }}
    >
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card sx={{ maxWidth: 500, width: "100%", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
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
                Create your classroom account
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Classroom Name"
                name="classroomName"
                value={formData.classroomName}
                onChange={handleChange}
                disabled={loading}
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
                sx={{ mb: 2 }}
                autoComplete="email"
              />

              <TextField
                fullWidth
                label="School Name"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                disabled={loading}
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
                sx={{ mb: 2 }}
                autoComplete="new-password"
              />

              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                required
                sx={{ mb: 2 }}
                autoComplete="new-password"
              />

              <Box sx={{ mb: 3 }}>
                <InputLabel sx={{ mb: 1, fontSize: "0.875rem", color: "text.secondary" }}>
                  Classroom Logo (Optional)
                </InputLabel>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  fullWidth
                  disabled={loading}
                  sx={{ justifyContent: "flex-start", height: 48 }}
                >
                  {logoFile ? logoFile.name : "Upload Logo"}
                  <input type="file" hidden accept="image/*" onChange={handleLogoChange} />
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                  Max 2MB, image files only
                </Typography>
              </Box>

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
                {loading ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
              </Button>

              <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
                Already have an account?{" "}
                <Link href="/login" style={{ color: "#1976d2", textDecoration: "none", fontWeight: 600 }}>
                  Sign in here
                </Link>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  )
}
