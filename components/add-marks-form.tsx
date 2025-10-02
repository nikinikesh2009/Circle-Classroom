"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { Exam, Student } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AddMarksFormProps {
  exam: Exam
  students: Student[]
}

export function AddMarksForm({ exam, students }: AddMarksFormProps) {
  const [selectedStudentId, setSelectedStudentId] = useState("")
  const [marksObtained, setMarksObtained] = useState("")
  const [grade, setGrade] = useState("")
  const [remarks, setRemarks] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const selectedStudent = students.find((s) => s.id === selectedStudentId)

  const calculateGrade = (marks: number) => {
    const percentage = (marks / exam.total_marks) * 100
    if (percentage >= 90) return "A+"
    if (percentage >= 80) return "A"
    if (percentage >= 70) return "B+"
    if (percentage >= 60) return "B"
    if (percentage >= 50) return "C+"
    if (percentage >= 40) return "C"
    if (percentage >= 33) return "D"
    return "F"
  }

  const handleMarksChange = (value: string) => {
    setMarksObtained(value)
    if (value && !isNaN(Number(value))) {
      const calculatedGrade = calculateGrade(Number(value))
      setGrade(calculatedGrade)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!selectedStudentId) {
      setError("Please select a student")
      setIsLoading(false)
      return
    }

    const marks = Number.parseInt(marksObtained)
    if (marks > exam.total_marks) {
      setError(`Marks cannot exceed ${exam.total_marks}`)
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    try {
      const { error: insertError } = await supabase.from("exam_marks").insert({
        exam_id: exam.id,
        student_id: selectedStudentId,
        marks_obtained: marks,
        grade: grade || null,
        remarks: remarks || null,
      })

      if (insertError) throw insertError

      router.push(`/dashboard/exams/${exam.id}`)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (students.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">All students have been graded for this exam.</p>
          <Button className="mt-4" onClick={() => router.back()}>
            Go Back
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="student">Select Student *</Label>
            <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    <div className="flex items-center gap-2">
                      <span>{student.name}</span>
                      <span className="text-muted-foreground text-sm">({student.student_id})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStudent && (
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedStudent.photo_url || "/placeholder.svg"} alt={selectedStudent.name} />
                    <AvatarFallback>{selectedStudent.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedStudent.name}</h3>
                    <p className="text-sm text-muted-foreground">ID: {selectedStudent.student_id}</p>
                    {selectedStudent.class_grade && (
                      <p className="text-sm text-muted-foreground">
                        Class: {selectedStudent.class_grade} {selectedStudent.section}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="marks">Marks Obtained *</Label>
              <Input
                id="marks"
                type="number"
                placeholder="0"
                required
                min="0"
                max={exam.total_marks}
                value={marksObtained}
                onChange={(e) => handleMarksChange(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Out of {exam.total_marks}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Input
                id="grade"
                type="text"
                placeholder="Auto-calculated"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Automatically calculated</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              placeholder="Additional comments about performance..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Marks"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
