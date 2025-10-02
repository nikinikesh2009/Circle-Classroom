"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { Exam } from "@/lib/types"

interface ExamFormProps {
  exam?: Exam
}

export function ExamForm({ exam }: ExamFormProps) {
  const [examName, setExamName] = useState(exam?.exam_name || "")
  const [subject, setSubject] = useState(exam?.subject || "")
  const [examDate, setExamDate] = useState(exam?.exam_date || "")
  const [totalMarks, setTotalMarks] = useState(exam?.total_marks?.toString() || "")
  const [passingMarks, setPassingMarks] = useState(exam?.passing_marks?.toString() || "")
  const [classGrade, setClassGrade] = useState(exam?.class_grade || "")
  const [description, setDescription] = useState(exam?.description || "")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError("You must be logged in")
      setIsLoading(false)
      return
    }

    try {
      const examData = {
        exam_name: examName,
        subject,
        exam_date: examDate,
        total_marks: Number.parseInt(totalMarks),
        passing_marks: Number.parseInt(passingMarks),
        class_grade: classGrade || null,
        description: description || null,
        updated_at: new Date().toISOString(),
      }

      if (exam) {
        const { error: updateError } = await supabase.from("exams").update(examData).eq("id", exam.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase.from("exams").insert({
          teacher_id: user.id,
          ...examData,
        })

        if (insertError) throw insertError
      }

      router.push("/dashboard/exams")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="examName">Exam Name *</Label>
            <Input
              id="examName"
              type="text"
              placeholder="e.g., Mid-Term Exam"
              required
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                type="text"
                placeholder="e.g., Mathematics"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="examDate">Exam Date *</Label>
              <Input
                id="examDate"
                type="date"
                required
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="totalMarks">Total Marks *</Label>
              <Input
                id="totalMarks"
                type="number"
                placeholder="100"
                required
                min="1"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passingMarks">Passing Marks *</Label>
              <Input
                id="passingMarks"
                type="number"
                placeholder="40"
                required
                min="1"
                value={passingMarks}
                onChange={(e) => setPassingMarks(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="classGrade">Class</Label>
              <Input
                id="classGrade"
                type="text"
                placeholder="e.g., 10th A"
                value={classGrade}
                onChange={(e) => setClassGrade(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Additional notes about the exam..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : exam ? "Update Exam" : "Create Exam"}
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
