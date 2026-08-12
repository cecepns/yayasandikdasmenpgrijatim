-- Migration File: Insert default settings key-value for custom logo_lambang and lambang_desc
-- Date: 2026-08-12

INSERT INTO `settings` (`key`, `value`) VALUES
('logo_lambang', NULL),
('lambang_desc', 'Lambang Resmi Yayasan Pembina Lembaga Pendidikan Dasar dan Menengah PGRI Jawa Timur memiliki unsur utama berupa sayap bulu, suluh obor, serta warna dasar yang melambangkan pengabdian mulia dunia pendidikan.')
ON DUPLICATE KEY UPDATE `key`=`key`;
