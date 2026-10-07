-- Migration: Fitur Video Berita dan Role Admin Berita
-- Database: yayasan_dikdasmen_pgri_jatim

USE `yayasan_dikdasmen_pgri_jatim`;

-- 1. Tambah kolom video dan video_url pada tabel berita
ALTER TABLE `berita` 
ADD COLUMN IF NOT EXISTS `video` VARCHAR(255) DEFAULT NULL AFTER `gambar`,
ADD COLUMN IF NOT EXISTS `video_url` VARCHAR(255) DEFAULT NULL AFTER `video`;

-- 2. Update ENUM role pada tabel users agar mendukung 'admin' (Super Admin) dan 'editor' (Admin Berita/Pengumuman)
ALTER TABLE `users` 
MODIFY COLUMN `role` ENUM('admin', 'editor', 'staff') DEFAULT 'editor';

-- 3. Tambahkan akun default untuk Admin Berita & Pengumuman (jika belum ada)
-- Username: penulis, Password: penulis123
INSERT INTO `users` (`username`, `password`, `nama`, `role`)
SELECT 'penulis', 'penulis123', 'Staff Publikasi & Berita PGRI', 'editor'
WHERE NOT EXISTS (SELECT 1 FROM `users` WHERE `username` = 'penulis');
