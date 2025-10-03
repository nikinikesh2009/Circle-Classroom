"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  Typography,
  Card,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  CircularProgress,
} from "@mui/material"
import { DataGrid, type GridColDef } from "@mui/x-data-grid"
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/auth"
import { getStudents, addStudent, deleteStudent } from "@/lib/db"
import DashboardLayout from "@/components/dashboard-layout"
import type { Student } from "@/lib/types"

export default function StudentsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState<Student[]>([])
  const [userId, setUserId] = useState<string>("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    grade: "",
  })
  const [submitting, setSubmitting] = useState(false)

  const loadStudents = async (uid: string) => {
    try {
      const fetchedStudents = await getStudents(uid)
      setStudents(fetchedStudents)
    } catch (error) {
      console.error("Error loading students:", error)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login")
      } else {
        setUserId(user.uid)
        await loadStudents(user.uid)
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleAddStudent = async () => {
    if (!formData.name || !formData.email || !formData.grade) {
      return
    }

    setSubmitting(true)
    try {
      await addStudent(userId, {
        name: formData.name,
        email: formData.email,
        grade: formData.grade,
        attendance: 100,
        lastActive: "Just now",
        status: "active",
      })
      await loadStudents(userId)
      setDialogOpen(false)
      setFormData({ name: "", email: "", grade: "" })
    } catch (error) {
      console.error("Error adding student:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteStudent = async (studentId: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(userId, studentId)
        await loadStudents(userId)
      } catch (error) {
        console.error("Error deleting student:", error)
      }
    }
  }

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
    { field: "grade", headerName: "Grade", width: 100 },
    {
      field: "attendance",
      headerName: "Attendance",
      width: 120,
      renderCell: (params) => `${params.value}%`,
    },
    { field: "lastActive", headerName: "Last Active", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            px: 2,
            py: 0.5,
            borderRadius: 1,
            backgroundColor: params.value === "active" ? "#4caf5020" : "#f4433620",
            color: params.value === "active" ? "#4caf50" : "#f44336",
            fontWeight: 500,
            fontSize: "0.875rem",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <IconButton size="small" color="error" onClick={() => handleDeleteStudent(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ]

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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
              Students
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your classroom students
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            sx={{ height: "fit-content" }}
          >
            Add Student
          </Button>
        </Box>

        <Card>
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={students}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 25]}
              checkboxSelection
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
          <DialogTitle>Add New Student</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Student Name"
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <TextField
                label="Grade"
                select
                fullWidth
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              >
                {["9th", "10th", "11th", "12th"].map((grade) => (
                  <MenuItem key={grade} value={grade}>
                    {grade}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleAddStudent}
              variant="contained"
              disabled={submitting || !formData.name || !formData.email || !formData.grade}
            >
              {submitting ? <CircularProgress size={24} /> : "Add Student"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  )
}
