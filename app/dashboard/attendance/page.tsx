"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Box, Typography, Card, Button, Grid } from "@mui/material"
import { DataGrid, type GridColDef } from "@mui/x-data-grid"
import { Add as AddIcon } from "@mui/icons-material"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/auth"
import DashboardLayout from "@/components/dashboard-layout"
import type { AttendanceRecord } from "@/lib/types"

const columns: GridColDef[] = [
  { field: "studentName", headerName: "Student Name", flex: 1, minWidth: 200 },
  { field: "date", headerName: "Date", width: 150 },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    renderCell: (params) => {
      const colors = {
        present: { bg: "#4caf5020", text: "#4caf50" },
        absent: { bg: "#f4433620", text: "#f44336" },
        late: { bg: "#ff980020", text: "#ff9800" },
      }
      const color = colors[params.value as keyof typeof colors]
      return (
        <Box
          sx={{
            px: 2,
            py: 0.5,
            borderRadius: 1,
            backgroundColor: color.bg,
            color: color.text,
            fontWeight: 500,
            fontSize: "0.875rem",
            textTransform: "capitalize",
          }}
        >
          {params.value}
        </Box>
      )
    },
  },
]

const mockAttendance: AttendanceRecord[] = [
  { id: "1", studentId: "1", studentName: "Alice Johnson", date: "2025-01-10", status: "present" },
  { id: "2", studentId: "2", studentName: "Bob Smith", date: "2025-01-10", status: "present" },
  { id: "3", studentId: "3", studentName: "Carol Williams", date: "2025-01-10", status: "late" },
  { id: "4", studentId: "4", studentName: "David Brown", date: "2025-01-10", status: "absent" },
  { id: "5", studentId: "5", studentName: "Emma Davis", date: "2025-01-10", status: "present" },
]

export default function AttendancePage() {
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

  return (
    <DashboardLayout>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
              Attendance
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track student attendance records
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} sx={{ height: "fit-content" }}>
            Mark Attendance
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <Box sx={{ p: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Present Today
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#4caf50" }}>
                  142
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <Box sx={{ p: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Absent Today
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#f44336" }}>
                  8
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <Box sx={{ p: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Late Today
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#ff9800" }}>
                  6
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>

        <Card>
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={mockAttendance}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 25]}
              disableRowSelectionOnClick
              sx={{
                border: "none",
                "& .MuiDataGrid-cell:focus": {
                  outline: "none",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.04)",
                },
              }}
            />
          </Box>
        </Card>
      </Box>
    </DashboardLayout>
  )
}
