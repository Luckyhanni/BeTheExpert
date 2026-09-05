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
