-- MeloStretch minimal cross-device data store.
-- Run this entire file once in Supabase SQL Editor.

create table if not exists public.user_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  favorites jsonb not null default '[]'::jsonb,
  logs jsonb not null default '[]'::jsonb,
  ai_exercises jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_data enable row level security;

revoke all on table public.user_data from anon;
grant select, insert, update, delete on table public.user_data to authenticated;

drop policy if exists "Users can view own MeloStretch data" on public.user_data;
create policy "Users can view own MeloStretch data"
on public.user_data for select to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users can insert own MeloStretch data" on public.user_data;
create policy "Users can insert own MeloStretch data"
on public.user_data for insert to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users can update own MeloStretch data" on public.user_data;
create policy "Users can update own MeloStretch data"
on public.user_data for update to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users can delete own MeloStretch data" on public.user_data;
create policy "Users can delete own MeloStretch data"
on public.user_data for delete to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
