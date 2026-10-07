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
const uploadBeritaMedia = upload.fields([
  { name: 'gambar', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]);

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'yayasan_dikdasmen_pgri_jatim',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Auto-migrate schema updates when connected to MySQL
async function autoMigrate() {
  try {
    const conn = await pool.getConnection();
    console.log('MySQL Database Connected Successfully.');
    conn.release();

    // 1. Ensure users table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        nama VARCHAR(100) NOT NULL,
        role ENUM('admin', 'editor', 'staff') DEFAULT 'editor',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ensure role column enum includes 'editor'
    await pool.query("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'editor', 'staff') DEFAULT 'editor'");

    // Ensure default admin user exists
    await pool.query(`
      INSERT INTO users (username, password, nama, role)
      SELECT 'admin', 'admin123', 'Administrator Yayasan PGRI Jatim', 'admin'
      WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin')
    `);

    // Ensure default editor (admin berita) exists
    await pool.query(`
      INSERT INTO users (username, password, nama, role)
      SELECT 'penulis', 'penulis123', 'Staff Publikasi & Berita PGRI', 'editor'
      WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'penulis')
    `);

    // 2. Ensure video columns exist in berita table
    const [colsVideo] = await pool.query("SHOW COLUMNS FROM berita LIKE 'video'");
    if (colsVideo.length === 0) {
      await pool.query("ALTER TABLE berita ADD COLUMN video VARCHAR(255) DEFAULT NULL AFTER gambar");
    }
    const [colsVideoUrl] = await pool.query("SHOW COLUMNS FROM berita LIKE 'video_url'");
    if (colsVideoUrl.length === 0) {
      await pool.query("ALTER TABLE berita ADD COLUMN video_url VARCHAR(255) DEFAULT NULL AFTER video");
    }
  } catch (err) {
    console.error('Database connection / migration warning:', err.message);
  }
}

autoMigrate();

// ---------------- API ENDPOINTS ----------------

// AUTH API
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username dan password wajib diisi' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    if (rows.length > 0) {
      const user = rows[0];
      delete user.password;
      return res.json({ success: true, message: 'Login berhasil', data: user });
    }
    return res.status(401).json({ success: false, message: 'Username atau password salah' });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan database: ' + err.message });
  }
});

// BERITA API (Support Pagination, Search, Limit)
app.get('/api/berita', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const offset = (page - 1) * limit;

  try {
    const searchPattern = `%${search}%`;
    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM berita WHERE judul LIKE ? OR konten LIKE ? OR kategori LIKE ?',
      [searchPattern, searchPattern, searchPattern]
    );
    const total = countResult[0].total;
    const [rows] = await pool.query(
      'SELECT * FROM berita WHERE judul LIKE ? OR konten LIKE ? OR kategori LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?',
      [searchPattern, searchPattern, searchPattern, limit, offset]
    );

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
  } catch (err) {
    console.error('Get berita error:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data berita: ' + err.message });
  }
});

app.get('/api/berita/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM berita WHERE id = ? OR slug = ?', [id, id]);
    if (rows.length > 0) {
      return res.json({ success: true, data: rows[0] });
    }
    return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
  } catch (err) {
    console.error('Get berita detail error:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil detail berita: ' + err.message });
  }
});

app.post('/api/berita', uploadBeritaMedia, async (req, res) => {
  const { judul, kategori, konten, penulis, video_url } = req.body;
  if (!judul || !konten) {
    return res.status(400).json({ success: false, message: 'Judul dan konten berita wajib diisi' });
  }

  const gambar = req.files && req.files['gambar'] ? `/uploads/${req.files['gambar'][0].filename}` : null;
  const video = req.files && req.files['video'] ? `/uploads/${req.files['video'][0].filename}` : null;
  const cleanVideoUrl = video_url && video_url.trim() !== '' ? video_url.trim() : null;
  const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();
  const tanggal = new Date().toISOString().split('T')[0];

  try {
    const [result] = await pool.query(
      'INSERT INTO berita (judul, slug, kategori, konten, gambar, video, video_url, penulis, tanggal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [judul, slug, kategori || 'Kegiatan', konten, gambar, video, cleanVideoUrl, penulis || 'Admin Dikdasmen PGRI', tanggal]
    );
    return res.status(201).json({ success: true, message: 'Berita berhasil dibuat', data: { id: result.insertId } });
  } catch (err) {
    console.error('Create berita error:', err);
    return res.status(500).json({ success: false, message: 'Gagal membuat berita: ' + err.message });
  }
});

app.put('/api/berita/:id', uploadBeritaMedia, async (req, res) => {
  const { id } = req.params;
  const { judul, kategori, konten, penulis, video_url, remove_video } = req.body;
  const gambar = req.files && req.files['gambar'] ? `/uploads/${req.files['gambar'][0].filename}` : undefined;
  const video = req.files && req.files['video'] ? `/uploads/${req.files['video'][0].filename}` : undefined;
  const isRemoveVideo = remove_video === 'true' || remove_video === true;
  const cleanVideoUrl = video_url !== undefined ? (video_url.trim() !== '' ? video_url.trim() : null) : undefined;

  try {
    let query = 'UPDATE berita SET judul=?, kategori=?, konten=?, penulis=?';
    const params = [judul, kategori, konten, penulis];

    if (gambar !== undefined) {
      query += ', gambar=?';
      params.push(gambar);
    }
    if (video !== undefined) {
      query += ', video=?';
      params.push(video);
    } else if (isRemoveVideo) {
      query += ', video=NULL';
    }

    if (cleanVideoUrl !== undefined) {
      query += ', video_url=?';
      params.push(cleanVideoUrl);
    } else if (isRemoveVideo) {
      query += ', video_url=NULL';
    }

    query += ' WHERE id=?';
    params.push(id);

    const [result] = await pool.query(query, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
    }
    return res.json({ success: true, message: 'Berita berhasil diperbarui' });
  } catch (err) {
    console.error('Update berita error:', err);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui berita: ' + err.message });
  }
});

app.delete('/api/berita/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM berita WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
    }
    return res.json({ success: true, message: 'Berita berhasil dihapus' });
  } catch (err) {
    console.error('Delete berita error:', err);
    return res.status(500).json({ success: false, message: 'Gagal menghapus berita: ' + err.message });
  }
});

// USERS API (KELOLA ADMIN & PENGGUNA)
app.get('/api/users', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const offset = (page - 1) * limit;

  try {
    const searchPattern = `%${search}%`;
    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM users WHERE username LIKE ? OR nama LIKE ? OR role LIKE ?',
      [searchPattern, searchPattern, searchPattern]
    );
    const total = countResult[0].total;
    const [rows] = await pool.query(
      'SELECT id, username, nama, role, created_at FROM users WHERE username LIKE ? OR nama LIKE ? OR role LIKE ? ORDER BY id ASC LIMIT ? OFFSET ?',
      [searchPattern, searchPattern, searchPattern, limit, offset]
    );
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
  } catch (err) {
    console.error('Get users error:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data user: ' + err.message });
  }
});

app.post('/api/users', async (req, res) => {
  const { username, password, nama, role } = req.body;
  if (!username || !password || !nama) {
    return res.status(400).json({ success: false, message: 'Nama, username, dan password wajib diisi' });
  }
  const assignedRole = role === 'admin' ? 'admin' : 'editor';

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Username sudah digunakan oleh akun lain' });
    }
    const [result] = await pool.query(
      'INSERT INTO users (username, password, nama, role) VALUES (?, ?, ?, ?)',
      [username, password, nama, assignedRole]
    );
    return res.status(201).json({ success: true, message: 'Akun admin berhasil dibuat', data: { id: result.insertId } });
  } catch (err) {
    console.error('Create user error:', err);
    return res.status(500).json({ success: false, message: 'Gagal membuat user: ' + err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, password, nama, role } = req.body;
  if (!username || !nama) {
    return res.status(400).json({ success: false, message: 'Nama dan username wajib diisi' });
  }
  const assignedRole = role === 'admin' ? 'admin' : 'editor';

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE username = ? AND id != ?', [username, id]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Username sudah digunakan oleh akun lain' });
    }
    let result;
    if (password && password.trim() !== '') {
      [result] = await pool.query('UPDATE users SET username=?, password=?, nama=?, role=? WHERE id=?', [username, password, nama, assignedRole, id]);
    } else {
      [result] = await pool.query('UPDATE users SET username=?, nama=?, role=? WHERE id=?', [username, nama, assignedRole, id]);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Akun tidak ditemukan' });
    }
    return res.json({ success: true, message: 'Akun admin berhasil diperbarui' });
  } catch (err) {
    console.error('Update user error:', err);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui user: ' + err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  if (id == 1) {
    return res.status(400).json({ success: false, message: 'Akun Super Admin utama tidak dapat dihapus' });
  }

  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Akun tidak ditemukan' });
    }
    return res.json({ success: true, message: 'Akun admin berhasil dihapus' });
  } catch (err) {
    console.error('Delete user error:', err);
    return res.status(500).json({ success: false, message: 'Gagal menghapus user: ' + err.message });
  }
});

// LAYANAN PERSURATAN API (FORM UMUM INSTANSI / LEMBAGA / PERSONAL)
app.get('/api/persuratan', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const offset = (page - 1) * limit;

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
  } catch (err) {
    console.error('Get persuratan error:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data persuratan: ' + err.message });
  }
});

app.get('/api/persuratan/lacak/:noResi', async (req, res) => {
  const { noResi } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM layanan_persuratan WHERE no_resi = ?', [noResi]);
    if (rows.length > 0) return res.json({ success: true, data: rows[0] });
    return res.status(404).json({ success: false, message: 'Nomor Resi / Surat tidak ditemukan' });
  } catch (err) {
    console.error('Lacak persuratan error:', err);
    return res.status(500).json({ success: false, message: 'Gagal melacak surat: ' + err.message });
  }
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
  } catch (err) {
    console.error('Create persuratan error:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengajukan surat: ' + err.message });
  }
});

app.put('/api/persuratan/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, catatan_admin } = req.body;

  try {
    const [result] = await pool.query('UPDATE layanan_persuratan SET status = ?, catatan_admin = ? WHERE id = ?', [status, catatan_admin, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data persuratan tidak ditemukan' });
    }
    return res.json({ success: true, message: 'Status persuratan berhasil diperbarui' });
  } catch (err) {
    console.error('Update status persuratan error:', err);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui status: ' + err.message });
  }
});

app.delete('/api/persuratan/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM layanan_persuratan WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data persuratan tidak ditemukan' });
    }
    return res.json({ success: true, message: 'Surat berhasil dihapus' });
  } catch (err) {
    console.error('Delete persuratan error:', err);
    return res.status(500).json({ success: false, message: 'Gagal menghapus surat: ' + err.message });
  }
});

// SISTEM INFORMASI LEMBAGA (SIL) API
app.get('/api/lembaga', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const jenjang = req.query.jenjang || '';
  const offset = (page - 1) * limit;

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
  } catch (err) {
    console.error('Get lembaga error:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data lembaga: ' + err.message });
  }
});

app.post('/api/lembaga', async (req, res) => {
  const { npsn, nama_sekolah, jenjang, kabupaten_kota, alamat, kepala_sekolah, jumlah_siswa, jumlah_guru, akreditasi, kontak } = req.body;
  if (!npsn || !nama_sekolah) {
    return res.status(400).json({ success: false, message: 'NPSN dan Nama Sekolah wajib diisi' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO sistem_informasi_lembaga (npsn, nama_sekolah, jenjang, kabupaten_kota, alamat, kepala_sekolah, jumlah_siswa, jumlah_guru, akreditasi, kontak) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [npsn, nama_sekolah, jenjang || 'SMA/MA', kabupaten_kota || '', alamat || '', kepala_sekolah || '', jumlah_siswa || 0, jumlah_guru || 0, akreditasi || 'A', kontak || '']
    );
    return res.status(201).json({ success: true, message: 'Data lembaga berhasil ditambahkan', data: { id: result.insertId } });
  } catch (err) {
    console.error('Create lembaga error:', err);
    return res.status(500).json({ success: false, message: 'Gagal menambahkan lembaga: ' + err.message });
  }
});

app.put('/api/lembaga/:id', async (req, res) => {
  const { id } = req.params;
  const { npsn, nama_sekolah, jenjang, kabupaten_kota, alamat, kepala_sekolah, jumlah_siswa, jumlah_guru, akreditasi, kontak } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE sistem_informasi_lembaga SET npsn=?, nama_sekolah=?, jenjang=?, kabupaten_kota=?, alamat=?, kepala_sekolah=?, jumlah_siswa=?, jumlah_guru=?, akreditasi=?, kontak=? WHERE id=?',
      [npsn, nama_sekolah, jenjang, kabupaten_kota, alamat, kepala_sekolah, jumlah_siswa, jumlah_guru, akreditasi, kontak, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data lembaga tidak ditemukan' });
    }
    return res.json({ success: true, message: 'Data lembaga berhasil diperbarui' });
  } catch (err) {
    console.error('Update lembaga error:', err);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui lembaga: ' + err.message });
  }
});

app.delete('/api/lembaga/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM sistem_informasi_lembaga WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data lembaga tidak ditemukan' });
    }
    return res.json({ success: true, message: 'Data lembaga berhasil dihapus' });
  } catch (err) {
    console.error('Delete lembaga error:', err);
    return res.status(500).json({ success: false, message: 'Gagal menghapus lembaga: ' + err.message });
  }
});

// PENGURUS YAYASAN API
app.get('/api/pengurus', async (req, res) => {
  const search = req.query.search || '';
  try {
    const searchPattern = `%${search}%`;
    const [rows] = await pool.query(
      'SELECT * FROM pengurus WHERE nama LIKE ? OR jabatan LIKE ? OR kategori LIKE ? ORDER BY urutan ASC, id ASC',
      [searchPattern, searchPattern, searchPattern]
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Get pengurus error:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data pengurus: ' + err.message });
  }
});

app.post('/api/pengurus', upload.single('foto'), async (req, res) => {
  const { nama, jabatan, kategori, deskripsi, urutan } = req.body;
  if (!nama || !jabatan) {
    return res.status(400).json({ success: false, message: 'Nama dan jabatan pengurus wajib diisi' });
  }
  const foto = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const [result] = await pool.query(
      'INSERT INTO pengurus (nama, jabatan, kategori, foto, deskripsi, urutan) VALUES (?, ?, ?, ?, ?, ?)',
      [nama, jabatan, kategori || 'Pengurus Harian', foto, deskripsi || '', parseInt(urutan) || 1]
    );
    return res.status(201).json({ success: true, message: 'Data pengurus berhasil ditambahkan', data: { id: result.insertId } });
  } catch (err) {
    console.error('Create pengurus error:', err);
    return res.status(500).json({ success: false, message: 'Gagal menambahkan pengurus: ' + err.message });
  }
});

app.put('/api/pengurus/:id', upload.single('foto'), async (req, res) => {
  const { id } = req.params;
  const { nama, jabatan, kategori, deskripsi, urutan } = req.body;
  let foto = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    let result;
    if (foto) {
      [result] = await pool.query(
        'UPDATE pengurus SET nama=?, jabatan=?, kategori=?, deskripsi=?, urutan=?, foto=? WHERE id=?',
        [nama, jabatan, kategori, deskripsi, parseInt(urutan) || 1, foto, id]
      );
    } else {
      [result] = await pool.query(
        'UPDATE pengurus SET nama=?, jabatan=?, kategori=?, deskripsi=?, urutan=? WHERE id=?',
        [nama, jabatan, kategori, deskripsi, parseInt(urutan) || 1, id]
      );
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data pengurus tidak ditemukan' });
    }
    return res.json({ success: true, message: 'Data pengurus berhasil diperbarui' });
  } catch (err) {
    console.error('Update pengurus error:', err);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui pengurus: ' + err.message });
  }
});

app.delete('/api/pengurus/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM pengurus WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data pengurus tidak ditemukan' });
    }
    return res.json({ success: true, message: 'Data pengurus berhasil dihapus' });
  } catch (err) {
    console.error('Delete pengurus error:', err);
    return res.status(500).json({ success: false, message: 'Gagal menghapus pengurus: ' + err.message });
  }
});

// SETTINGS API (Dynamic Profil Yayasan & Ketua Info)
app.get('/api/settings', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM settings');
    const settingsObj = {};
    rows.forEach(r => { settingsObj[r.key] = r.value; });
    return res.json({ success: true, data: settingsObj });
  } catch (err) {
    console.error('Get settings error:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil pengaturan: ' + err.message });
  }
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

  try {
    if (hero_title !== undefined) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['hero_title', hero_title, hero_title]);
    if (hero_subtitle !== undefined) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['hero_subtitle', hero_subtitle, hero_subtitle]);
    if (title_sambutan_home !== undefined) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['title_sambutan_home', title_sambutan_home, title_sambutan_home]);
    if (quote_sambutan_home !== undefined) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['quote_sambutan_home', quote_sambutan_home, quote_sambutan_home]);
    if (nama_ketua !== undefined) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['nama_ketua', nama_ketua, nama_ketua]);
    if (jabatan_ketua !== undefined) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['jabatan_ketua', jabatan_ketua, jabatan_ketua]);
    if (sambutan_ketua !== undefined) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['sambutan_ketua', sambutan_ketua, sambutan_ketua]);
    if (sejarah_yayasan !== undefined) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['sejarah_yayasan', sejarah_yayasan, sejarah_yayasan]);
    if (visi_yayasan !== undefined) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['visi_yayasan', visi_yayasan, visi_yayasan]);
    if (misi_yayasan !== undefined) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['misi_yayasan', misi_yayasan, misi_yayasan]);
    if (lambang_desc !== undefined) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['lambang_desc', lambang_desc, lambang_desc]);
    if (stat_kabupaten !== undefined) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['stat_kabupaten', stat_kabupaten, stat_kabupaten]);
    if (stat_sekolah !== undefined) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['stat_sekolah', stat_sekolah, stat_sekolah]);
    if (stat_guru !== undefined) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['stat_guru', stat_guru, stat_guru]);
    if (stat_siswa !== undefined) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['stat_siswa', stat_siswa, stat_siswa]);
    if (alamat_yayasan !== undefined) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['alamat_yayasan', alamat_yayasan, alamat_yayasan]);
    if (telepon_yayasan !== undefined) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['telepon_yayasan', telepon_yayasan, telepon_yayasan]);
    if (email_yayasan !== undefined) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['email_yayasan', email_yayasan, email_yayasan]);
    if (website_yayasan !== undefined) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['website_yayasan', website_yayasan, website_yayasan]);
    if (jam_operasional !== undefined) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['jam_operasional', jam_operasional, jam_operasional]);
    if (foto_ketua !== undefined) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['foto_ketua', foto_ketua, foto_ketua]);
    if (hero_image !== undefined) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['hero_image', hero_image, hero_image]);
    if (logo_lambang !== undefined) await pool.query('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?', ['logo_lambang', logo_lambang, logo_lambang]);

    const [rows] = await pool.query('SELECT * FROM settings');
    const settingsObj = {};
    rows.forEach(r => { settingsObj[r.key] = r.value; });
    return res.json({ success: true, message: 'Pengaturan Profil & Kontak Yayasan berhasil diperbarui', data: settingsObj });
  } catch (err) {
    console.error('Update settings error:', err);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui pengaturan: ' + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server Yayasan Dikdasmen PGRI Jatim running on http://localhost:${PORT}`);
});
