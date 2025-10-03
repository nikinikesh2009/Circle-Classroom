"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Box, Typography, Grid, Card, CardContent, CircularProgress } from "@mui/material"
import {
  People as PeopleIcon,
  EventAvailable as AttendanceIcon,
  TrendingUp as TrendingIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/auth"
import { getDashboardStats } from "@/lib/db"
import DashboardLayout from "@/components/dashboard-layout"
import StatCard from "@/components/stat-card"

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalStudents: 0,
    averageAttendance: 0,
    activeStudents: 0,
    recentActivity: 0,
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login")
      } else {
        try {
          const dashboardStats = await getDashboardStats(user.uid)
          setStats(dashboardStats)
        } catch (error) {
          console.error("Error loading dashboard stats:", error)
        } finally {
          setLoading(false)
        }
      }
    })

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "background.default",
        }}
      >
        <CircularProgress size={40} />
      </Box>
    )
  }

  return (
    <DashboardLayout>
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
            Dashboard Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Here's what's happening in your classroom today.
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Students"
              value={stats.totalStudents}
              icon={<PeopleIcon sx={{ fontSize: 32 }} />}
              color="#1976d2"
              delay={0}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Avg. Attendance"
              value={`${stats.averageAttendance}%`}
              icon={<AttendanceIcon sx={{ fontSize: 32 }} />}
              color="#4caf50"
              delay={0.1}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Students"
              value={stats.activeStudents}
              icon={<TrendingIcon sx={{ fontSize: 32 }} />}
              color="#2196f3"
              delay={0.2}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Recent Activity"
              value={stats.recentActivity}
              icon={<AssignmentIcon sx={{ fontSize: 32 }} />}
              color="#ff9800"
              delay={0.3}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Recent Activity
                </Typography>
                <Box sx={{ py: 4, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    Activity feed coming soon...
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Quick Actions
                </Typography>
                <Box sx={{ py: 4, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    Quick actions coming soon...
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  )
}
