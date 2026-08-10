-- Migration SQL for Settings Table (Foto, Profil, & Sambutan Ketua Yayasan)
-- Date: 2026-08-10

USE `yayasan_dikdasmen_pgri_jatim`;

CREATE TABLE IF NOT EXISTS `settings` (
  `key` VARCHAR(50) PRIMARY KEY,
  `value` TEXT DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO `settings` (`key`, `value`) VALUES
('nama_ketua', 'Drs. H. Winadi, M.Pd'),
('jabatan_ketua', 'Ketua Yayasan Dikdasmen PGRI Jawa Timur'),
('foto_ketua', NULL),
('sambutan_ketua', 'Assalamu\'alaikum Warahmatullahi Wabarakatuh.\nSalam sejahtera untuk kita semua.\n\nPuji syukur ke hadirat Allah SWT atas segala rahmat dan karunia-Nya, sehingga Website Yayasan Pembina Lembaga Pendidikan Dasar dan Menengah (Dikdasmen) PGRI Jawa Timur dapat hadir sebagai media informasi, komunikasi, dan kolaborasi bagi seluruh keluarga besar PGRI serta masyarakat luas.\n\nSelamat datang di website resmi Yayasan Pembina Lembaga Dikdasmen PGRI Jawa Timur.\n\nKami meyakini bahwa pendidikan merupakan fondasi utama dalam membangun sumber daya manusia yang unggul, berkarakter, berintegritas, serta mampu menjawab tantangan zaman. Oleh karena itu, Yayasan Pembina Lembaga Dikdasmen PGRI Jawa Timur berkomitmen untuk terus meningkatkan mutu tata kelola yayasan, memperkuat kualitas layanan pendidikan, mendukung profesionalisme tenaga pendidik dan kependidikan, serta mendorong lahirnya generasi yang cerdas, berakhlak mulia, kreatif, dan berdaya saing.\n\nWebsite ini kami hadirkan sebagai wujud keterbukaan informasi sekaligus sarana untuk mempererat sinergi antara yayasan, sekolah, guru, tenaga kependidikan, orang tua, alumni, pemerintah, dan seluruh pemangku kepentingan. Melalui media ini, kami berharap masyarakat dapat memperoleh informasi yang akurat mengenai program, kegiatan, prestasi, serta berbagai inovasi yang dikembangkan oleh Yayasan Dikdasmen PGRI Jawa Timur.\n\nKami mengajak seluruh keluarga besar Lembaga Pendidikan PGRI Jawa Timur melepaskan ego dan untuk terus menjaga semangat kebersamaan, profesionalisme, dan pengabdian dalam memajukan pendidikan. Dengan kolaborasi yang kuat, insya Allah kita dapat memberikan kontribusi nyata dalam mencerdaskan kehidupan bangsa serta mewujudkan pendidikan yang berkualitas, inklusif, dan berkelanjutan. Semangat kolaborasi dan pemanfaatan teknologi digital juga menjadi bagian penting dalam meningkatkan layanan dan transparansi lembaga pendidikan.\n\nAkhir kata, kami mengucapkan terima kasih kepada seluruh pihak yang telah memberikan dukungan dan kepercayaan kepada Yayasan Dikdasmen PGRI Jawa Timur. Semoga Allah SWT senantiasa memberikan petunjuk, kekuatan, dan keberkahan kepada kita semua dalam mengemban amanah mencerdaskan generasi penerus bangsa.\n\nWassalamu\'alaikum Warahmatullahi Wabarakatuh.')
ON DUPLICATE KEY UPDATE `key`=`key`;
