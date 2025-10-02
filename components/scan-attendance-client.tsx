"use client"

import { useState } from "react"
import type { Student } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QrCode, UserCheck, Calendar } from "lucide-react"
import { toast } from "sonner"
import { QRScanner } from "@/components/qr-scanner"

interface ScanAttendanceClientProps {
  students: Student[]
}

export function ScanAttendanceClient({ students }: ScanAttendanceClientProps) {
  const [showScanner, setShowScanner] = useState(false)
  const [scannedStudents, setScannedStudents] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  const handleScan = async (qrData: string) => {
    try {
      const data = JSON.parse(qrData)

      if (data.type !== "student_id_card") {
        toast.error("Invalid QR code. Please scan a student ID card.")
        return
      }

      // Mark attendance
      const response = await fetch("/api/attendance/mark-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: data.id,
          date: selectedDate,
          status: "present",
        }),
      })

      if (response.ok) {
        setScannedStudents((prev) => [...prev, data.id])
        toast.success(`Attendance marked for ${data.name}`)
      } else {
        toast.error("Failed to mark attendance")
      }
    } catch (error) {
      console.error("Error processing QR code:", error)
      toast.error("Invalid QR code format")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Attendance Date
          </CardTitle>
          <CardDescription>Select the date for attendance marking</CardDescription>
        </CardHeader>
        <CardContent>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full rounded-lg border p-2"
          />
        </CardContent>
      </Card>

      {!showScanner ? (
        <Card>
          <CardContent className="pt-6">
            <Button onClick={() => setShowScanner(true)} size="lg" className="w-full">
              <QrCode className="mr-2 h-5 w-5" />
              Start Scanning Student Cards
            </Button>
          </CardContent>
        </Card>
      ) : (
        <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Scanned Today ({scannedStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {scannedStudents.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No students scanned yet</p>
          ) : (
            <div className="space-y-2">
              {students
                .filter((s) => scannedStudents.includes(s.id))
                .map((student) => (
                  <div key={student.id} className="flex items-center gap-3 rounded-lg border p-3 bg-green-50">
                    {student.photo_url ? (
                      <img
                        src={student.photo_url || "/placeholder.svg"}
                        alt={student.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                        {student.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold">{student.name}</p>
                      <p className="text-sm text-muted-foreground">ID: {student.student_id}</p>
                    </div>
                    <UserCheck className="h-5 w-5 text-green-600" />
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
