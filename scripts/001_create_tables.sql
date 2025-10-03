-- Create classrooms table (profiles for teachers)
create table if not exists public.classrooms (
  id uuid primary key references auth.users(id) on delete cascade,
  classroom_name text not null,
  email text not null,
  school_name text not null,
  logo_url text,
  created_at timestamptz default now()
);

-- Create students table
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.classrooms(id) on delete cascade,
  name text not null,
  email text not null,
  grade text not null,
  attendance numeric default 100,
  last_active text,
  status text not null check (status in ('active', 'inactive')) default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create attendance table
create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.classrooms(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  student_name text not null,
  date text not null,
  status text not null check (status in ('present', 'absent', 'late')),
  created_at timestamptz default now()
);

-- Create indexes for better query performance
create index if not exists idx_students_teacher_id on public.students(teacher_id);
create index if not exists idx_students_status on public.students(status);
create index if not exists idx_attendance_teacher_id on public.attendance(teacher_id);
create index if not exists idx_attendance_student_id on public.attendance(student_id);
create index if not exists idx_attendance_date on public.attendance(date);

-- Enable Row Level Security
alter table public.classrooms enable row level security;
alter table public.students enable row level security;
alter table public.attendance enable row level security;

-- RLS Policies for classrooms
create policy "Users can view their own classroom"
  on public.classrooms for select
  using (auth.uid() = id);

create policy "Users can insert their own classroom"
  on public.classrooms for insert
  with check (auth.uid() = id);

create policy "Users can update their own classroom"
  on public.classrooms for update
  using (auth.uid() = id);

create policy "Users can delete their own classroom"
  on public.classrooms for delete
  using (auth.uid() = id);

-- RLS Policies for students
create policy "Teachers can view their own students"
  on public.students for select
  using (auth.uid() = teacher_id);

create policy "Teachers can insert their own students"
  on public.students for insert
  with check (auth.uid() = teacher_id);

create policy "Teachers can update their own students"
  on public.students for update
  using (auth.uid() = teacher_id);

create policy "Teachers can delete their own students"
  on public.students for delete
  using (auth.uid() = teacher_id);

-- RLS Policies for attendance
create policy "Teachers can view their own attendance records"
  on public.attendance for select
  using (auth.uid() = teacher_id);

create policy "Teachers can insert their own attendance records"
  on public.attendance for insert
  with check (auth.uid() = teacher_id);

create policy "Teachers can update their own attendance records"
  on public.attendance for update
  using (auth.uid() = teacher_id);

create policy "Teachers can delete their own attendance records"
  on public.attendance for delete
  using (auth.uid() = teacher_id);
