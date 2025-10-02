"use client"

import type React from "react"

import type { Student } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface StudentFormProps {
  student?: Student
}

export function StudentForm({ student }: StudentFormProps) {
  const [name, setName] = useState(student?.name || "")
  const [studentId, setStudentId] = useState(student?.student_id || "")
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(student?.photo_url || null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

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
      let photoUrl = student?.photo_url || null

      // Upload photo if provided
      if (photoFile) {
        const fileExt = photoFile.name.split(".").pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage.from("student-photos").upload(fileName, photoFile)

        if (uploadError) throw uploadError

        const {
          data: { publicUrl },
        } = supabase.storage.from("student-photos").getPublicUrl(fileName)
        photoUrl = publicUrl
      }

      if (student) {
        // Update existing student
        const { error: updateError } = await supabase
          .from("students")
          .update({
            name,
            student_id: studentId,
            photo_url: photoUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", student.id)

        if (updateError) throw updateError
      } else {
        // Create new student
        const { error: insertError } = await supabase.from("students").insert({
          teacher_id: user.id,
          name,
          student_id: studentId,
          photo_url: photoUrl,
        })

        if (insertError) throw insertError
      }

      router.push("/dashboard/students")
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
            <Label htmlFor="name">Student Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="studentId">Student ID</Label>
            <Input
              id="studentId"
              type="text"
              placeholder="S12345"
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Student Photo (Optional)</Label>
            <div className="flex items-center gap-4">
              {photoPreview && (
                <img
                  src={photoPreview || "/placeholder.svg"}
                  alt="Preview"
                  className="h-20 w-20 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <Input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} />
                <p className="mt-1 text-xs text-muted-foreground">Upload a photo for the student ID card</p>
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : student ? "Update Student" : "Add Student"}
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
