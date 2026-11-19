-- Banner carousel beranda dan angka statistik pencapaian, dikelola dari panel admin.
create table slides (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  link text not null default '',
  image_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  sample boolean not null default false
);

create table stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null default '',
  sort_order int not null default 0,
  published boolean not null default true,
  sample boolean not null default false
);

do $$
declare t text;
begin
  foreach t in array array['slides', 'stats'] loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy "public read published" on %I for select to anon, authenticated using (published)', t);
    execute format('create policy "admin all" on %I for all to authenticated using (is_admin()) with check (is_admin())', t);
  end loop;
end $$;

-- Angka contoh (sample = true) — ganti dengan capaian sebenarnya.
insert into stats (label, value, sort_order, sample) values
  ('Negara Mitra', '0', 1, true),
  ('Perwakilan Luar Negeri (DPLN)', '0', 2, true),
  ('Program Kemanusiaan', '0', 3, true),
  ('Penerima Manfaat', '0', 4, true);
