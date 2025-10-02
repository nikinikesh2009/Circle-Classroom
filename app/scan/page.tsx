"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Loader2, QrCode } from "lucide-react"
import type { Student } from "@/lib/types"

function ScanContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const qrCode = searchParams.get("code")

  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  useEffect(() => {
    // In a real app, you'd fetch students based on the QR code's teacher
    // For now, we'll need to get the teacher ID from the QR code data
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    // This is a simplified version - in production, you'd decode the QR code
    // to get the teacher ID and fetch their students
    try {
      const response = await fetch("/api/students")
      const data = await response.json()
      if (data.students) {
        setStudents(data.students)
      }
    } catch (error) {
      console.error("Error fetching students:", error)
    }
  }

  const handleMarkAttendance = async () => {
    if (!selectedStudent || !qrCode) {
      setStatus("error")
      setMessage("Please select a student")
      return
    }

    setIsLoading(true)
    setStatus("idle")

    try {
      const response = await fetch("/api/attendance/mark-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qrCodeData: qrCode,
          studentId: selectedStudent,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage(data.message || "Attendance marked successfully!")
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to mark attendance")
      }
    } catch (error) {
      setStatus("error")
      setMessage("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!qrCode) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="mx-auto h-12 w-12 text-red-500" />
              <h2 className="mt-4 text-xl font-semibold">Invalid QR Code</h2>
              <p className="mt-2 text-muted-foreground">This QR code is invalid or has expired.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-center text-transparent">
            <QrCode className="h-6 w-6 text-blue-600" />
            Mark Your Attendance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === "idle" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="student">Select Your Name</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger id="student">
                    <SelectValue placeholder="Choose your name..." />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} ({student.student_id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleMarkAttendance}
                disabled={isLoading || !selectedStudent}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Marking Attendance...
                  </>
                ) : (
                  "Mark Attendance"
                )}
              </Button>
            </>
          )}

          {status === "success" && (
            <div className="text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h3 className="mt-4 text-xl font-semibold text-green-700">Success!</h3>
              <p className="mt-2 text-muted-foreground">{message}</p>
              <Button
                onClick={() => {
                  setStatus("idle")
                  setSelectedStudent("")
                }}
                variant="outline"
                className="mt-4"
              >
                Mark Another Student
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <XCircle className="mx-auto h-16 w-16 text-red-500" />
              <h3 className="mt-4 text-xl font-semibold text-red-700">Error</h3>
              <p className="mt-2 text-muted-foreground">{message}</p>
              <Button
                onClick={() => {
                  setStatus("idle")
                  setMessage("")
                }}
                variant="outline"
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function ScanPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <ScanContent />
    </Suspense>
  )
}
