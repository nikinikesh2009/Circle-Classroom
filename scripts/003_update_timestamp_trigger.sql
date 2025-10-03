-- Function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Trigger for students table
drop trigger if exists set_updated_at on public.students;

create trigger set_updated_at
  before update on public.students
  for each row
  execute function public.handle_updated_at();
