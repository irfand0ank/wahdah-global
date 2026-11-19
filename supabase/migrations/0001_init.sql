-- Skema awal Wahdah Global.
-- Pengunjung hanya bisa membaca konten yang sudah terbit.
-- Hanya pengguna yang terdaftar di tabel `admins` yang bisa mengelola konten;
-- sekadar punya akun (login) TIDAK cukup.

create type post_category as enum ('Diplomasi', 'Kerja Sama', 'Kemanusiaan', 'DPLN', 'Kegiatan');
create type program_status as enum ('Berjalan', 'Selesai', 'Direncanakan');

create table admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table admins enable row level security;

create function is_admin() returns boolean
language sql stable security definer set search_path = public
as $$ select exists (select 1 from admins where user_id = auth.uid()) $$;

create table posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category post_category not null,
  excerpt text not null default '',
  body text not null default '',
  cover_url text,
  published boolean not null default false,
  published_at timestamptz not null default now(),
  sample boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  region text not null default '',
  status program_status not null default 'Direncanakan',
  summary text not null default '',
  body text not null default '',
  cover_url text,
  sort_order int not null default 0,
  published boolean not null default false,
  sample boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table dpln_chapters (
  id uuid primary key default gen_random_uuid(),
  country text not null,
  city text not null default '',
  note text not null default '',
  sort_order int not null default 0,
  published boolean not null default true,
  sample boolean not null default false
);

create table partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null default '',
  website text not null default '',
  logo_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  sample boolean not null default false
);

create table donation_channels (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  detail text not null default '',
  image_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  sample boolean not null default false
);

do $$
declare t text;
begin
  foreach t in array array['posts', 'programs', 'dpln_chapters', 'partners', 'donation_channels'] loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy "public read published" on %I for select to anon, authenticated using (published)', t);
    execute format('create policy "admin all" on %I for all to authenticated using (is_admin()) with check (is_admin())', t);
  end loop;
end $$;

-- Penyimpanan gambar (sampul berita/program, logo mitra, QRIS).
insert into storage.buckets (id, name, public) values ('media', 'media', true)
on conflict (id) do nothing;

create policy "admin upload media" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());
create policy "admin update media" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_admin());
create policy "admin delete media" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());
