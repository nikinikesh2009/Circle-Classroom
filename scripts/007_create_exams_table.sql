-- Create exams table
CREATE TABLE IF NOT EXISTS public.exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_name text NOT NULL,
  subject text NOT NULL,
  exam_date date NOT NULL,
  total_marks integer NOT NULL,
  passing_marks integer NOT NULL,
  class_grade text,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create exam_marks table
CREATE TABLE IF NOT EXISTS public.exam_marks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  marks_obtained integer NOT NULL,
  grade text,
  remarks text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(exam_id, student_id)
);

-- Enable RLS
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_marks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for exams
CREATE POLICY "Teachers can view their own exams"
  ON public.exams FOR SELECT
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can insert their own exams"
  ON public.exams FOR INSERT
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update their own exams"
  ON public.exams FOR UPDATE
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete their own exams"
  ON public.exams FOR DELETE
  USING (auth.uid() = teacher_id);

-- RLS Policies for exam_marks
CREATE POLICY "Teachers can view exam marks for their students"
  ON public.exam_marks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.exams e
      WHERE e.id = exam_marks.exam_id
      AND e.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can insert exam marks"
  ON public.exam_marks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.exams e
      WHERE e.id = exam_marks.exam_id
      AND e.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can update exam marks"
  ON public.exam_marks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.exams e
      WHERE e.id = exam_marks.exam_id
      AND e.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can delete exam marks"
  ON public.exam_marks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.exams e
      WHERE e.id = exam_marks.exam_id
      AND e.teacher_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS exams_teacher_id_idx ON public.exams(teacher_id);
CREATE INDEX IF NOT EXISTS exam_marks_exam_id_idx ON public.exam_marks(exam_id);
CREATE INDEX IF NOT EXISTS exam_marks_student_id_idx ON public.exam_marks(student_id);
