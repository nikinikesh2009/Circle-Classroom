-- Create students table
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  student_id text not null,
  photo_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(teacher_id, student_id)
);

-- Enable RLS
alter table public.students enable row level security;

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

-- Create index for faster queries
create index if not exists students_teacher_id_idx on public.students(teacher_id);
