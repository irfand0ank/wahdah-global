-- Konten contoh awal (ditandai sample = true). Aman dihapus dari panel admin.

insert into posts (slug, title, category, excerpt, body, published, published_at, sample) values
  ('contoh-kunjungan-silaturahmi', 'Kunjungan Silaturahmi ke Lembaga Mitra', 'Diplomasi',
   'Delegasi lembaga bertemu pimpinan lembaga mitra untuk membahas peluang kolaborasi.',
   'Ini adalah berita contoh untuk memperlihatkan tampilan halaman. Ganti dengan liputan kegiatan yang sebenarnya.',
   true, '2026-11-10', true),
  ('contoh-penandatanganan-kerja-sama', 'Penandatanganan Nota Kesepahaman', 'Kerja Sama',
   'Kerja sama di bidang pendidikan dan sosial resmi dimulai dengan penandatanganan nota kesepahaman.',
   'Ini adalah berita contoh untuk memperlihatkan tampilan halaman. Ganti dengan liputan kegiatan yang sebenarnya.',
   true, '2026-10-28', true),
  ('contoh-penyaluran-bantuan', 'Penyaluran Bantuan Tahap Pertama', 'Kemanusiaan',
   'Tim relawan menyalurkan bantuan tahap pertama kepada keluarga penerima manfaat.',
   'Ini adalah berita contoh untuk memperlihatkan tampilan halaman. Ganti dengan liputan kegiatan yang sebenarnya.',
   true, '2026-10-15', true),
  ('contoh-kegiatan-dpln', 'Kegiatan Pembinaan di Perwakilan Luar Negeri', 'DPLN',
   'Pengurus perwakilan luar negeri mengadakan kegiatan pembinaan bagi warga Indonesia setempat.',
   'Ini adalah berita contoh untuk memperlihatkan tampilan halaman. Ganti dengan liputan kegiatan yang sebenarnya.',
   true, '2026-09-30', true)
on conflict (slug) do nothing;

insert into programs (slug, title, region, status, summary, body, sort_order, published, sample) values
  ('contoh-bantuan-pangan', 'Bantuan Pangan Darurat', 'Wilayah sasaran (contoh)', 'Berjalan',
   'Penyaluran paket pangan bagi keluarga terdampak krisis di wilayah sasaran.',
   E'Ini adalah halaman program contoh. Uraikan latar belakang, sasaran penerima manfaat, mitra pelaksana, dan perkembangan penyaluran di sini.\n\nFoto dokumentasi dan laporan penyaluran dapat ditambahkan melalui panel admin.',
   1, true, true),
  ('contoh-layanan-kesehatan', 'Layanan Kesehatan Keliling', 'Wilayah sasaran (contoh)', 'Direncanakan',
   'Tim medis dan obat-obatan untuk komunitas yang sulit menjangkau fasilitas kesehatan.',
   'Ini adalah halaman program contoh. Ganti dengan uraian program yang sebenarnya.',
   2, true, true),
  ('contoh-air-bersih', 'Sumur & Air Bersih', 'Wilayah sasaran (contoh)', 'Selesai',
   'Pembangunan sarana air bersih untuk permukiman dan fasilitas umum.',
   'Ini adalah halaman program contoh. Ganti dengan uraian program yang sebenarnya.',
   3, true, true)
on conflict (slug) do nothing;

insert into dpln_chapters (country, city, sort_order, sample)
select * from (values
  ('Negara perwakilan 1', 'Kota', 1, true),
  ('Negara perwakilan 2', 'Kota', 2, true),
  ('Negara perwakilan 3', 'Kota', 3, true)
) v where not exists (select 1 from dpln_chapters);

insert into donation_channels (label, detail, sort_order, sample)
select * from (values
  ('Transfer bank', 'Nama bank, nomor rekening, dan atas nama — belum diisi.', 1, true),
  ('QRIS', 'Gambar QRIS resmi lembaga — belum diunggah.', 2, true)
) v where not exists (select 1 from donation_channels);
