-- Migration SQL for Pengurus Yayasan & Profil (Visi, Misi, Sejarah)
-- Database: yayasan_dikdasmen_pgri_jatim

USE `yayasan_dikdasmen_pgri_jatim`;

-- 1. Table pengurus
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

-- Insert Default Data Pengurus
INSERT INTO `pengurus` (`id`, `nama`, `jabatan`, `kategori`, `foto`, `deskripsi`, `urutan`) VALUES
(1, 'Drs. H. Winadi, M.Pd', 'Ketua Yayasan', 'Pengurus Harian', NULL, 'Memimpin penyelenggaraan dan perumusan kebijakan pengayoman sekolah-sekolah PGRI di Jawa Timur.', 1),
(2, 'Drs. Supriyanto, M.Pd', 'Sekretaris Yayasan', 'Pengurus Harian', NULL, 'Mengelola tata kelola persuratan, tata usaha, serta hubungan antar lembaga perwakilan kabupaten/kota.', 2),
(3, 'H. Budi Santoso, SE, M.M', 'Bendahara Yayasan', 'Pengurus Harian', NULL, 'Bertanggung jawab atas pengelolaan dana, akuntabilitas keuangan, dan pengembangan sarana prasarana sekolah.', 3)
ON DUPLICATE KEY UPDATE `id`=`id`;

-- 2. Insert Default Profile Settings (Visi, Misi, Sejarah) into `settings` table
CREATE TABLE IF NOT EXISTS `settings` (
  `key` VARCHAR(50) PRIMARY KEY,
  `value` TEXT DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO `settings` (`key`, `value`) VALUES
('sejarah_yayasan', 'Yayasan Pembina Lembaga Pendidikan (YPLP) PGRI didirikan sebagai badan khusus Persatuan Guru Republik Indonesia yang bertugas membina, mengelola, dan mengikhtiarkan perkembangan lembaga pendidikan persekolahan PGRI di seluruh jenjang pendidikan dasar dan menengah.\n\nDi Jawa Timur, YPLP Dikdasmen PGRI tumbuh dan berkembang pesat seiring tingginya kebutuhan masyarakat akan pendidikan berkualitas, berkarakter nasionalis, dan terjangkau. Berawal dari inisiatif para tokoh pendidik PGRI Jawa Timur untuk memberikan wadah formal bagi sekolah-sekolah swasta PGRI agar memiliki standar kurikulum, tata kelola, serta sarana prasarana yang tangguh.\n\nHingga saat ini, YPLP Dikdasmen PGRI Jawa Timur terus bertransformasi menjadi pusat pengayoman modern yang memadukan semangat historis pengabdian guru dengan modernisasi digitalisasi layanan pendidikan.'),
('visi_yayasan', 'Menjadi lembaga pembina pendidikan yang unggul, profesional, berkarakter Pancasila, dan terdepan dalam mewujudkan pendidikan bermutu di Jawa Timur.'),
('misi_yayasan', 'Meningkatkan mutu tata kelola lembaga pendidikan PGRI di seluruh kabupaten/kota se-Jawa Timur.\nMendorong profesionalisme, kesejahteraan, dan kompetensi tenaga pendidik dan kependidikan.\nMengembangkan digitalisasi layanan persuratan dan sistem informasi manajemen sekolah.\nMembangun karakter generasi muda yang cerdas, berakhlak mulia, dan berdaya saing global.'),
('stat_kabupaten', '38'),
('stat_sekolah', '500+'),
('stat_guru', '15.000+'),
('stat_siswa', '100.000+')
ON DUPLICATE KEY UPDATE `key`=`key`;
