"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Box, Typography, Card, Button } from "@mui/material"
import { DataGrid, type GridColDef } from "@mui/x-data-grid"
import { Add as AddIcon } from "@mui/icons-material"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/auth"
import DashboardLayout from "@/components/dashboard-layout"
import type { Student } from "@/lib/types"

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
]

const mockStudents: Student[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.j@school.edu",
    grade: "10th",
    attendance: 96,
    lastActive: "2 hours ago",
    status: "active",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.s@school.edu",
    grade: "10th",
    attendance: 89,
    lastActive: "1 day ago",
    status: "active",
  },
  {
    id: "3",
    name: "Carol Williams",
    email: "carol.w@school.edu",
    grade: "11th",
    attendance: 92,
    lastActive: "3 hours ago",
    status: "active",
  },
  {
    id: "4",
    name: "David Brown",
    email: "david.b@school.edu",
    grade: "10th",
    attendance: 78,
    lastActive: "5 days ago",
    status: "inactive",
  },
  {
    id: "5",
    name: "Emma Davis",
    email: "emma.d@school.edu",
    grade: "11th",
    attendance: 94,
    lastActive: "1 hour ago",
    status: "active",
  },
]

export default function StudentsPage() {
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
              Students
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your classroom students
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} sx={{ height: "fit-content" }}>
            Add Student
          </Button>
        </Box>

        <Card>
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={mockStudents}
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
      </Box>
    </DashboardLayout>
  )
}
