"use client"

import type { Student } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, QrCode, Printer } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
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

interface StudentListProps {
  students: Student[]
}

export function StudentList({ students }: StudentListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    const supabase = createClient()

    const { error } = await supabase.from("students").delete().eq("id", deleteId)

    if (error) {
      console.error("Error deleting student:", error)
    } else {
      router.refresh()
    }

    setIsDeleting(false)
    setDeleteId(null)
  }

  if (students.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No students yet. Add your first student to get started.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/students/new">Add Student</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button variant="outline" asChild>
          <Link href="/dashboard/students/print-all">
            <Printer className="mr-2 h-4 w-4" />
            Print All ID Cards
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {students.map((student) => (
          <Card key={student.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
                  {student.photo_url ? (
                    <img
                      src={student.photo_url || "/placeholder.svg"}
                      alt={student.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    student.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{student.name}</h3>
                  <p className="text-sm text-muted-foreground">ID: {student.student_id}</p>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/dashboard/students/${student.id}/edit`}>
                        <Edit className="h-3 w-3" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/dashboard/students/${student.id}/qr`}>
                        <QrCode className="h-3 w-3" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setDeleteId(student.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this student and all their attendance records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
