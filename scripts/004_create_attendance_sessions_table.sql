-- Create attendance sessions table for QR code based attendance
create table if not exists public.attendance_sessions (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references auth.users(id) on delete cascade,
  session_name text not null,
  date date not null default current_date,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  qr_code_data text not null unique,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.attendance_sessions enable row level security;

-- RLS Policies for attendance sessions
create policy "Teachers can view their own sessions"
  on public.attendance_sessions for select
  using (auth.uid() = teacher_id);

create policy "Teachers can create sessions"
  on public.attendance_sessions for insert
  with check (auth.uid() = teacher_id);

create policy "Teachers can update their own sessions"
  on public.attendance_sessions for update
  using (auth.uid() = teacher_id);

create policy "Teachers can delete their own sessions"
  on public.attendance_sessions for delete
  using (auth.uid() = teacher_id);

-- Allow anyone to read active sessions (for QR scanning)
create policy "Anyone can view active sessions for scanning"
  on public.attendance_sessions for select
  using (is_active = true);

-- Create indexes
create index if not exists attendance_sessions_teacher_id_idx on public.attendance_sessions(teacher_id);
create index if not exists attendance_sessions_date_idx on public.attendance_sessions(date);
create index if not exists attendance_sessions_qr_code_idx on public.attendance_sessions(qr_code_data);
