create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.grant_admin_for_owner()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.email_confirmed_at is not null and lower(new.email) = 'mohdahadkhan76@gmail.com' then
    insert into public.user_roles (user_id, role) values (new.id, 'admin') on conflict do nothing;
  end if;
  return new;
end; $$;

create trigger on_auth_user_created_grant_admin after insert on auth.users
for each row execute function public.grant_admin_for_owner();
create trigger on_auth_user_confirmed_grant_admin after update of email_confirmed_at on auth.users
for each row when (old.email_confirmed_at is null and new.email_confirmed_at is not null)
execute function public.grant_admin_for_owner();

create table public.anime (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  thumbnail_url text,
  banner_url text,
  genres text[] not null default '{}',
  status text not null default 'ongoing' check (status in ('ongoing','completed','upcoming')),
  release_year int,
  published boolean not null default false,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.anime to anon, authenticated;
grant insert, update, delete on public.anime to authenticated;
grant all on public.anime to service_role;
alter table public.anime enable row level security;
create policy "Public reads published anime" on public.anime for select to anon, authenticated using (published or public.has_role(auth.uid(), 'admin'));
create policy "Admin inserts anime" on public.anime for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin updates anime" on public.anime for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin deletes anime" on public.anime for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create table public.episodes (
  id uuid primary key default gen_random_uuid(),
  anime_id uuid not null references public.anime(id) on delete cascade,
  episode_number int not null check (episode_number > 0),
  title text not null,
  video_url text not null,
  audio_language text not null default 'japanese' check (audio_language in ('japanese','english','hindi','telugu')),
  version text not null default 'sub' check (version in ('sub','dub')),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (anime_id, episode_number, audio_language, version)
);
create index on public.episodes(anime_id, episode_number);
grant select on public.episodes to anon, authenticated;
grant insert, update, delete on public.episodes to authenticated;
grant all on public.episodes to service_role;
alter table public.episodes enable row level security;
create policy "Public reads published episodes" on public.episodes for select to anon, authenticated using (
  (published and exists (select 1 from public.anime a where a.id = anime_id and a.published)) or public.has_role(auth.uid(), 'admin'));
create policy "Admin inserts episodes" on public.episodes for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin updates episodes" on public.episodes for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin deletes episodes" on public.episodes for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;
create trigger anime_touch before update on public.anime for each row execute function public.touch_updated_at();
create trigger episodes_touch before update on public.episodes for each row execute function public.touch_updated_at();