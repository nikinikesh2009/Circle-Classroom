"use client"

import type { Student, Attendance } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"

interface AttendanceTrackerProps {
  students: Student[]
  attendanceRecords: Attendance[]
  selectedDate: string
}

type AttendanceStatus = "present" | "absent" | "late" | "excused"

export function AttendanceTracker({ students, attendanceRecords, selectedDate }: AttendanceTrackerProps) {
  const [date, setDate] = useState(selectedDate)
  const [attendanceMap, setAttendanceMap] = useState<Record<string, { status: AttendanceStatus; notes: string }>>(
    () => {
      const map: Record<string, { status: AttendanceStatus; notes: string }> = {}
      attendanceRecords.forEach((record) => {
        map[record.student_id] = {
          status: record.status,
          notes: record.notes || "",
        }
      })
      return map
    },
  )
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        status,
        notes: prev[studentId]?.notes || "",
      },
    }))
  }

  const handleNotesChange = (studentId: string, notes: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        status: prev[studentId]?.status || "present",
        notes,
      },
    }))
  }

  const handleDateChange = () => {
    router.push(`/dashboard/attendance?date=${date}`)
  }

  const handleSave = async () => {
    setIsSaving(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    try {
      // Delete existing attendance for this date
      await supabase.from("attendance").delete().eq("teacher_id", user.id).eq("date", selectedDate)

      // Insert new attendance records
      const records = Object.entries(attendanceMap).map(([studentId, { status, notes }]) => ({
        student_id: studentId,
        teacher_id: user.id,
        date: selectedDate,
        status,
        notes: notes || null,
      }))

      const { error } = await supabase.from("attendance").insert(records)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error saving attendance:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleMarkAll = (status: AttendanceStatus) => {
    const newMap: Record<string, { status: AttendanceStatus; notes: string }> = {}
    students.forEach((student) => {
      newMap[student.id] = {
        status,
        notes: attendanceMap[student.id]?.notes || "",
      }
    })
    setAttendanceMap(newMap)
  }

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "absent":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "late":
        return <Clock className="h-5 w-5 text-yellow-600" />
      case "excused":
        return <AlertCircle className="h-5 w-5 text-blue-600" />
    }
  }

  if (students.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-center text-muted-foreground">
            No students in your roster. Add students first to track attendance.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-none bg-gradient-to-r from-blue-50 to-purple-50 shadow-md">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Select Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="flex items-end">
              <Button onClick={handleDateChange} className="bg-gradient-to-r from-blue-600 to-purple-600">
                Load Date
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mark Attendance - {new Date(selectedDate).toLocaleDateString()}
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleMarkAll("present")}
                className="hover:bg-green-50"
              >
                Mark All Present
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleMarkAll("absent")} className="hover:bg-red-50">
                Mark All Absent
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.map((student) => {
              const attendance = attendanceMap[student.id]
              const currentStatus = attendance?.status || "present"

              return (
                <div
                  key={student.id}
                  className="animate-fade-in rounded-lg border bg-gradient-to-r from-white to-gray-50 p-4 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-0.5">
                      {student.photo_url ? (
                        <img
                          src={student.photo_url || "/placeholder.svg"}
                          alt={student.name}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-lg font-bold text-blue-600">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">ID: {student.student_id}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant={currentStatus === "present" ? "default" : "outline"}
                          onClick={() => handleStatusChange(student.id, "present")}
                          className={
                            currentStatus === "present"
                              ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                              : "hover:bg-green-50"
                          }
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Present
                        </Button>
                        <Button
                          size="sm"
                          variant={currentStatus === "absent" ? "default" : "outline"}
                          onClick={() => handleStatusChange(student.id, "absent")}
                          className={
                            currentStatus === "absent"
                              ? "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
                              : "hover:bg-red-50"
                          }
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Absent
                        </Button>
                        <Button
                          size="sm"
                          variant={currentStatus === "late" ? "default" : "outline"}
                          onClick={() => handleStatusChange(student.id, "late")}
                          className={
                            currentStatus === "late"
                              ? "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                              : "hover:bg-yellow-50"
                          }
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          Late
                        </Button>
                        <Button
                          size="sm"
                          variant={currentStatus === "excused" ? "default" : "outline"}
                          onClick={() => handleStatusChange(student.id, "excused")}
                          className={
                            currentStatus === "excused"
                              ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                              : "hover:bg-blue-50"
                          }
                        >
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Excused
                        </Button>
                      </div>
                      <div>
                        <Label htmlFor={`notes-${student.id}`} className="text-xs">
                          Notes (Optional)
                        </Label>
                        <Textarea
                          id={`notes-${student.id}`}
                          placeholder="Add notes about this student's attendance..."
                          value={attendance?.notes || ""}
                          onChange={(e) => handleNotesChange(student.id, e.target.value)}
                          className="mt-1"
                          rows={2}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      {getStatusIcon(currentStatus)}
                      <span className="text-xs font-medium capitalize">{currentStatus}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isSaving ? "Saving..." : "Save Attendance"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
