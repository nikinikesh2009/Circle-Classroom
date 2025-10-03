"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Box, Typography, Card, CardContent, Grid, Button } from "@mui/material"
import { Download as DownloadIcon } from "@mui/icons-material"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/auth"
import DashboardLayout from "@/components/dashboard-layout"

export default function ReportsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login")
      } else {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return null
  }

  const reports = [
    { title: "Attendance Report", description: "Monthly attendance summary", date: "January 2025" },
    { title: "Performance Report", description: "Student performance analytics", date: "Q4 2024" },
    { title: "Engagement Report", description: "Classroom engagement metrics", date: "December 2024" },
  ]

  return (
    <DashboardLayout>
      <Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
            Reports
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and download classroom reports
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {reports.map((report, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    {report.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {report.description}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="caption" color="text.secondary">
                      {report.date}
                    </Typography>
                    <Button variant="outlined" size="small" startIcon={<DownloadIcon />}>
                      Download
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </DashboardLayout>
  )
}
