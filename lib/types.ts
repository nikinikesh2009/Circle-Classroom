export interface Student {
  id: string
  teacher_id: string
  name: string
  student_id: string
  photo_url: string | null
  created_at: string
  updated_at: string
}

export interface Attendance {
  id: string
  student_id: string
  teacher_id: string
  date: string
  status: "present" | "absent" | "late" | "excused"
  notes: string | null
  created_at: string
  updated_at: string
}

export interface TeacherProfile {
  id: string
  full_name: string | null
  school_name: string | null
  created_at: string
  updated_at: string
}
