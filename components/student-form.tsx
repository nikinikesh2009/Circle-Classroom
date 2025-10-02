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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface StudentFormProps {
  student?: Student
}

export function StudentForm({ student }: StudentFormProps) {
  const [name, setName] = useState(student?.name || "")
  const [studentId, setStudentId] = useState(student?.student_id || "")
  const [dateOfBirth, setDateOfBirth] = useState(student?.date_of_birth || "")
  const [gender, setGender] = useState(student?.gender || "")
  const [bloodGroup, setBloodGroup] = useState(student?.blood_group || "")
  const [address, setAddress] = useState(student?.address || "")
  const [guardianName, setGuardianName] = useState(student?.guardian_name || "")
  const [guardianContact, setGuardianContact] = useState(student?.guardian_contact || "")
  const [guardianEmail, setGuardianEmail] = useState(student?.guardian_email || "")
  const [emergencyContact, setEmergencyContact] = useState(student?.emergency_contact || "")
  const [classGrade, setClassGrade] = useState(student?.class_grade || "")
  const [section, setSection] = useState(student?.section || "")
  const [rollNumber, setRollNumber] = useState(student?.roll_number || "")
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

      const studentData = {
        name,
        student_id: studentId,
        photo_url: photoUrl,
        date_of_birth: dateOfBirth || null,
        gender: gender || null,
        blood_group: bloodGroup || null,
        address: address || null,
        guardian_name: guardianName || null,
        guardian_contact: guardianContact || null,
        guardian_email: guardianEmail || null,
        emergency_contact: emergencyContact || null,
        class_grade: classGrade || null,
        section: section || null,
        roll_number: rollNumber || null,
        updated_at: new Date().toISOString(),
      }

      if (student) {
        // Update existing student
        const { error: updateError } = await supabase.from("students").update(studentData).eq("id", student.id)

        if (updateError) throw updateError
      } else {
        // Create new student
        const { error: insertError } = await supabase.from("students").insert({
          teacher_id: user.id,
          ...studentData,
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
    <Card className="max-w-4xl">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Student Name *</Label>
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
                <Label htmlFor="studentId">Student ID *</Label>
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
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select value={bloodGroup} onValueChange={setBloodGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">Student Photo</Label>
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

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Enter full address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Academic Information</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="classGrade">Class</Label>
                <Input
                  id="classGrade"
                  type="text"
                  placeholder="e.g., 10th"
                  value={classGrade}
                  onChange={(e) => setClassGrade(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Input
                  id="section"
                  type="text"
                  placeholder="e.g., A"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input
                  id="rollNumber"
                  type="text"
                  placeholder="e.g., 15"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Guardian Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="guardianName">Guardian Name</Label>
                <Input
                  id="guardianName"
                  type="text"
                  placeholder="Parent/Guardian name"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guardianContact">Guardian Contact</Label>
                <Input
                  id="guardianContact"
                  type="tel"
                  placeholder="+1234567890"
                  value={guardianContact}
                  onChange={(e) => setGuardianContact(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guardianEmail">Guardian Email</Label>
                <Input
                  id="guardianEmail"
                  type="email"
                  placeholder="parent@example.com"
                  value={guardianEmail}
                  onChange={(e) => setGuardianEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  type="tel"
                  placeholder="+1234567890"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                />
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
