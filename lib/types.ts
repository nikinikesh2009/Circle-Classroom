export interface Student {
  id: string
  teacher_id: string
  name: string
  student_id: string
  photo_url: string | null
  date_of_birth: string | null
  gender: string | null
  blood_group: string | null
  address: string | null
  guardian_name: string | null
  guardian_contact: string | null
  guardian_email: string | null
  emergency_contact: string | null
  medical_notes: string | null
  previous_school: string | null
  admission_date: string | null
  class_grade: string | null
  section: string | null
  roll_number: string | null
  qr_code_data: string | null
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

export interface AttendanceSession {
  id: string
  teacher_id: string
  session_name: string
  date: string
  start_time: string
  end_time: string
  qr_code_data: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Timetable {
  id: string
  teacher_id: string
  subject: string
  class_name: string
  day_of_week: number
  start_time: string
  end_time: string
  room: string | null
  teacher_name: string | null
  color: string
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Exam {
  id: string
  teacher_id: string
  exam_name: string
  subject: string
  exam_date: string
  total_marks: number
  passing_marks: number
  class_grade: string | null
  description: string | null
  created_at: string
  updated_at: string
}

export interface ExamMark {
  id: string
  exam_id: string
  student_id: string
  marks_obtained: number
  grade: string | null
  remarks: string | null
  created_at: string
  updated_at: string
}
