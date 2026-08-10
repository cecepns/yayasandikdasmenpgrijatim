-- Migration SQL untuk update tabel `layanan_persuratan` (Form Umum Surat)
-- Database: yayasan_dikdasmen_pgri_jatim

USE `yayasan_dikdasmen_pgri_jatim`;

-- Menambahkan kolom-kolom baru ke tabel layanan_persuratan
ALTER TABLE `layanan_persuratan`
  ADD COLUMN IF NOT EXISTS `email` VARCHAR(100) DEFAULT NULL AFTER `no_resi`,
  ADD COLUMN IF NOT EXISTS `nama_pengirim` VARCHAR(100) DEFAULT NULL AFTER `email`,
  ADD COLUMN IF NOT EXISTS `pengirim_surat` VARCHAR(150) DEFAULT NULL AFTER `nama_pengirim`,
  ADD COLUMN IF NOT EXISTS `no_hp` VARCHAR(50) DEFAULT NULL AFTER `pengirim_surat`,
  ADD COLUMN IF NOT EXISTS `kepada` VARCHAR(150) DEFAULT 'Ketua Yayasan Dikdasmen PGRI Jawa Timur' AFTER `no_hp`,
  ADD COLUMN IF NOT EXISTS `unit_kerja` VARCHAR(100) DEFAULT 'Pengurus Harian Yayasan' AFTER `kepada`,
  ADD COLUMN IF NOT EXISTS `nomor_surat` VARCHAR(100) DEFAULT NULL AFTER `unit_kerja`,
  ADD COLUMN IF NOT EXISTS `tanggal_surat` DATE DEFAULT NULL AFTER `nomor_surat`;
