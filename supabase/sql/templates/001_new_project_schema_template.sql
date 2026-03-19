-- Copy this file and replace {project_name} for each new app schema.

create schema if not exists {project_name};

set search_path = {project_name}, public;

create or replace function {project_name}.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists {project_name}.profile (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_profile_set_updated_at on {project_name}.profile;
create trigger trg_profile_set_updated_at
before update on {project_name}.profile
for each row execute function {project_name}.set_updated_at();

alter table {project_name}.profile enable row level security;

drop policy if exists profile_select_own on {project_name}.profile;
create policy profile_select_own on {project_name}.profile
for select to authenticated
using (auth.uid() = id);

drop policy if exists profile_insert_own on {project_name}.profile;
create policy profile_insert_own on {project_name}.profile
for insert to authenticated
with check (auth.uid() = id);

drop policy if exists profile_update_own on {project_name}.profile;
create policy profile_update_own on {project_name}.profile
for update to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists profile_delete_own on {project_name}.profile;
create policy profile_delete_own on {project_name}.profile
for delete to authenticated
using (auth.uid() = id);
