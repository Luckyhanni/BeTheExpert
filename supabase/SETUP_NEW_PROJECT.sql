-- BE THE EXPERT: Einrichtung eines neuen, leeren Supabase-Projekts.
-- Einmal im SQL Editor ausfuehren. Bestehende Projekte nutzen die einzelnen Migrationen.
begin;

create table if not exists public.sports (
  id text primary key,
  display_name text not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 32),
  career_level integer not null default 1 check (career_level > 0),
  career_xp integer not null default 0 check (career_xp >= 0),
  expert_rating integer not null default 1000 check (expert_rating >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sports enable row level security;
alter table public.profiles enable row level security;

create policy "sports are readable"
on public.sports for select
using (true);

create policy "users read their own profile"
on public.profiles for select
using ((select auth.uid()) = user_id);

create policy "users create their own profile"
on public.profiles for insert
with check ((select auth.uid()) = user_id);

create policy "users update their own profile"
on public.profiles for update
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

insert into public.sports (id, display_name, is_active)
values ('football', 'Fußball', true)
on conflict (id) do update
set display_name = excluded.display_name,
    is_active = excluded.is_active;


-- Account data is private. Device-local guest progress is never assigned automatically.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant insert (user_id, display_name), update (user_id, display_name) on public.profiles to authenticated;

create table public.account_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  league_id text not null check (char_length(league_id) between 1 and 80)
);
create table public.career_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  pack_id text not null check (char_length(pack_id) between 1 and 160),
  best_percent double precision not null check (best_percent >= 0 and best_percent <= 100),
  passed boolean not null generated always as (best_percent >= 80) stored,
  updated_at timestamptz not null default now(),
  primary key (user_id, pack_id)
);
alter table public.account_settings enable row level security;
alter table public.career_progress enable row level security;
create policy "own settings select" on public.account_settings for select to authenticated using ((select auth.uid()) = user_id);
create policy "own settings insert" on public.account_settings for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "own settings update" on public.account_settings for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own progress select" on public.career_progress for select to authenticated using ((select auth.uid()) = user_id);
revoke all on public.account_settings, public.career_progress from anon, authenticated;
grant select, insert, update on public.account_settings to authenticated;
grant select on public.career_progress to authenticated;

-- Atomic best score merge: concurrent devices cannot overwrite a better result.
-- Explicit owner rejects a request that crossed an account switch.
create function public.save_career_result(p_user_id uuid, p_pack_id text, p_percent double precision)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if auth.uid() is null or p_user_id is distinct from auth.uid() then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if p_percent is null or not (p_percent >= 0 and p_percent <= 100) then
    raise exception 'Invalid score' using errcode = '22023';
  end if;
  insert into public.career_progress (user_id, pack_id, best_percent)
  values (auth.uid(), p_pack_id, p_percent)
  on conflict (user_id, pack_id) do update
  set best_percent = greatest(public.career_progress.best_percent, excluded.best_percent), updated_at = now();
end;
$$;
revoke all on function public.save_career_result(uuid, text, double precision) from public, anon;
grant execute on function public.save_career_result(uuid, text, double precision) to authenticated;


commit;
