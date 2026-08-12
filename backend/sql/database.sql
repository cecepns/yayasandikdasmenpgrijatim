-- Database Export for Yayasan Dikdasmen PGRI Jawa Timur
-- Domain: www.yayasandikdasmenpgrijatim.com

CREATE DATABASE IF NOT EXISTS `yayasan_dikdasmen_pgri_jatim` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `yayasan_dikdasmen_pgri_jatim`;

-- 1. Table users
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `nama` VARCHAR(100) NOT NULL,
  `role` ENUM('admin', 'staff') DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO `users` (`id`, `username`, `password`, `nama`, `role`) VALUES
(1, 'admin', 'admin123', 'Administrator Yayasan PGRI Jatim', 'admin')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- 2. Table berita
CREATE TABLE IF NOT EXISTS `berita` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `judul` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `kategori` VARCHAR(100) NOT NULL,
  `konten` TEXT NOT NULL,
  `gambar` VARCHAR(255) DEFAULT NULL,
  `penulis` VARCHAR(100) DEFAULT 'Admin Dikdasmen PGRI',
  `tanggal` DATE DEFAULT (CURRENT_DATE),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO `berita` (`id`, `judul`, `slug`, `kategori`, `konten`, `gambar`, `penulis`, `tanggal`) VALUES
(1, 'Rapat Koordinasi Wilayah Pengurus Yayasan Dikdasmen PGRI Jawa Timur 2026', 'rapat-koordinasi-wilayah-2026', 'Kegiatan', 'Pengurus Yayasan Dikdasmen PGRI Jawa Timur menyelenggarakan Rapat Koordinasi Wilayah (Rakorwil) yang dihadiri oleh seluruh Ketua Perwakilan Kabupaten/Kota se-Jawa Timur. Agenda utama mencakup penguatan tata kelola mutu sekolah dan digitalisasi layanan persuratan.', NULL, 'Humas Yayasan', '2026-08-01'),
(2, 'Pelatihan Peningkatan Kompetensi Guru Lembaga Pendidikan PGRI Jatim', 'pelatihan-kompetensi-guru-pgri-jatim', 'Pendidikan', 'Dalam rangka meningkatkan profesionalisme dan kreativitas pendidik, Yayasan Dikdasmen PGRI Jawa Timur menggelar pelatihan pembuatan media pembelajaran berbasis teknologi digital.', NULL, 'Divisi Pendidikan', '2026-08-05'),
(3, 'Sistem Informasi Lembaga (SIL) Dan Layanan E-Surat Resmi Diluncurkan', 'sistem-informasi-lembaga-resmi-diluncurkan', 'Pengumuman', 'Yayasan Dikdasmen PGRI Jawa Timur meluncurkan portal Sistem Informasi Lembaga dan Layanan Persuratan Online guna mempermudah koordinasi antar sekolah dan pengurus daerah.', NULL, 'Admin Dikdasmen PGRI', '2026-08-09')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- 3. Table layanan_persuratan (Form Surat Umum)
CREATE TABLE IF NOT EXISTS `layanan_persuratan` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `no_resi` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) DEFAULT NULL,
  `nama_pengirim` VARCHAR(100) NOT NULL,
  `pengirim_surat` VARCHAR(150) NOT NULL,
  `no_hp` VARCHAR(50) DEFAULT NULL,
  `kepada` VARCHAR(150) DEFAULT 'Ketua Yayasan Dikdasmen PGRI Jawa Timur',
  `unit_kerja` VARCHAR(100) DEFAULT 'Pengurus Harian Yayasan',
  `nomor_surat` VARCHAR(100) DEFAULT NULL,
  `tanggal_surat` DATE DEFAULT NULL,
  `perihal` VARCHAR(255) NOT NULL,
  `keterangan` TEXT DEFAULT NULL,
  `file_lampiran` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('Diproses', 'Disetujui', 'Ditolak') DEFAULT 'Diproses',
  `catatan_admin` TEXT DEFAULT NULL,
  `tanggal_pengajuan` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO `layanan_persuratan` (`id`, `no_resi`, `email`, `nama_pengirim`, `pengirim_surat`, `no_hp`, `kepada`, `unit_kerja`, `nomor_surat`, `tanggal_surat`, `perihal`, `keterangan`, `status`) VALUES
(1, 'SRT-20260810-001', 'supriyanto@gmail.com', 'Drs. Supriyanto, M.Pd', 'SMA PGRI 1 Surabaya', '081234567890', 'Ketua Yayasan Dikdasmen PGRI Jawa Timur', 'Pengurus Harian Yayasan', '045/SMA-PGRI1/VIII/2026', '2026-08-01', 'Pengajuan Akreditasi Sekolah Tahun 2026', 'Memohon rekomendasi yayasan untuk perpanjangan izin operasional & akreditasi.', 'Disetujui'),
(2, 'SRT-20260810-002', 'budi.santoso@gmail.com', 'Budi Santoso, S.Pd', 'Dinas Pendidikan Kota Malang', '085678901234', 'Ketua Yayasan Dikdasmen PGRI Jawa Timur', 'Bidang Pendidikan', '800/123/Dindik/2026', '2026-08-05', 'Permohonan Koordinasi Mutasi Kepala Sekolah', 'Surat pengantar permohonan koordinasi ke Dinas Pendidikan.', 'Diproses')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- 4. Table sistem_informasi_lembaga (Data Sekolah PGRI Jatim)
CREATE TABLE IF NOT EXISTS `sistem_informasi_lembaga` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `npsn` VARCHAR(20) NOT NULL UNIQUE,
  `nama_sekolah` VARCHAR(150) NOT NULL,
  `jenjang` ENUM('TK/PAUD', 'SD/MI', 'SMP/MTs', 'SMA/MA', 'SMK') NOT NULL,
  `kabupaten_kota` VARCHAR(100) NOT NULL,
  `alamat` TEXT NOT NULL,
  `kepala_sekolah` VARCHAR(100) NOT NULL,
  `jumlah_siswa` INT DEFAULT 0,
  `jumlah_guru` INT DEFAULT 0,
  `akreditasi` VARCHAR(5) DEFAULT 'A',
  `kontak` VARCHAR(50) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO `sistem_informasi_lembaga` (`id`, `npsn`, `nama_sekolah`, `jenjang`, `kabupaten_kota`, `alamat`, `kepala_sekolah`, `jumlah_siswa`, `jumlah_guru`, `akreditasi`, `kontak`) VALUES
(1, '20501234', 'SMA PGRI 1 Surabaya', 'SMA/MA', 'Kota Surabaya', 'Jl. Ngagel Jaya Selatan No. 12, Surabaya', 'Drs. Supriyanto, M.Pd', 620, 42, 'A', '031-5551234'),
(2, '20505678', 'SMK PGRI 2 Sidoarjo', 'SMK', 'Kab. Sidoarjo', 'Jl. Jenggolo No. 45, Sidoarjo', 'Ir. Heru Kurniawan', 890, 58, 'A', '031-8941122'),
(3, '20509012', 'SMP PGRI 1 Malang', 'SMP/MTs', 'Kota Malang', 'Jl. Bandung No. 8, Malang', 'Siti Rahmah, S.Pd, M.M', 450, 30, 'A', '0341-325678'),
(4, '20503456', 'SD PGRI 3 Jember', 'SD/MI', 'Kab. Jember', 'Jl. Gajah Mada No. 100, Jember', 'Ahmad Fauzi, S.Pd', 280, 18, 'B', '0331-489900')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- 5. Table settings (Pengaturan Profil & Website)
CREATE TABLE IF NOT EXISTS `settings` (
  `key` VARCHAR(50) PRIMARY KEY,
  `value` TEXT DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO `settings` (`key`, `value`) VALUES
('hero_title', 'Pendidikan Bermutu, Generasi Berkarakter'),
('hero_subtitle', 'Website resmi Yayasan Pembina Lembaga Pendidikan Dasar dan Menengah PGRI Jawa Timur sebagai sarana informasi, digitalisasi persuratan, dan integrasi lembaga sekolah se-Jawa Timur.'),
('hero_image', NULL),
('title_sambutan_home', 'Selamat Datang di Website Resmi Yayasan Pembina Lembaga Dikdasmen PGRI Jawa Timur'),
('quote_sambutan_home', 'Kami meyakini bahwa pendidikan merupakan fondasi utama dalam membangun sumber daya manusia yang unggul, berkarakter, berintegritas, serta mampu menjawab tantangan zaman. Yayasan Pembina Lembaga Dikdasmen PGRI Jawa Timur berkomitmen untuk terus meningkatkan mutu tata kelola yayasan, memperkuat kualitas layanan pendidikan, serta mendukung profesionalisme pendidik.'),
('nama_ketua', 'Drs. H. Winadi, M.Pd'),
('jabatan_ketua', 'Ketua Yayasan Dikdasmen PGRI Jawa Timur'),
('foto_ketua', NULL),
('sejarah_yayasan', 'Yayasan Pembina Lembaga Pendidikan (YPLP) PGRI didirikan sebagai badan khusus Persatuan Guru Republik Indonesia yang bertugas membina, mengelola, dan mengikhtiarkan perkembangan lembaga pendidikan persekolahan PGRI di seluruh jenjang pendidikan dasar dan menengah.\n\nDi Jawa Timur, YPLP Dikdasmen PGRI tumbuh dan berkembang pesat seiring tingginya kebutuhan masyarakat akan pendidikan berkualitas, berkarakter nasionalis, dan terjangkau. Berawal dari inisiatif para tokoh pendidik PGRI Jawa Timur untuk memberikan wadah formal bagi sekolah-sekolah swasta PGRI agar memiliki standar kurikulum, tata kelola, serta sarana prasarana yang tangguh.\n\nHingga saat ini, YPLP Dikdasmen PGRI Jawa Timur terus bertransformasi menjadi pusat pengayoman modern yang memadukan semangat historis pengabdian guru dengan modernisasi digitalisasi layanan pendidikan.'),
('visi_yayasan', 'Menjadi lembaga pembina pendidikan yang unggul, profesional, berkarakter Pancasila, dan terdepan dalam mewujudkan pendidikan bermutu di Jawa Timur.'),
('misi_yayasan', 'Meningkatkan mutu tata kelola lembaga pendidikan PGRI di seluruh kabupaten/kota se-Jawa Timur.\nMendorong profesionalisme, kesejahteraan, dan kompetensi tenaga pendidik dan kependidikan.\nMengembangkan digitalisasi layanan persuratan dan sistem informasi manajemen sekolah.\nMembangun karakter generasi muda yang cerdas, berakhlak mulia, dan berdaya saing global.'),
('stat_kabupaten', '38'),
('stat_sekolah', '500+'),
('stat_guru', '15.000+'),
('stat_siswa', '100.000+'),
('alamat_yayasan', 'Jl. Wonorejo Timur Blok A Nomor 43 – Rungkut – Surabaya, Kode Pos 60296'),
('telepon_yayasan', '(031) 870-1234 / 870-1235'),
('email_yayasan', 'yplpdmpgrijatim@gmail.com'),
('website_yayasan', 'www.yplpdm_pgrijatim.com'),
('jam_operasional', 'Senin - Jumat: 08.00 - 15.30 WIB'),
('sambutan_ketua', 'Assalamu\'alaikum Warahmatullahi Wabarakatuh.\nSalam sejahtera untuk kita semua.\n\nPuji syukur ke hadirat Allah SWT atas segala rahmat dan karunia-Nya, sehingga Website Yayasan Pembina Lembaga Pendidikan Dasar dan Menengah (Dikdasmen) PGRI Jawa Timur dapat hadir sebagai media informasi, komunikasi, dan kolaborasi bagi seluruh keluarga besar PGRI serta masyarakat luas.\n\nSelamat datang di website resmi Yayasan Pembina Lembaga Dikdasmen PGRI Jawa Timur.\n\nKami meyakini bahwa pendidikan merupakan fondasi utama dalam membangun sumber daya manusia yang unggul, berkarakter, berintegritas, serta mampu menjawab tantangan zaman. Oleh karena itu, Yayasan Pembina Lembaga Dikdasmen PGRI Jawa Timur berkomitmen untuk terus meningkatkan mutu tata kelola yayasan, memperkuat kualitas layanan pendidikan, mendukung profesionalisme tenaga pendidik dan kependidikan, serta mendorong lahirnya generasi yang cerdas, berakhlak mulia, kreatif, dan berdaya saing.\n\nWebsite ini kami hadirkan sebagai wujud keterbukaan informasi sekaligus sarana untuk mempererat sinergi antara yayasan, sekolah, guru, tenaga kependidikan, orang tua, alumni, pemerintah, dan seluruh pemangku kepentingan. Melalui media ini, kami berharap masyarakat dapat memperoleh informasi yang akurat mengenai program, kegiatan, prestasi, serta berbagai inovasi yang dikembangkan oleh Yayasan Dikdasmen PGRI Jawa Timur.\n\nKami mengajak seluruh keluarga besar Lembaga Pendidikan PGRI Jawa Timur untuk terus menjaga semangat kebersamaan, profesionalisme, dan pengabdian dalam memajukan pendidikan. Dengan kolaborasi yang kuat, insya Allah kita dapat memberikan kontribusi nyata dalam mencerdaskan kehidupan bangsa serta mewujudkan pendidikan yang berkualitas, inklusif, dan berkelanjutan. Semangat kolaborasi dan pemanfaatan teknologi digital juga menjadi bagian penting dalam meningkatkan layanan dan transparansi lembaga pendidikan.\n\nAkhir kata, kami mengucapkan terima kasih kepada seluruh pihak yang telah memberikan dukungan dan kepercayaan kepada Yayasan Dikdasmen PGRI Jawa Timur. Semoga Allah SWT senantiasa memberikan petunjuk, kekuatan, dan keberkahan kepada kita semua dalam mengemban amanah mencerdaskan generasi penerus bangsa.\n\nWassalamu\'alaikum Warahmatullahi Wabarakatuh.')
ON DUPLICATE KEY UPDATE `key`=`key`;

-- 6. Table pengurus (Pengurus Yayasan)
CREATE TABLE IF NOT EXISTS `pengurus` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama` VARCHAR(100) NOT NULL,
  `jabatan` VARCHAR(100) NOT NULL,
  `kategori` VARCHAR(100) DEFAULT 'Pengurus Harian',
  `foto` VARCHAR(255) DEFAULT NULL,
  `deskripsi` TEXT DEFAULT NULL,
  `urutan` INT DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO `pengurus` (`id`, `nama`, `jabatan`, `kategori`, `foto`, `deskripsi`, `urutan`) VALUES
(1, 'Drs. H. Winadi, M.Pd', 'Ketua Yayasan', 'Pengurus Harian', NULL, 'Memimpin penyelenggaraan dan perumusan kebijakan pengayoman sekolah-sekolah PGRI di Jawa Timur.', 1),
(2, 'Drs. Supriyanto, M.Pd', 'Sekretaris Yayasan', 'Pengurus Harian', NULL, 'Mengelola tata kelola persuratan, tata usaha, serta hubungan antar lembaga perwakilan kabupaten/kota.', 2),
(3, 'H. Budi Santoso, SE, M.M', 'Bendahara Yayasan', 'Pengurus Harian', NULL, 'Bertanggung jawab atas pengelolaan dana, akuntabilitas keuangan, dan pengembangan sarana prasarana sekolah.', 3)
ON DUPLICATE KEY UPDATE `id`=`id`;
