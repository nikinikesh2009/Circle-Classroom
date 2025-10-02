-- Create attendance records table
create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  teacher_id uuid not null references auth.users(id) on delete cascade,
  date date not null default current_date,
  status text not null check (status in ('present', 'absent', 'late', 'excused')),
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(student_id, date)
);

-- Enable RLS
alter table public.attendance enable row level security;

-- RLS Policies for attendance
create policy "Teachers can view attendance for their students"
  on public.attendance for select
  using (auth.uid() = teacher_id);

create policy "Teachers can insert attendance for their students"
  on public.attendance for insert
  with check (auth.uid() = teacher_id);

create policy "Teachers can update attendance for their students"
  on public.attendance for update
  using (auth.uid() = teacher_id);

create policy "Teachers can delete attendance for their students"
  on public.attendance for delete
  using (auth.uid() = teacher_id);

-- Create indexes for faster queries
create index if not exists attendance_student_id_idx on public.attendance(student_id);
create index if not exists attendance_teacher_id_idx on public.attendance(teacher_id);
create index if not exists attendance_date_idx on public.attendance(date);
