create table if not exists public.diary_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  password_hash text not null default '',
  profile jsonb not null default '{}'::jsonb,
  entries jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.diary_data enable row level security;
revoke all on public.diary_data from anon;
grant select, insert, update, delete on public.diary_data to authenticated;

create policy "read own diary" on public.diary_data
for select to authenticated using ((select auth.uid()) = user_id);
create policy "create own diary" on public.diary_data
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "update own diary" on public.diary_data
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy "delete own diary" on public.diary_data
for delete to authenticated using ((select auth.uid()) = user_id);

alter publication supabase_realtime add table public.diary_data;
