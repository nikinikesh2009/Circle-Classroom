-- Add additional student fields for ID card
ALTER TABLE public.students
ADD COLUMN IF NOT EXISTS date_of_birth date,
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS blood_group text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS guardian_name text,
ADD COLUMN IF NOT EXISTS guardian_contact text,
ADD COLUMN IF NOT EXISTS guardian_email text,
ADD COLUMN IF NOT EXISTS emergency_contact text,
ADD COLUMN IF NOT EXISTS medical_notes text,
ADD COLUMN IF NOT EXISTS previous_school text,
ADD COLUMN IF NOT EXISTS admission_date date default current_date,
ADD COLUMN IF NOT EXISTS class_grade text,
ADD COLUMN IF NOT EXISTS section text,
ADD COLUMN IF NOT EXISTS roll_number text,
ADD COLUMN IF NOT EXISTS qr_code_data text;

-- Create index for QR code lookups
CREATE INDEX IF NOT EXISTS students_qr_code_idx ON public.students(qr_code_data);
