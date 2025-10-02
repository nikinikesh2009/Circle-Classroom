"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Attendance, Student } from "@/lib/types"

export function RecentActivity() {
  const [recentRecords, setRecentRecords] = useState<Array<Attendance & { student: Student }>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRecentActivity = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Fetch recent attendance records
      const { data: attendance } = await supabase
        .from("attendance")
        .select("*")
        .eq("teacher_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5)

      if (attendance) {
        // Fetch student details for each record
        const recordsWithStudents = await Promise.all(
          attendance.map(async (record) => {
            const { data: student } = await supabase.from("students").select("*").eq("id", record.student_id).single()

            return { ...record, student: student! }
          }),
        )

        setRecentRecords(recordsWithStudents.filter((r) => r.student))
      }

      setIsLoading(false)
    }

    fetchRecentActivity()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "text-green-600"
      case "absent":
        return "text-red-600"
      case "late":
        return "text-yellow-600"
      case "excused":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : recentRecords.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity to display.</p>
        ) : (
          <div className="space-y-3">
            {recentRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div>
                  <p className="font-medium">{record.student.name}</p>
                  <p className="text-sm text-muted-foreground">{new Date(record.date).toLocaleDateString()}</p>
                </div>
                <span className={`text-sm font-semibold capitalize ${getStatusColor(record.status)}`}>
                  {record.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
