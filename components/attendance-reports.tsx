"use client"

import type { Student, Attendance } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, FileText, Trash2 } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AttendanceReportsProps {
  students: Student[]
  attendanceRecords: Attendance[]
}

export function AttendanceReports({ students, attendanceRecords }: AttendanceReportsProps) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  // Calculate attendance statistics
  const getStudentStats = (studentId: string) => {
    const records = attendanceRecords.filter((r) => r.student_id === studentId)
    const present = records.filter((r) => r.status === "present").length
    const absent = records.filter((r) => r.status === "absent").length
    const late = records.filter((r) => r.status === "late").length
    const excused = records.filter((r) => r.status === "excused").length
    const total = records.length
    const rate = total > 0 ? Math.round((present / total) * 100) : 0

    return { present, absent, late, excused, total, rate }
  }

  const exportToCSV = () => {
    let csvContent = "Student Name,Student ID,Total Days,Present,Absent,Late,Excused,Attendance Rate\n"

    students.forEach((student) => {
      const stats = getStudentStats(student.id)
      csvContent += `${student.name},${student.student_id},${stats.total},${stats.present},${stats.absent},${stats.late},${stats.excused},${stats.rate}%\n`
    })

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `attendance_report_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportDateRangeCSV = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates")
      return
    }

    const filteredRecords = attendanceRecords.filter((r) => r.date >= startDate && r.date <= endDate)

    let csvContent = "Date,Student Name,Student ID,Status,Notes\n"

    filteredRecords.forEach((record) => {
      const student = students.find((s) => s.id === record.student_id)
      if (student) {
        csvContent += `${record.date},${student.name},${student.student_id},${record.status},"${record.notes || ""}"\n`
      }
    })

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `attendance_${startDate}_to_${endDate}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleDeleteAllData = async () => {
    setIsDeleting(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    try {
      // Delete all attendance records
      await supabase.from("attendance").delete().eq("teacher_id", user.id)

      // Delete all students
      await supabase.from("students").delete().eq("teacher_id", user.id)

      router.refresh()
    } catch (error) {
      console.error("Error deleting data:", error)
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead className="text-center">Total Days</TableHead>
                  <TableHead className="text-center">Present</TableHead>
                  <TableHead className="text-center">Absent</TableHead>
                  <TableHead className="text-center">Late</TableHead>
                  <TableHead className="text-center">Excused</TableHead>
                  <TableHead className="text-center">Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No students to display
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student) => {
                    const stats = getStudentStats(student.id)
                    return (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.student_id}</TableCell>
                        <TableCell className="text-center">{stats.total}</TableCell>
                        <TableCell className="text-center text-green-600">{stats.present}</TableCell>
                        <TableCell className="text-center text-red-600">{stats.absent}</TableCell>
                        <TableCell className="text-center text-yellow-600">{stats.late}</TableCell>
                        <TableCell className="text-center text-blue-600">{stats.excused}</TableCell>
                        <TableCell className="text-center font-semibold">{stats.rate}%</TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Export Summary Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Export a summary of all students' attendance statistics to CSV format.
            </p>
            <Button onClick={exportToCSV} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Export Summary CSV
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export Date Range</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
            <Button onClick={exportDateRangeCSV} className="w-full" disabled={!startDate || !endDate}>
              <FileText className="mr-2 h-4 w-4" />
              Export Date Range CSV
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Data Management */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-red-50 p-4">
            <h3 className="font-semibold text-red-900">Danger Zone</h3>
            <p className="mt-2 text-sm text-red-800">
              Permanently delete all students and attendance records. This action cannot be undone.
            </p>
          </div>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete All Data
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all students and attendance records from your account. This action cannot be
              undone and all data will be lost forever.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAllData} disabled={isDeleting} className="bg-red-600">
              {isDeleting ? "Deleting..." : "Yes, Delete Everything"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
