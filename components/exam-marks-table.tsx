"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Exam } from "@/lib/types"

interface ExamMarksTableProps {
  examMarks: any[]
  exam: Exam
}

export function ExamMarksTable({ examMarks, exam }: ExamMarksTableProps) {
  const getGradeColor = (grade: string | null) => {
    if (!grade) return "bg-gray-100 text-gray-700"
    switch (grade.toUpperCase()) {
      case "A+":
      case "A":
        return "bg-green-100 text-green-700"
      case "B+":
      case "B":
        return "bg-blue-100 text-blue-700"
      case "C+":
      case "C":
        return "bg-yellow-100 text-yellow-700"
      case "D":
        return "bg-orange-100 text-orange-700"
      case "F":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getPercentage = (marks: number) => {
    return ((marks / exam.total_marks) * 100).toFixed(1)
  }

  if (!examMarks || examMarks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No marks have been entered yet.</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Student ID</TableHead>
            <TableHead>Class</TableHead>
            <TableHead className="text-right">Marks</TableHead>
            <TableHead className="text-right">Percentage</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {examMarks.map((mark) => {
            const student = mark.students
            const percentage = getPercentage(mark.marks_obtained)
            const passed = mark.marks_obtained >= exam.passing_marks

            return (
              <TableRow key={mark.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={student.photo_url || "/placeholder.svg"} alt={student.name} />
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{student.name}</span>
                  </div>
                </TableCell>
                <TableCell>{student.student_id}</TableCell>
                <TableCell>
                  {student.class_grade && student.section
                    ? `${student.class_grade} ${student.section}`
                    : student.class_grade || "-"}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {mark.marks_obtained} / {exam.total_marks}
                </TableCell>
                <TableCell className="text-right">{percentage}%</TableCell>
                <TableCell>{mark.grade && <Badge className={getGradeColor(mark.grade)}>{mark.grade}</Badge>}</TableCell>
                <TableCell>
                  <Badge variant={passed ? "default" : "destructive"}>{passed ? "Pass" : "Fail"}</Badge>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
