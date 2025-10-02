-- Create teacher profiles table
create table if not exists public.teacher_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  school_name text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.teacher_profiles enable row level security;

-- RLS Policies for teacher profiles
create policy "Teachers can view their own profile"
  on public.teacher_profiles for select
  using (auth.uid() = id);

create policy "Teachers can insert their own profile"
  on public.teacher_profiles for insert
  with check (auth.uid() = id);

create policy "Teachers can update their own profile"
  on public.teacher_profiles for update
  using (auth.uid() = id);

-- Create trigger to auto-create profile on signup
create or replace function public.handle_new_teacher()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.teacher_profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', null)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_teacher_created on auth.users;

create trigger on_teacher_created
  after insert on auth.users
  for each row
  execute function public.handle_new_teacher();
