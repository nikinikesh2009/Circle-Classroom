"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  Typography,
  Card,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  TextField,
  CircularProgress,
} from "@mui/material"
import { DataGrid, type GridColDef } from "@mui/x-data-grid"
import { Add as AddIcon } from "@mui/icons-material"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/auth"
import { getAttendanceRecords, markAttendance, getAttendanceStats, getStudents } from "@/lib/db"
import DashboardLayout from "@/components/dashboard-layout"
import type { AttendanceRecord, Student } from "@/lib/types"

export default function AttendancePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0 })
  const [userId, setUserId] = useState<string>("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    studentId: "",
    status: "present" as "present" | "absent" | "late",
  })
  const [submitting, setSubmitting] = useState(false)

  const loadAttendance = async (uid: string) => {
    const today = new Date().toISOString().split("T")[0]
    const records = await getAttendanceRecords(uid)
    const todayStats = await getAttendanceStats(uid, today)
    const studentsList = await getStudents(uid)

    setAttendance(records)
    setStats(todayStats)
    setStudents(studentsList)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login")
      } else {
        setUserId(user.uid)
        await loadAttendance(user.uid)
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleMarkAttendance = async () => {
    if (!formData.studentId) return

    setSubmitting(true)
    try {
      const student = students.find((s) => s.id === formData.studentId)
      if (!student) return

      const today = new Date().toISOString().split("T")[0]
      await markAttendance(userId, {
        studentId: formData.studentId,
        studentName: student.name,
        date: today,
        status: formData.status,
      })

      await loadAttendance(userId)
      setDialogOpen(false)
      setFormData({ studentId: "", status: "present" })
    } catch (error) {
      console.error("Error marking attendance:", error)
    } finally {
      setSubmitting(false)
    }
  }

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
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            sx={{ height: "fit-content" }}
          >
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
                  {stats.present}
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
                  {stats.absent}
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
                  {stats.late}
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>

        <Card>
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={attendance}
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

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Mark Attendance</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Select Student"
                select
                fullWidth
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              >
                {students.map((student) => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Status"
                select
                fullWidth
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <MenuItem value="present">Present</MenuItem>
                <MenuItem value="absent">Absent</MenuItem>
                <MenuItem value="late">Late</MenuItem>
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleMarkAttendance} variant="contained" disabled={submitting || !formData.studentId}>
              {submitting ? <CircularProgress size={24} /> : "Mark Attendance"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  )
}
