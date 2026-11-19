-- Galeri multi-gambar untuk berita dan program: daftar URL gambar, berurutan.
alter table posts add column gallery text[] not null default '{}';
alter table programs add column gallery text[] not null default '{}';
