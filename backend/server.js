const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Upload directory configuration
const UPLOAD_DIR = path.join(__dirname, 'uploads-yayasan-dikdasmen-pgri-jatim');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOAD_DIR));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// In-memory fallback dataset in case MySQL connection is not configured or fails
let memoryDatabase = {
  users: [
    { id: 1, username: 'admin', password: 'admin123', nama: 'Administrator Yayasan PGRI Jatim', role: 'admin' }
  ],
  berita: [
    {
      id: 1,
      judul: 'Rapat Koordinasi Wilayah Pengurus Yayasan Dikdasmen PGRI Jawa Timur 2026',
      slug: 'rapat-koordinasi-wilayah-2026',
      kategori: 'Kegiatan',
      konten: 'Pengurus Yayasan Dikdasmen PGRI Jawa Timur menyelenggarakan Rapat Koordinasi Wilayah (Rakorwil) yang dihadiri oleh seluruh Ketua Perwakilan Kabupaten/Kota se-Jawa Timur. Agenda utama mencakup penguatan tata kelola mutu sekolah dan digitalisasi layanan persuratan.',
      gambar: null,
      penulis: 'Humas Yayasan',
      tanggal: '2026-08-01'
    },
    {
      id: 2,
      judul: 'Pelatihan Peningkatan Kompetensi Guru Lembaga Pendidikan PGRI Jatim',
      slug: 'pelatihan-kompetensi-guru-pgri-jatim',
      kategori: 'Pendidikan',
      konten: 'Dalam rangka meningkatkan profesionalisme dan kreativitas pendidik, Yayasan Dikdasmen PGRI Jawa Timur menggelar pelatihan pembuatan media pembelajaran berbasis teknologi digital.',
      gambar: null,
      penulis: 'Divisi Pendidikan',
      tanggal: '2026-08-05'
    },
    {
      id: 3,
      judul: 'Sistem Informasi Lembaga (SIL) Dan Layanan E-Surat Resmi Diluncurkan',
      slug: 'sistem-informasi-lembaga-resmi-diluncurkan',
      kategori: 'Pengumuman',
      konten: 'Yayasan Dikdasmen PGRI Jawa Timur meluncurkan portal Sistem Informasi Lembaga dan Layanan Persuratan Online guna mempermudah koordinasi antar sekolah dan pengurus daerah.',
      gambar: null,
      penulis: 'Admin Dikdasmen PGRI',
      tanggal: '2026-08-09'
    }
  ],
  layanan_persuratan: [
    {
      id: 1,
      no_resi: 'SRT-20260810-001',
      nama_pengaju: 'Drs. Supriyanto, M.Pd',
      lembaga_sekolah: 'SMA PGRI 1 Surabaya',
      kabupaten_kota: 'Kota Surabaya',
      jenis_surat: 'Surat Rekomendasi',
      perihal: 'Pengajuan Akreditasi Sekolah Tahun 2026',
      keterangan: 'Memohon rekomendasi yayasan untuk perpanjangan izin operasional & akreditasi.',
      file_lampiran: null,
      status: 'Disetujui',
      catatan_admin: 'Disetujui dan dokumen rekomendasi telah diterbitkan.',
      tanggal_pengajuan: '2026-08-10 09:00:00'
    },
    {
      id: 2,
      no_resi: 'SRT-20260810-002',
      nama_pengaju: 'Budi Santoso, S.Pd',
      lembaga_sekolah: 'SMP PGRI 2 Malang',
      kabupaten_kota: 'Kota Malang',
      jenis_surat: 'Surat Pengantar',
      perihal: 'Permohonan Mutasi Kepala Sekolah',
      keterangan: 'Surat pengantar permohonan ke Dinas Pendidikan.',
      file_lampiran: null,
      status: 'Diproses',
      catatan_admin: 'Sedang diverifikasi oleh sekretariat yayasan.',
      tanggal_pengajuan: '2026-08-10 10:15:00'
    }
  ],
  sistem_informasi_lembaga: [
    {
      id: 1,
      npsn: '20501234',
      nama_sekolah: 'SMA PGRI 1 Surabaya',
      jenjang: 'SMA/MA',
      kabupaten_kota: 'Kota Surabaya',
      alamat: 'Jl. Ngagel Jaya Selatan No. 12, Surabaya',
      kepala_sekolah: 'Drs. Supriyanto, M.Pd',
      jumlah_siswa: 620,
      jumlah_guru: 42,
      akreditasi: 'A',
      kontak: '031-5551234'
    },
    {
      id: 2,
      npsn: '20505678',
      nama_sekolah: 'SMK PGRI 2 Sidoarjo',
      jenjang: 'SMK',
      kabupaten_kota: 'Kab. Sidoarjo',
      alamat: 'Jl. Jenggolo No. 45, Sidoarjo',
      kepala_sekolah: 'Ir. Heru Kurniawan',
      jumlah_siswa: 890,
      jumlah_guru: 58,
      akreditasi: 'A',
      kontak: '031-8941122'
    },
    {
      id: 3,
      npsn: '20509012',
      nama_sekolah: 'SMP PGRI 1 Malang',
      jenjang: 'SMP/MTs',
      kabupaten_kota: 'Kota Malang',
      alamat: 'Jl. Bandung No. 8, Malang',
      kepala_sekolah: 'Siti Rahmah, S.Pd, M.M',
      jumlah_siswa: 450,
      jumlah_guru: 30,
      akreditasi: 'A',
      kontak: '0341-325678'
    },
    {
      id: 4,
      npsn: '20503456',
      nama_sekolah: 'SD PGRI 3 Jember',
      jenjang: 'SD/MI',
      kabupaten_kota: 'Kab. Jember',
      alamat: 'Jl. Gajah Mada No. 100, Jember',
      kepala_sekolah: 'Ahmad Fauzi, S.Pd',
      jumlah_siswa: 280,
      jumlah_guru: 18,
      akreditasi: 'B',
      kontak: '0331-489900'
    }
  ],
  pengurus: [
    {
      id: 1,
      nama: 'Drs. H. Winadi, M.Pd',
      jabatan: 'Ketua Yayasan',
      kategori: 'Pengurus Harian',
      foto: null,
      deskripsi: 'Memimpin penyelenggaraan dan perumusan kebijakan pengayoman sekolah-sekolah PGRI di Jawa Timur.',
      urutan: 1
    },
    {
      id: 2,
      nama: 'Drs. Supriyanto, M.Pd',
      jabatan: 'Sekretaris Yayasan',
      kategori: 'Pengurus Harian',
      foto: null,
      deskripsi: 'Mengelola tata kelola persuratan, tata usaha, serta hubungan antar lembaga perwakilan kabupaten/kota.',
      urutan: 2
    },
    {
      id: 3,
      nama: 'H. Budi Santoso, SE, M.M',
      jabatan: 'Bendahara Yayasan',
      kategori: 'Pengurus Harian',
      foto: null,
      deskripsi: 'Bertanggung jawab atas pengelolaan dana, akuntabilitas keuangan, dan pengembangan sarana prasarana sekolah.',
      urutan: 3
    }
  ]
};

let dbPool = null;
async function getDbConnection() {
  if (dbPool) return dbPool;
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'yayasan_dikdasmen_pgri_jatim',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    await pool.getConnection();
    dbPool = pool;
    console.log('MySQL Database Connected Successfully.');
    return dbPool;
  } catch (err) {
    console.log('Using in-memory database fallback:', err.message);
    return null;
  }
}

// ---------------- API ENDPOINTS ----------------

// AUTH API
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const pool = await getDbConnection();
  if (pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
      if (rows.length > 0) {
        const user = rows[0];
        delete user.password;
        return res.json({ success: true, message: 'Login berhasil', data: user });
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Memory fallback
  const user = memoryDatabase.users.find(u => u.username === username && u.password === password);
  if (user) {
    const userCopy = { ...user };
    delete userCopy.password;
    return res.json({ success: true, message: 'Login berhasil', data: userCopy });
  }
  return res.status(401).json({ success: false, message: 'Username atau password salah' });
});

// BERITA API (Support Pagination, Search, Limit)
app.get('/api/berita', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const offset = (page - 1) * limit;

  const pool = await getDbConnection();
  if (pool) {
    try {
      const searchPattern = `%${search}%`;
      const [countResult] = await pool.query('SELECT COUNT(*) as total FROM berita WHERE judul LIKE ? OR konten LIKE ? OR kategori LIKE ?', [searchPattern, searchPattern, searchPattern]);
      const total = countResult[0].total;
      const [rows] = await pool.query('SELECT * FROM berita WHERE judul LIKE ? OR konten LIKE ? OR kategori LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?', [searchPattern, searchPattern, searchPattern, limit, offset]);
      
      return res.json({
        success: true,
        data: rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  // Fallback memory filtering
  let filtered = memoryDatabase.berita.filter(b => 
    b.judul.toLowerCase().includes(search.toLowerCase()) || 
    b.konten.toLowerCase().includes(search.toLowerCase()) ||
    b.kategori.toLowerCase().includes(search.toLowerCase())
  );
  filtered.sort((a, b) => b.id - a.id);
  const total = filtered.length;
  const data = filtered.slice(offset, offset + limit);

  return res.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1
    }
  });
});

app.get('/api/berita/:id', async (req, res) => {
  const { id } = req.params;
  const pool = await getDbConnection();
  if (pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM berita WHERE id = ? OR slug = ?', [id, id]);
      if (rows.length > 0) return res.json({ success: true, data: rows[0] });
    } catch (e) { console.error(e); }
  }
  const item = memoryDatabase.berita.find(b => b.id == id || b.slug === id);
  if (item) return res.json({ success: true, data: item });
  return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
});

app.post('/api/berita', upload.single('gambar'), async (req, res) => {
  const { judul, kategori, konten, penulis } = req.body;
  const gambar = req.file ? `/uploads/${req.file.filename}` : null;
  const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();
  const tanggal = new Date().toISOString().split('T')[0];

  const pool = await getDbConnection();
  if (pool) {
    try {
      const [result] = await pool.query(
        'INSERT INTO berita (judul, slug, kategori, konten, gambar, penulis, tanggal) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [judul, slug, kategori, konten, gambar, penulis || 'Admin Dikdasmen PGRI', tanggal]
      );
      return res.status(201).json({ success: true, message: 'Berita berhasil dibuat', data: { id: result.insertId } });
    } catch (e) { console.error(e); }
  }

  const newItem = {
    id: memoryDatabase.berita.length + 1,
    judul,
    slug,
    kategori,
    konten,
    gambar,
    penulis: penulis || 'Admin Dikdasmen PGRI',
    tanggal
  };
  memoryDatabase.berita.unshift(newItem);
  res.status(201).json({ success: true, message: 'Berita berhasil dibuat', data: newItem });
});

app.put('/api/berita/:id', upload.single('gambar'), async (req, res) => {
  const { id } = req.params;
  const { judul, kategori, konten, penulis } = req.body;
  let gambar = req.file ? `/uploads/${req.file.filename}` : undefined;

  const pool = await getDbConnection();
  if (pool) {
    try {
      if (gambar) {
        await pool.query('UPDATE berita SET judul=?, kategori=?, konten=?, penulis=?, gambar=? WHERE id=?', [judul, kategori, konten, penulis, gambar, id]);
      } else {
        await pool.query('UPDATE berita SET judul=?, kategori=?, konten=?, penulis=? WHERE id=?', [judul, kategori, konten, penulis, id]);
      }
      return res.json({ success: true, message: 'Berita berhasil diperbarui' });
    } catch (e) { console.error(e); }
  }

  const index = memoryDatabase.berita.findIndex(b => b.id == id);
  if (index !== -1) {
    memoryDatabase.berita[index] = {
      ...memoryDatabase.berita[index],
      judul,
      kategori,
      konten,
      penulis,
      ...(gambar ? { gambar } : {})
    };
    return res.json({ success: true, message: 'Berita berhasil diperbarui', data: memoryDatabase.berita[index] });
  }
  res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
});

app.delete('/api/berita/:id', async (req, res) => {
  const { id } = req.params;
  const pool = await getDbConnection();
  if (pool) {
    try {
      await pool.query('DELETE FROM berita WHERE id = ?', [id]);
      return res.json({ success: true, message: 'Berita berhasil dihapus' });
    } catch (e) { console.error(e); }
  }
  memoryDatabase.berita = memoryDatabase.berita.filter(b => b.id != id);
  res.json({ success: true, message: 'Berita berhasil dihapus' });
});

// LAYANAN PERSURATAN API (FORM UMUM INSTANSI / LEMBAGA / PERSONAL)
app.get('/api/persuratan', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const offset = (page - 1) * limit;

  const pool = await getDbConnection();
  if (pool) {
    try {
      const searchPattern = `%${search}%`;
      const [countResult] = await pool.query(
        'SELECT COUNT(*) as total FROM layanan_persuratan WHERE no_resi LIKE ? OR nama_pengirim LIKE ? OR pengirim_surat LIKE ? OR perihal LIKE ? OR nomor_surat LIKE ?',
        [searchPattern, searchPattern, searchPattern, searchPattern, searchPattern]
      );
      const total = countResult[0].total;
      const [rows] = await pool.query(
        'SELECT * FROM layanan_persuratan WHERE no_resi LIKE ? OR nama_pengirim LIKE ? OR pengirim_surat LIKE ? OR perihal LIKE ? OR nomor_surat LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?',
        [searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, limit, offset]
      );

      return res.json({
        success: true,
        data: rows,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 }
      });
    } catch (e) { console.error(e); }
  }

  let filtered = memoryDatabase.layanan_persuratan.filter(s =>
    (s.no_resi && s.no_resi.toLowerCase().includes(search.toLowerCase())) ||
    (s.nama_pengirim && s.nama_pengirim.toLowerCase().includes(search.toLowerCase())) ||
    (s.nama_pengaju && s.nama_pengaju.toLowerCase().includes(search.toLowerCase())) ||
    (s.pengirim_surat && s.pengirim_surat.toLowerCase().includes(search.toLowerCase())) ||
    (s.perihal && s.perihal.toLowerCase().includes(search.toLowerCase())) ||
    (s.nomor_surat && s.nomor_surat.toLowerCase().includes(search.toLowerCase()))
  );
  filtered.sort((a, b) => b.id - a.id);
  const total = filtered.length;
  const data = filtered.slice(offset, offset + limit);

  return res.json({
    success: true,
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 }
  });
});

app.get('/api/persuratan/lacak/:noResi', async (req, res) => {
  const { noResi } = req.params;
  const pool = await getDbConnection();
  if (pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM layanan_persuratan WHERE no_resi = ?', [noResi]);
      if (rows.length > 0) return res.json({ success: true, data: rows[0] });
    } catch (e) { console.error(e); }
  }
  const item = memoryDatabase.layanan_persuratan.find(s => s.no_resi.toLowerCase() === noResi.toLowerCase());
  if (item) return res.json({ success: true, data: item });
  return res.status(404).json({ success: false, message: 'Nomor Resi / Surat tidak ditemukan' });
});

app.post('/api/persuratan', upload.single('file_lampiran'), async (req, res) => {
  const { email, nama_pengirim, nama_pengaju, pengirim_surat, lembaga_sekolah, no_hp, kepada, unit_kerja, nomor_surat, tanggal_surat, perihal, keterangan } = req.body;
  const file_lampiran = req.file ? `/uploads/${req.file.filename}` : null;
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const no_resi = `SRT-${dateStr}-${randomNum}`;
  const status = 'Diproses';

  const senderName = nama_pengirim || nama_pengaju || 'Pengirim Surat';
  const senderOrg = pengirim_surat || lembaga_sekolah || 'Umum';

  const pool = await getDbConnection();
  if (pool) {
    try {
      const [result] = await pool.query(
        'INSERT INTO layanan_persuratan (no_resi, email, nama_pengirim, pengirim_surat, no_hp, kepada, unit_kerja, nomor_surat, tanggal_surat, perihal, keterangan, file_lampiran, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          no_resi,
          email || '',
          senderName,
          senderOrg,
          no_hp || '',
          kepada || 'Ketua Yayasan Dikdasmen PGRI Jawa Timur',
          unit_kerja || 'Pengurus Harian Yayasan',
          nomor_surat || '-',
          tanggal_surat || new Date().toISOString().slice(0, 10),
          perihal,
          keterangan || '',
          file_lampiran,
          status
        ]
      );
      return res.status(201).json({ success: true, message: 'Pengajuan surat berhasil dikirim', data: { no_resi, id: result.insertId } });
    } catch (e) { console.error(e); }
  }

  const newItem = {
    id: memoryDatabase.layanan_persuratan.length + 1,
    no_resi,
    email: email || '',
    nama_pengirim: senderName,
    nama_pengaju: senderName,
    pengirim_surat: senderOrg,
    lembaga_sekolah: senderOrg,
    no_hp: no_hp || '',
    kepada: kepada || 'Ketua Yayasan Dikdasmen PGRI Jawa Timur',
    unit_kerja: unit_kerja || 'Pengurus Harian Yayasan',
    nomor_surat: nomor_surat || '-',
    tanggal_surat: tanggal_surat || new Date().toISOString().slice(0, 10),
    perihal,
    keterangan: keterangan || '',
    file_lampiran,
    status,
    catatan_admin: null,
    tanggal_pengajuan: new Date().toISOString().replace('T', ' ').slice(0, 19)
  };
  memoryDatabase.layanan_persuratan.unshift(newItem);
  res.status(201).json({ success: true, message: 'Pengajuan surat berhasil dikirim', data: newItem });
});

app.put('/api/persuratan/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, catatan_admin } = req.body;

  const pool = await getDbConnection();
  if (pool) {
    try {
      await pool.query('UPDATE layanan_persuratan SET status = ?, catatan_admin = ? WHERE id = ?', [status, catatan_admin, id]);
      return res.json({ success: true, message: 'Status persuratan berhasil diperbarui' });
    } catch (e) { console.error(e); }
  }

  const item = memoryDatabase.layanan_persuratan.find(s => s.id == id);
  if (item) {
    item.status = status;
    item.catatan_admin = catatan_admin;
    return res.json({ success: true, message: 'Status persuratan berhasil diperbarui', data: item });
  }
  res.status(404).json({ success: false, message: 'Data persuratan tidak ditemukan' });
});

app.delete('/api/persuratan/:id', async (req, res) => {
  const { id } = req.params;
  const pool = await getDbConnection();
  if (pool) {
    try {
      await pool.query('DELETE FROM layanan_persuratan WHERE id = ?', [id]);
      return res.json({ success: true, message: 'Surat berhasil dihapus' });
    } catch (e) { console.error(e); }
  }
  memoryDatabase.layanan_persuratan = memoryDatabase.layanan_persuratan.filter(s => s.id != id);
  res.json({ success: true, message: 'Surat berhasil dihapus' });
});

// SISTEM INFORMASI LEMBAGA (SIL) API
app.get('/api/lembaga', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const jenjang = req.query.jenjang || '';
  const offset = (page - 1) * limit;

  const pool = await getDbConnection();
  if (pool) {
    try {
      const searchPattern = `%${search}%`;
      let queryCount = 'SELECT COUNT(*) as total FROM sistem_informasi_lembaga WHERE (nama_sekolah LIKE ? OR npsn LIKE ? OR kabupaten_kota LIKE ?)';
      let queryData = 'SELECT * FROM sistem_informasi_lembaga WHERE (nama_sekolah LIKE ? OR npsn LIKE ? OR kabupaten_kota LIKE ?)';
      const queryParams = [searchPattern, searchPattern, searchPattern];

      if (jenjang) {
        queryCount += ' AND jenjang = ?';
        queryData += ' AND jenjang = ?';
        queryParams.push(jenjang);
      }

      const [countResult] = await pool.query(queryCount, queryParams);
      const total = countResult[0].total;

      queryData += ' ORDER BY id DESC LIMIT ? OFFSET ?';
      const [rows] = await pool.query(queryData, [...queryParams, limit, offset]);

      return res.json({
        success: true,
        data: rows,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 }
      });
    } catch (e) { console.error(e); }
  }

  let filtered = memoryDatabase.sistem_informasi_lembaga.filter(l => {
    const matchSearch = l.nama_sekolah.toLowerCase().includes(search.toLowerCase()) ||
                        l.npsn.includes(search) ||
                        l.kabupaten_kota.toLowerCase().includes(search.toLowerCase());
    const matchJenjang = jenjang ? l.jenjang === jenjang : true;
    return matchSearch && matchJenjang;
  });
  filtered.sort((a, b) => b.id - a.id);
  const total = filtered.length;
  const data = filtered.slice(offset, offset + limit);

  return res.json({
    success: true,
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 }
  });
});

app.post('/api/lembaga', async (req, res) => {
  const { npsn, nama_sekolah, jenjang, kabupaten_kota, alamat, kepala_sekolah, jumlah_siswa, jumlah_guru, akreditasi, kontak } = req.body;

  const pool = await getDbConnection();
  if (pool) {
    try {
      const [result] = await pool.query(
        'INSERT INTO sistem_informasi_lembaga (npsn, nama_sekolah, jenjang, kabupaten_kota, alamat, kepala_sekolah, jumlah_siswa, jumlah_guru, akreditasi, kontak) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [npsn, nama_sekolah, jenjang, kabupaten_kota, alamat, kepala_sekolah, jumlah_siswa || 0, jumlah_guru || 0, akreditasi || 'A', kontak || '']
      );
      return res.status(201).json({ success: true, message: 'Data lembaga berhasil ditambahkan', data: { id: result.insertId } });
    } catch (e) { console.error(e); }
  }

  const newItem = {
    id: memoryDatabase.sistem_informasi_lembaga.length + 1,
    npsn,
    nama_sekolah,
    jenjang,
    kabupaten_kota,
    alamat,
    kepala_sekolah,
    jumlah_siswa: parseInt(jumlah_siswa) || 0,
    jumlah_guru: parseInt(jumlah_guru) || 0,
    akreditasi: akreditasi || 'A',
    kontak: kontak || ''
  };
  memoryDatabase.sistem_informasi_lembaga.unshift(newItem);
  res.status(201).json({ success: true, message: 'Data lembaga berhasil ditambahkan', data: newItem });
});

app.put('/api/lembaga/:id', async (req, res) => {
  const { id } = req.params;
  const { npsn, nama_sekolah, jenjang, kabupaten_kota, alamat, kepala_sekolah, jumlah_siswa, jumlah_guru, akreditasi, kontak } = req.body;

  const pool = await getDbConnection();
  if (pool) {
    try {
      await pool.query(
        'UPDATE sistem_informasi_lembaga SET npsn=?, nama_sekolah=?, jenjang=?, kabupaten_kota=?, alamat=?, kepala_sekolah=?, jumlah_siswa=?, jumlah_guru=?, akreditasi=?, kontak=? WHERE id=?',
        [npsn, nama_sekolah, jenjang, kabupaten_kota, alamat, kepala_sekolah, jumlah_siswa, jumlah_guru, akreditasi, kontak, id]
      );
      return res.json({ success: true, message: 'Data lembaga berhasil diperbarui' });
    } catch (e) { console.error(e); }
  }

  const index = memoryDatabase.sistem_informasi_lembaga.findIndex(l => l.id == id);
  if (index !== -1) {
    memoryDatabase.sistem_informasi_lembaga[index] = {
      ...memoryDatabase.sistem_informasi_lembaga[index],
      npsn, nama_sekolah, jenjang, kabupaten_kota, alamat, kepala_sekolah,
      jumlah_siswa: parseInt(jumlah_siswa),
      jumlah_guru: parseInt(jumlah_guru),
      akreditasi, kontak
    };
    return res.json({ success: true, message: 'Data lembaga berhasil diperbarui', data: memoryDatabase.sistem_informasi_lembaga[index] });
  }
  res.status(404).json({ success: false, message: 'Data lembaga tidak ditemukan' });
});

app.delete('/api/lembaga/:id', async (req, res) => {
  const { id } = req.params;
  const pool = await getDbConnection();
  if (pool) {
    try {
      await pool.query('DELETE FROM sistem_informasi_lembaga WHERE id = ?', [id]);
      return res.json({ success: true, message: 'Data lembaga berhasil dihapus' });
    } catch (e) { console.error(e); }
  }
  memoryDatabase.sistem_informasi_lembaga = memoryDatabase.sistem_informasi_lembaga.filter(l => l.id != id);
  res.json({ success: true, message: 'Data lembaga berhasil dihapus' });
});

// PENGURUS YAYASAN API
app.get('/api/pengurus', async (req, res) => {
  const search = req.query.search || '';
  const pool = await getDbConnection();
  if (pool) {
    try {
      const searchPattern = `%${search}%`;
      const [rows] = await pool.query(
        'SELECT * FROM pengurus WHERE nama LIKE ? OR jabatan LIKE ? OR kategori LIKE ? ORDER BY urutan ASC, id ASC',
        [searchPattern, searchPattern, searchPattern]
      );
      return res.json({ success: true, data: rows });
    } catch (e) { console.error(e); }
  }

  let filtered = memoryDatabase.pengurus.filter(p =>
    p.nama.toLowerCase().includes(search.toLowerCase()) ||
    p.jabatan.toLowerCase().includes(search.toLowerCase()) ||
    p.kategori.toLowerCase().includes(search.toLowerCase())
  );
  filtered.sort((a, b) => a.urutan - b.urutan);
  return res.json({ success: true, data: filtered });
});

app.post('/api/pengurus', upload.single('foto'), async (req, res) => {
  const { nama, jabatan, kategori, deskripsi, urutan } = req.body;
  const foto = req.file ? `/uploads/${req.file.filename}` : null;

  const pool = await getDbConnection();
  if (pool) {
    try {
      const [result] = await pool.query(
        'INSERT INTO pengurus (nama, jabatan, kategori, foto, deskripsi, urutan) VALUES (?, ?, ?, ?, ?, ?)',
        [nama, jabatan, kategori || 'Pengurus Harian', foto, deskripsi || '', parseInt(urutan) || 1]
      );
      return res.status(201).json({ success: true, message: 'Data pengurus berhasil ditambahkan', data: { id: result.insertId } });
    } catch (e) { console.error(e); }
  }

  const newItem = {
    id: memoryDatabase.pengurus.length + 1,
    nama,
    jabatan,
    kategori: kategori || 'Pengurus Harian',
    foto,
    deskripsi: deskripsi || '',
    urutan: parseInt(urutan) || 1
  };
  memoryDatabase.pengurus.push(newItem);
  res.status(201).json({ success: true, message: 'Data pengurus berhasil ditambahkan', data: newItem });
});

app.put('/api/pengurus/:id', upload.single('foto'), async (req, res) => {
  const { id } = req.params;
  const { nama, jabatan, kategori, deskripsi, urutan } = req.body;
  let foto = req.file ? `/uploads/${req.file.filename}` : undefined;

  const pool = await getDbConnection();
  if (pool) {
    try {
      if (foto) {
        await pool.query(
          'UPDATE pengurus SET nama=?, jabatan=?, kategori=?, deskripsi=?, urutan=?, foto=? WHERE id=?',
          [nama, jabatan, kategori, deskripsi, parseInt(urutan) || 1, foto, id]
        );
      } else {
        await pool.query(
          'UPDATE pengurus SET nama=?, jabatan=?, kategori=?, deskripsi=?, urutan=? WHERE id=?',
          [nama, jabatan, kategori, deskripsi, parseInt(urutan) || 1, id]
        );
      }
      return res.json({ success: true, message: 'Data pengurus berhasil diperbarui' });
    } catch (e) { console.error(e); }
  }

  const index = memoryDatabase.pengurus.findIndex(p => p.id == id);
  if (index !== -1) {
    memoryDatabase.pengurus[index] = {
      ...memoryDatabase.pengurus[index],
      nama,
      jabatan,
      kategori,
      deskripsi,
      urutan: parseInt(urutan) || 1,
      ...(foto ? { foto } : {})
    };
    return res.json({ success: true, message: 'Data pengurus berhasil diperbarui', data: memoryDatabase.pengurus[index] });
  }
  res.status(404).json({ success: false, message: 'Data pengurus tidak ditemukan' });
});

app.delete('/api/pengurus/:id', async (req, res) => {
  const { id } = req.params;
  const pool = await getDbConnection();
  if (pool) {
    try {
      await pool.query('DELETE FROM pengurus WHERE id = ?', [id]);
      return res.json({ success: true, message: 'Data pengurus berhasil dihapus' });
    } catch (e) { console.error(e); }
  }
  memoryDatabase.pengurus = memoryDatabase.pengurus.filter(p => p.id != id);
  res.json({ success: true, message: 'Data pengurus berhasil dihapus' });
});

memoryDatabase.settings = {
  hero_title: 'Pendidikan Bermutu, Generasi Berkarakter',
  hero_subtitle: 'Website resmi Yayasan Pembina Lembaga Pendidikan Dasar dan Menengah PGRI Jawa Timur sebagai sarana informasi, digitalisasi persuratan, dan integrasi lembaga sekolah se-Jawa Timur.',
  hero_image: null,
  title_sambutan_home: 'Selamat Datang di Website Resmi Yayasan Pembina Lembaga Dikdasmen PGRI Jawa Timur',
  quote_sambutan_home: 'Kami meyakini bahwa pendidikan merupakan fondasi utama dalam membangun sumber daya manusia yang unggul, berkarakter, berintegritas, serta mampu menjawab tantangan zaman. Yayasan Pembina Lembaga Dikdasmen PGRI Jawa Timur berkomitmen untuk terus meningkatkan mutu tata kelola yayasan, memperkuat kualitas layanan pendidikan, serta mendukung profesionalisme pendidik.',
  nama_ketua: 'Drs. H. Winadi, M.Pd',
  jabatan_ketua: 'Ketua Yayasan Dikdasmen PGRI Jawa Timur',
  foto_ketua: null,
  logo_lambang: null,
  lambang_desc: 'Lambang Resmi Yayasan Pembina Lembaga Pendidikan Dasar dan Menengah PGRI Jawa Timur memiliki unsur utama berupa sayap bulu, suluh obor, serta warna dasar yang melambangkan pengabdian mulia dunia pendidikan.',
  sejarah_yayasan: `Yayasan Pembina Lembaga Pendidikan (YPLP) PGRI didirikan sebagai badan khusus Persatuan Guru Republik Indonesia yang bertugas membina, mengelola, dan mengikhtiarkan perkembangan lembaga pendidikan persekolahan PGRI di seluruh jenjang pendidikan dasar dan menengah.

Di Jawa Timur, YPLP Dikdasmen PGRI tumbuh dan berkembang pesat seiring tingginya kebutuhan masyarakat akan pendidikan berkualitas, berkarakter nasionalis, dan terjangkau. Berawal dari inisiatif para tokoh pendidik PGRI Jawa Timur untuk memberikan wadah formal bagi sekolah-sekolah swasta PGRI agar memiliki standar kurikulum, tata kelola, serta sarana prasarana yang tangguh.

Hingga saat ini, YPLP Dikdasmen PGRI Jawa Timur terus bertransformasi menjadi pusat pengayoman modern yang memadukan semangat historis pengabdian guru dengan modernisasi digitalisasi layanan pendidikan.`,
  visi_yayasan: `Menjadi lembaga pembina pendidikan yang unggul, profesional, berkarakter Pancasila, dan terdepan dalam mewujudkan pendidikan bermutu di Jawa Timur.`,
  misi_yayasan: `Meningkatkan mutu tata kelola lembaga pendidikan PGRI di seluruh kabupaten/kota se-Jawa Timur.
Mendorong profesionalisme, kesejahteraan, dan kompetensi tenaga pendidik dan kependidikan.
Mengembangkan digitalisasi layanan persuratan dan sistem informasi manajemen sekolah.
Membangun karakter generasi muda yang cerdas, berakhlak mulia, dan berdaya saing global.`,
  sambutan_ketua: `Assalamu'alaikum Warahmatullahi Wabarakatuh.
Salam sejahtera untuk kita semua.

Puji syukur ke hadirat Allah SWT atas segala rahmat dan karunia-Nya, sehingga Website Yayasan Pembina Lembaga Pendidikan Dasar dan Menengah (Dikdasmen) PGRI Jawa Timur dapat hadir sebagai media informasi, komunikasi, dan kolaborasi bagi seluruh keluarga besar PGRI serta masyarakat luas.

Selamat datang di website resmi Yayasan Pembina Lembaga Dikdasmen PGRI Jawa Timur.

Kami meyakini bahwa pendidikan merupakan fondasi utama dalam membangun sumber daya manusia yang unggul, berkarakter, berintegritas, serta mampu menjawab tantangan zaman. Oleh karena itu, Yayasan Pembina Lembaga Dikdasmen PGRI Jawa Timur berkomitmen untuk terus meningkatkan mutu tata kelola yayasan, memperkuat kualitas layanan pendidikan, mendukung profesionalisme tenaga pendidik dan kependidikan, serta mendorong lahirnya generasi yang cerdas, berakhlak mulia, kreatif, dan berdaya saing.

Website ini kami hadirkan sebagai wujud keterbukaan informasi sekaligus sarana untuk mempererat sinergi antara yayasan, sekolah, guru, tenaga kependidikan, orang tua, alumni, pemerintah, dan seluruh pemangku kepentingan. Melalui media ini, kami berharap masyarakat dapat memperoleh informasi yang akurat mengenai program, kegiatan, prestasi, serta berbagai inovasi yang dikembangkan oleh Yayasan Dikdasmen PGRI Jawa Timur.

Kami mengajak seluruh keluarga besar Lembaga Pendidikan PGRI Jawa Timur untuk terus menjaga semangat kebersamaan, profesionalisme, dan pengabdian dalam memajukan pendidikan. Dengan kolaborasi yang kuat, insya Allah kita dapat memberikan kontribusi nyata dalam mencerdaskan kehidupan bangsa serta mewujudkan pendidikan yang berkualitas, inklusif, dan berkelanjutan. Semangat kolaborasi dan pemanfaatan teknologi digital juga menjadi bagian penting dalam meningkatkan layanan dan transparansi lembaga pendidikan.

Akhir kata, kami mengucapkan terima kasih kepada seluruh pihak yang telah memberikan dukungan dan kepercayaan kepada Yayasan Dikdasmen PGRI Jawa Timur. Semoga Allah SWT senantiasa memberikan petunjuk, kekuatan, dan keberkahan kepada kita semua dalam mengemban amanah mencerdaskan generasi penerus bangsa.

Wassalamu'alaikum Warahmatullahi Wabarakatuh.`,
  stat_kabupaten: '38',
  stat_sekolah: '500+',
  stat_guru: '15.000+',
  stat_siswa: '100.000+',
  alamat_yayasan: 'Jl. Wonorejo Timur Blok A Nomor 43 – Rungkut – Surabaya, Kode Pos 60296',
  telepon_yayasan: '(031) 870-1234 / 870-1235',
  email_yayasan: 'yplpdmpgrijatim@gmail.com',
  website_yayasan: 'www.yplpdm_pgrijatim.com',
  jam_operasional: 'Senin - Jumat: 08.00 - 15.30 WIB'
};

// SETTINGS API (Dynamic Profil Yayasan & Ketua Info)
app.get('/api/settings', async (req, res) => {
  const pool = await getDbConnection();
  if (pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM settings');
      const settingsObj = {};
      rows.forEach(r => { settingsObj[r.key] = r.value; });
      return res.json({ success: true, data: settingsObj });
    } catch (e) { console.error(e); }
  }
  return res.json({ success: true, data: memoryDatabase.settings });
});

app.put('/api/settings', upload.fields([{ name: 'foto_ketua', maxCount: 1 }, { name: 'hero_image', maxCount: 1 }, { name: 'logo_lambang', maxCount: 1 }]), async (req, res) => {
  const {
    hero_title, hero_subtitle, title_sambutan_home, quote_sambutan_home,
    nama_ketua, jabatan_ketua, sambutan_ketua, sejarah_yayasan, visi_yayasan, misi_yayasan, lambang_desc,
    stat_kabupaten, stat_sekolah, stat_guru, stat_siswa,
    alamat_yayasan, telepon_yayasan, email_yayasan, website_yayasan, jam_operasional
  } = req.body;

  let foto_ketua = req.files && req.files['foto_ketua'] ? `/uploads/${req.files['foto_ketua'][0].filename}` : undefined;
  let hero_image = req.files && req.files['hero_image'] ? `/uploads/${req.files['hero_image'][0].filename}` : undefined;
  let logo_lambang = req.files && req.files['logo_lambang'] ? `/uploads/${req.files['logo_lambang'][0].filename}` : undefined;

  const pool = await getDbConnection();
  if (pool) {
    try {
      if (hero_title) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['hero_title', hero_title, hero_title]);
      if (hero_subtitle) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['hero_subtitle', hero_subtitle, hero_subtitle]);
      if (title_sambutan_home) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['title_sambutan_home', title_sambutan_home, title_sambutan_home]);
      if (quote_sambutan_home) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['quote_sambutan_home', quote_sambutan_home, quote_sambutan_home]);
      if (nama_ketua) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['nama_ketua', nama_ketua, nama_ketua]);
      if (jabatan_ketua) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['jabatan_ketua', jabatan_ketua, jabatan_ketua]);
      if (sambutan_ketua) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['sambutan_ketua', sambutan_ketua, sambutan_ketua]);
      if (sejarah_yayasan) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['sejarah_yayasan', sejarah_yayasan, sejarah_yayasan]);
      if (visi_yayasan) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['visi_yayasan', visi_yayasan, visi_yayasan]);
      if (misi_yayasan) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['misi_yayasan', misi_yayasan, misi_yayasan]);
      if (lambang_desc) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['lambang_desc', lambang_desc, lambang_desc]);
      if (stat_kabupaten) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['stat_kabupaten', stat_kabupaten, stat_kabupaten]);
      if (stat_sekolah) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['stat_sekolah', stat_sekolah, stat_sekolah]);
      if (stat_guru) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['stat_guru', stat_guru, stat_guru]);
      if (stat_siswa) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['stat_siswa', stat_siswa, stat_siswa]);
      if (alamat_yayasan) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['alamat_yayasan', alamat_yayasan, alamat_yayasan]);
      if (telepon_yayasan) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['telepon_yayasan', telepon_yayasan, telepon_yayasan]);
      if (email_yayasan) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['email_yayasan', email_yayasan, email_yayasan]);
      if (website_yayasan) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['website_yayasan', website_yayasan, website_yayasan]);
      if (jam_operasional) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['jam_operasional', jam_operasional, jam_operasional]);
      if (foto_ketua) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['foto_ketua', foto_ketua, foto_ketua]);
      if (hero_image) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['hero_image', hero_image, hero_image]);
      if (logo_lambang) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['logo_lambang', logo_lambang, logo_lambang]);

      const [rows] = await pool.query('SELECT * FROM settings');
      const settingsObj = {};
      rows.forEach(r => { settingsObj[r.key] = r.value; });
      return res.json({ success: true, message: 'Pengaturan Profil & Kontak Yayasan berhasil diperbarui', data: settingsObj });
    } catch (e) { console.error(e); }
  }

  if (hero_title) memoryDatabase.settings.hero_title = hero_title;
  if (hero_subtitle) memoryDatabase.settings.hero_subtitle = hero_subtitle;
  if (title_sambutan_home) memoryDatabase.settings.title_sambutan_home = title_sambutan_home;
  if (quote_sambutan_home) memoryDatabase.settings.quote_sambutan_home = quote_sambutan_home;
  if (nama_ketua) memoryDatabase.settings.nama_ketua = nama_ketua;
  if (jabatan_ketua) memoryDatabase.settings.jabatan_ketua = jabatan_ketua;
  if (sambutan_ketua) memoryDatabase.settings.sambutan_ketua = sambutan_ketua;
  if (sejarah_yayasan) memoryDatabase.settings.sejarah_yayasan = sejarah_yayasan;
  if (visi_yayasan) memoryDatabase.settings.visi_yayasan = visi_yayasan;
  if (misi_yayasan) memoryDatabase.settings.misi_yayasan = misi_yayasan;
  if (lambang_desc) memoryDatabase.settings.lambang_desc = lambang_desc;
  if (stat_kabupaten) memoryDatabase.settings.stat_kabupaten = stat_kabupaten;
  if (stat_sekolah) memoryDatabase.settings.stat_sekolah = stat_sekolah;
  if (stat_guru) memoryDatabase.settings.stat_guru = stat_guru;
  if (stat_siswa) memoryDatabase.settings.stat_siswa = stat_siswa;
  if (alamat_yayasan) memoryDatabase.settings.alamat_yayasan = alamat_yayasan;
  if (telepon_yayasan) memoryDatabase.settings.telepon_yayasan = telepon_yayasan;
  if (email_yayasan) memoryDatabase.settings.email_yayasan = email_yayasan;
  if (website_yayasan) memoryDatabase.settings.website_yayasan = website_yayasan;
  if (jam_operasional) memoryDatabase.settings.jam_operasional = jam_operasional;
  if (foto_ketua) memoryDatabase.settings.foto_ketua = foto_ketua;
  if (hero_image) memoryDatabase.settings.hero_image = hero_image;
  if (logo_lambang) memoryDatabase.settings.logo_lambang = logo_lambang;

  res.json({ success: true, message: 'Pengaturan Profil & Kontak Yayasan berhasil diperbarui', data: memoryDatabase.settings });
});

app.listen(PORT, () => {
  console.log(`Server Yayasan Dikdasmen PGRI Jatim running on http://localhost:${PORT}`);
});
