-- Trackbit bootstrap for multi-schema Supabase setup
-- Safe to re-run: uses IF NOT EXISTS and idempotent policy creation patterns.

create extension if not exists pgcrypto;
create extension if not exists pg_cron with schema extensions;

create schema if not exists trackbit;

-- Keep all trackbit objects in schema search path for helper function execution.
set search_path = trackbit, public;

create or replace function trackbit.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists trackbit.profile (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_path text,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists trackbit.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text not null default '#22c55e',
  icon text not null default 'check',
  category text,
  frequency_type text not null default 'daily' check (frequency_type in ('daily', 'weekdays', 'custom')),
  custom_days smallint[] default null,
  target_count integer not null default 1 check (target_count > 0),
  is_active boolean not null default true,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint habits_custom_days_valid check (
    custom_days is null
    or (
      array_length(custom_days, 1) >= 1
      and not exists (
        select 1
        from unnest(custom_days) as d
        where d < 0 or d > 6
      )
    )
  )
);

create table if not exists trackbit.habit_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null references trackbit.habits(id) on delete cascade,
  completed_on date not null,
  completed_count integer not null default 1 check (completed_count > 0),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (habit_id, completed_on)
);

create index if not exists idx_habit_completions_user_date
  on trackbit.habit_completions(user_id, completed_on desc);

create table if not exists trackbit.habit_streaks (
  habit_id uuid primary key references trackbit.habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  current_streak integer not null default 0 check (current_streak >= 0),
  longest_streak integer not null default 0 check (longest_streak >= 0),
  last_completed_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_habit_streaks_user
  on trackbit.habit_streaks(user_id);

create table if not exists trackbit.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  period_type text not null check (period_type in ('weekly', 'monthly')),
  bucket_start_date date not null,
  due_on date,
  is_done boolean not null default false,
  done_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_tasks_user_period
  on trackbit.tasks(user_id, period_type, bucket_start_date desc);

create table if not exists trackbit.focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_type text not null check (session_type in ('focus', 'short_break', 'long_break')),
  planned_minutes integer not null check (planned_minutes > 0),
  actual_minutes integer not null default 0 check (actual_minutes >= 0),
  distraction_count integer not null default 0 check (distraction_count >= 0),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  is_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_focus_sessions_user_started
  on trackbit.focus_sessions(user_id, started_at desc);

-- Included because your project has a finance tracker page and retention policy requirement.
create table if not exists trackbit.finance_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  description text not null,
  amount numeric(12,2) not null,
  entry_type text not null check (entry_type in ('income', 'expense')),
  category text not null,
  entry_on date not null default current_date,
  is_recurring boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_finance_entries_user_date
  on trackbit.finance_entries(user_id, entry_on desc);

-- Small public-readable table so GitHub Actions can run a low-cost real DB query.
create table if not exists trackbit.keepalive_ping (
  id smallint primary key check (id = 1),
  label text not null default 'trackbit_keepalive',
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

insert into trackbit.keepalive_ping (id)
values (1)
on conflict (id) do nothing;

drop trigger if exists trg_profile_set_updated_at on trackbit.profile;
create trigger trg_profile_set_updated_at
before update on trackbit.profile
for each row execute function trackbit.set_updated_at();

drop trigger if exists trg_habits_set_updated_at on trackbit.habits;
create trigger trg_habits_set_updated_at
before update on trackbit.habits
for each row execute function trackbit.set_updated_at();

drop trigger if exists trg_habit_completions_set_updated_at on trackbit.habit_completions;
create trigger trg_habit_completions_set_updated_at
before update on trackbit.habit_completions
for each row execute function trackbit.set_updated_at();

drop trigger if exists trg_habit_streaks_set_updated_at on trackbit.habit_streaks;
create trigger trg_habit_streaks_set_updated_at
before update on trackbit.habit_streaks
for each row execute function trackbit.set_updated_at();

drop trigger if exists trg_tasks_set_updated_at on trackbit.tasks;
create trigger trg_tasks_set_updated_at
before update on trackbit.tasks
for each row execute function trackbit.set_updated_at();

drop trigger if exists trg_focus_sessions_set_updated_at on trackbit.focus_sessions;
create trigger trg_focus_sessions_set_updated_at
before update on trackbit.focus_sessions
for each row execute function trackbit.set_updated_at();

drop trigger if exists trg_finance_entries_set_updated_at on trackbit.finance_entries;
create trigger trg_finance_entries_set_updated_at
before update on trackbit.finance_entries
for each row execute function trackbit.set_updated_at();

alter table trackbit.profile enable row level security;
alter table trackbit.habits enable row level security;
alter table trackbit.habit_completions enable row level security;
alter table trackbit.habit_streaks enable row level security;
alter table trackbit.tasks enable row level security;
alter table trackbit.focus_sessions enable row level security;
alter table trackbit.finance_entries enable row level security;
alter table trackbit.keepalive_ping enable row level security;

drop policy if exists profile_select_own on trackbit.profile;
create policy profile_select_own on trackbit.profile
for select to authenticated
using (auth.uid() = id);

drop policy if exists profile_insert_own on trackbit.profile;
create policy profile_insert_own on trackbit.profile
for insert to authenticated
with check (auth.uid() = id);

drop policy if exists profile_update_own on trackbit.profile;
create policy profile_update_own on trackbit.profile
for update to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists profile_delete_own on trackbit.profile;
create policy profile_delete_own on trackbit.profile
for delete to authenticated
using (auth.uid() = id);

drop policy if exists habits_select_own on trackbit.habits;
create policy habits_select_own on trackbit.habits
for select to authenticated
using (auth.uid() = user_id);

drop policy if exists habits_insert_own on trackbit.habits;
create policy habits_insert_own on trackbit.habits
for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists habits_update_own on trackbit.habits;
create policy habits_update_own on trackbit.habits
for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists habits_delete_own on trackbit.habits;
create policy habits_delete_own on trackbit.habits
for delete to authenticated
using (auth.uid() = user_id);

drop policy if exists habit_completions_select_own on trackbit.habit_completions;
create policy habit_completions_select_own on trackbit.habit_completions
for select to authenticated
using (auth.uid() = user_id);

drop policy if exists habit_completions_insert_own on trackbit.habit_completions;
create policy habit_completions_insert_own on trackbit.habit_completions
for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists habit_completions_update_own on trackbit.habit_completions;
create policy habit_completions_update_own on trackbit.habit_completions
for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists habit_completions_delete_own on trackbit.habit_completions;
create policy habit_completions_delete_own on trackbit.habit_completions
for delete to authenticated
using (auth.uid() = user_id);

drop policy if exists habit_streaks_select_own on trackbit.habit_streaks;
create policy habit_streaks_select_own on trackbit.habit_streaks
for select to authenticated
using (auth.uid() = user_id);

drop policy if exists habit_streaks_insert_own on trackbit.habit_streaks;
create policy habit_streaks_insert_own on trackbit.habit_streaks
for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists habit_streaks_update_own on trackbit.habit_streaks;
create policy habit_streaks_update_own on trackbit.habit_streaks
for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists habit_streaks_delete_own on trackbit.habit_streaks;
create policy habit_streaks_delete_own on trackbit.habit_streaks
for delete to authenticated
using (auth.uid() = user_id);

drop policy if exists tasks_select_own on trackbit.tasks;
create policy tasks_select_own on trackbit.tasks
for select to authenticated
using (auth.uid() = user_id);

drop policy if exists tasks_insert_own on trackbit.tasks;
create policy tasks_insert_own on trackbit.tasks
for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists tasks_update_own on trackbit.tasks;
create policy tasks_update_own on trackbit.tasks
for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists tasks_delete_own on trackbit.tasks;
create policy tasks_delete_own on trackbit.tasks
for delete to authenticated
using (auth.uid() = user_id);

drop policy if exists focus_sessions_select_own on trackbit.focus_sessions;
create policy focus_sessions_select_own on trackbit.focus_sessions
for select to authenticated
using (auth.uid() = user_id);

drop policy if exists focus_sessions_insert_own on trackbit.focus_sessions;
create policy focus_sessions_insert_own on trackbit.focus_sessions
for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists focus_sessions_update_own on trackbit.focus_sessions;
create policy focus_sessions_update_own on trackbit.focus_sessions
for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists focus_sessions_delete_own on trackbit.focus_sessions;
create policy focus_sessions_delete_own on trackbit.focus_sessions
for delete to authenticated
using (auth.uid() = user_id);

drop policy if exists finance_entries_select_own on trackbit.finance_entries;
create policy finance_entries_select_own on trackbit.finance_entries
for select to authenticated
using (auth.uid() = user_id);

drop policy if exists finance_entries_insert_own on trackbit.finance_entries;
create policy finance_entries_insert_own on trackbit.finance_entries
for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists finance_entries_update_own on trackbit.finance_entries;
create policy finance_entries_update_own on trackbit.finance_entries
for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists finance_entries_delete_own on trackbit.finance_entries;
create policy finance_entries_delete_own on trackbit.finance_entries
for delete to authenticated
using (auth.uid() = user_id);

drop policy if exists keepalive_read_any on trackbit.keepalive_ping;
create policy keepalive_read_any on trackbit.keepalive_ping
for select to anon, authenticated
using (true);

-- Storage bucket for trackbit uploads. Private by default.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'trackbit-assets',
  'trackbit-assets',
  false,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'application/pdf']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists trackbit_assets_select_own on storage.objects;
create policy trackbit_assets_select_own on storage.objects
for select to authenticated
using (bucket_id = 'trackbit-assets' and owner = auth.uid());

drop policy if exists trackbit_assets_insert_own on storage.objects;
create policy trackbit_assets_insert_own on storage.objects
for insert to authenticated
with check (bucket_id = 'trackbit-assets' and owner = auth.uid());

drop policy if exists trackbit_assets_update_own on storage.objects;
create policy trackbit_assets_update_own on storage.objects
for update to authenticated
using (bucket_id = 'trackbit-assets' and owner = auth.uid())
with check (bucket_id = 'trackbit-assets' and owner = auth.uid());

drop policy if exists trackbit_assets_delete_own on storage.objects;
create policy trackbit_assets_delete_own on storage.objects
for delete to authenticated
using (bucket_id = 'trackbit-assets' and owner = auth.uid());

create or replace function trackbit.run_retention_cleanup()
returns void
language plpgsql
security definer
set search_path = trackbit, public
as $$
begin
  -- 1) Focus sessions older than 6 months.
  delete from trackbit.focus_sessions
  where started_at < now() - interval '6 months';

  -- 2) Completed tasks older than 3 months.
  delete from trackbit.tasks
  where is_done = true
    and done_at is not null
    and done_at < now() - interval '3 months';

  -- 3) Finance entries are kept for 12+ months by requirement, so no deletion here.
end;
$$;

revoke all on function trackbit.run_retention_cleanup() from public, anon, authenticated;
grant execute on function trackbit.run_retention_cleanup() to service_role;
grant execute on function trackbit.run_retention_cleanup() to postgres;

do $$
begin
  if exists (select 1 from cron.job where jobname = 'trackbit_retention_cleanup') then
    perform cron.unschedule('trackbit_retention_cleanup');
  end if;

  perform cron.schedule(
    'trackbit_retention_cleanup',
    '17 3 * * *',
    'select trackbit.run_retention_cleanup();'
  );
end
$$;
