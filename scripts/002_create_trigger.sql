-- Function to auto-create classroom profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.classrooms (id, classroom_name, email, school_name, logo_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'classroom_name', 'My Classroom'),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'school_name', ''),
    coalesce(new.raw_user_meta_data ->> 'logo_url', null)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Trigger to call the function on user creation
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
