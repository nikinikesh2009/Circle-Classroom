-- Create timetable table
CREATE TABLE IF NOT EXISTS public.timetable (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  class_name text NOT NULL,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  room text,
  teacher_name text,
  color text DEFAULT '#3b82f6',
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.timetable ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Teachers can view their own timetable"
  ON public.timetable FOR SELECT
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can insert their own timetable"
  ON public.timetable FOR INSERT
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update their own timetable"
  ON public.timetable FOR UPDATE
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete their own timetable"
  ON public.timetable FOR DELETE
  USING (auth.uid() = teacher_id);

-- Create index
CREATE INDEX IF NOT EXISTS timetable_teacher_id_idx ON public.timetable(teacher_id);
CREATE INDEX IF NOT EXISTS timetable_day_idx ON public.timetable(day_of_week);
