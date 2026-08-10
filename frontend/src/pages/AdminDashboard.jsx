import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, BookOpen, FileText, Database, Plus, Search,
  Trash2, Edit, CheckCircle, XCircle, Clock, Eye, AlertTriangle, Upload
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import AdminSidebar from '../components/AdminSidebar';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import { api } from '../utils/api';
import { API_ENDPOINTS } from '../utils/endpoints';
import { requestHandler } from '../utils/request';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);

  // Current Admin Tab ('berita' | 'persuratan' | 'lembaga')
  const [activeTab, setActiveTab] = useState('berita');

  // Shared Data & State
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  // Modal Create/Edit States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Specific Forms
  const [beritaForm, setBeritaForm] = useState({ judul: '', kategori: 'Kegiatan', konten: '', penulis: 'Admin Dikdasmen PGRI', gambar: null });
  const [suratStatusForm, setSuratStatusForm] = useState({ id: null, status: 'Disetujui', catatan_admin: '' });
  const [lembagaForm, setLembagaForm] = useState({
    npsn: '', nama_sekolah: '', jenjang: 'SMA/MA', kabupaten_kota: 'Kota Surabaya',
    alamat: '', kepala_sekolah: '', jumlah_siswa: 0, jumlah_guru: 0, akreditasi: 'A', kontak: ''
  });
  const [settingsForm, setSettingsForm] = useState({
    nama_ketua: 'Drs. H. Winadi, M.Pd',
    jabatan_ketua: 'Ketua Yayasan Dikdasmen PGRI Jawa Timur',
    sambutan_ketua: '',
    foto_ketua: null,
    current_foto: ''
  });
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Debounce search effect (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch data whenever activeTab, page, limit, or debouncedSearch changes
  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'settings') {
        loadSettings();
      } else {
        loadTabData(activeTab, pagination.page, pagination.limit, debouncedSearch);
      }
    }
  }, [isAuthenticated, activeTab, pagination.page, pagination.limit, debouncedSearch]);

  const loadSettings = async () => {
    setLoading(true);
    const { data, error } = await requestHandler(() => api.get(API_ENDPOINTS.SETTINGS.GET));
    setLoading(false);
    if (!error && data?.data) {
      setSettingsForm(prev => ({
        ...prev,
        nama_ketua: data.data.nama_ketua || 'Drs. H. Winadi, M.Pd',
        jabatan_ketua: data.data.jabatan_ketua || 'Ketua Yayasan Dikdasmen PGRI Jawa Timur',
        sambutan_ketua: data.data.sambutan_ketua || '',
        current_foto: data.data.foto_ketua || ''
      }));
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSettingsLoading(true);
    const formData = new FormData();
    formData.append('nama_ketua', settingsForm.nama_ketua);
    formData.append('jabatan_ketua', settingsForm.jabatan_ketua);
    formData.append('sambutan_ketua', settingsForm.sambutan_ketua);
    if (settingsForm.foto_ketua) {
      formData.append('foto_ketua', settingsForm.foto_ketua);
    }

    const { data, error } = await requestHandler(() =>
      api.put(API_ENDPOINTS.SETTINGS.UPDATE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    );

    setSettingsLoading(false);
    if (error) {
      toast.error('Gagal memperbarui pengaturan ketua yayasan');
    } else {
      toast.success('Profil & Sambutan Ketua Yayasan berhasil disimpan!');
      if (data?.data?.foto_ketua) {
        setSettingsForm(prev => ({ ...prev, current_foto: data.data.foto_ketua }));
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    const { data, error } = await requestHandler(() =>
      api.post(API_ENDPOINTS.AUTH.LOGIN, loginForm)
    );
    setLoginLoading(false);
    if (error) {
      toast.error(error);
    } else {
      setIsAuthenticated(true);
      toast.success('Login Berhasil! Selamat Datang di Admin Panel Yayasan.');
    }
  };

  const loadTabData = async (tab, page, limit, querySearch) => {
    setLoading(true);
    let endpoint = API_ENDPOINTS.BERITA.LIST;
    if (tab === 'persuratan') endpoint = API_ENDPOINTS.PERSURATAN.LIST;
    if (tab === 'lembaga') endpoint = API_ENDPOINTS.LEMBAGA.LIST;

    const { data, error } = await requestHandler(() =>
      api.get(endpoint, { params: { page, limit, search: querySearch } })
    );

    setLoading(false);
    if (error) {
      toast.error('Gagal memuat data');
    } else {
      setItems(data.data || []);
      setPagination(data.pagination);
    }
  };

  // Delete Action with Toast Confirm
  const handleDelete = (id, title) => {
    toast((t) => (
      <div className="space-y-3">
        <p className="font-semibold text-slate-800 text-sm">
          Apakah Anda yakin ingin menghapus data <strong className="text-red-700 font-bold">"{title}"</strong>?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold"
          >
            Batal
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              await confirmDelete(id);
            }}
            className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold"
          >
            Hapus
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const confirmDelete = async (id) => {
    let endpoint = API_ENDPOINTS.BERITA.DELETE(id);
    if (activeTab === 'persuratan') endpoint = API_ENDPOINTS.PERSURATAN.DELETE(id);
    if (activeTab === 'lembaga') endpoint = API_ENDPOINTS.LEMBAGA.DELETE(id);

    const { error } = await requestHandler(() => api.delete(endpoint));
    if (error) {
      toast.error('Gagal menghapus data');
    } else {
      toast.success('Data berhasil dihapus');
      loadTabData(activeTab, pagination.page, pagination.limit, debouncedSearch);
    }
  };

  // Submit Berita
  const handleSubmitBerita = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('judul', beritaForm.judul);
    data.append('kategori', beritaForm.kategori);
    data.append('konten', beritaForm.konten);
    data.append('penulis', beritaForm.penulis);
    if (beritaForm.gambar) data.append('gambar', beritaForm.gambar);

    let requestFn = () => api.post(API_ENDPOINTS.BERITA.CREATE, data, { headers: { 'Content-Type': 'multipart/form-data' } });
    if (editItem) {
      requestFn = () => api.put(API_ENDPOINTS.BERITA.UPDATE(editItem.id), data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }

    const { error } = await requestHandler(requestFn);
    if (error) {
      toast.error(error);
    } else {
      toast.success(editItem ? 'Berita berhasil diperbarui' : 'Berita baru berhasil diterbitkan');
      setIsModalOpen(false);
      loadTabData('berita', pagination.page, pagination.limit, debouncedSearch);
    }
  };

  // Submit Status Persuratan
  const handleSubmitStatusSurat = async (e) => {
    e.preventDefault();
    const { error } = await requestHandler(() =>
      api.put(API_ENDPOINTS.PERSURATAN.UPDATE_STATUS(suratStatusForm.id), {
        status: suratStatusForm.status,
        catatan_admin: suratStatusForm.catatan_admin
      })
    );
    if (error) {
      toast.error(error);
    } else {
      toast.success('Status persuratan berhasil diperbarui');
      setIsModalOpen(false);
      loadTabData('persuratan', pagination.page, pagination.limit, debouncedSearch);
    }
  };

  // Submit Data Lembaga SIL
  const handleSubmitLembaga = async (e) => {
    e.preventDefault();
    let requestFn = () => api.post(API_ENDPOINTS.LEMBAGA.CREATE, lembagaForm);
    if (editItem) {
      requestFn = () => api.put(API_ENDPOINTS.LEMBAGA.UPDATE(editItem.id), lembagaForm);
    }

    const { error } = await requestHandler(requestFn);
    if (error) {
      toast.error(error);
    } else {
      toast.success(editItem ? 'Data lembaga diperbarui' : 'Data lembaga berhasil ditambahkan');
      setIsModalOpen(false);
      loadTabData('lembaga', pagination.page, pagination.limit, debouncedSearch);
    }
  };

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <img src="/logo.png" alt="Logo PGRI" className="h-16 w-auto mx-auto" />
            <h1 className="text-2xl font-extrabold text-slate-900">Portal Admin Yayasan</h1>
            <p className="text-xs text-slate-500 font-medium">Dikdasmen PGRI Jawa Timur</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
                placeholder="Masukkan password admin (admin123)"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 bg-red-700 hover:bg-red-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-700/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>{loginLoading ? 'Memeriksa Access...' : 'Masuk ke Portal Admin'}</span>
            </button>
          </form>

          <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-xs text-slate-600 text-center">
            Demo Credentials: Username <strong className="text-red-700">admin</strong> / Password <strong className="text-red-700">admin123</strong>
          </div>
        </div>
      </div>
    );
  }

  // MAIN ADMIN DASHBOARD LAYOUT
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">

      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSearch('');
          setPagination({ page: 1, limit: 10, total: 0, totalPages: 1 });
        }}
        onLogout={() => setIsAuthenticated(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-6">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 capitalize">
              {activeTab === 'berita' && 'Kelola Berita & Informasi'}
              {activeTab === 'persuratan' && 'Manajemen Layanan Persuratan'}
              {activeTab === 'lembaga' && 'Sistem Informasi Lembaga (SIL)'}
            </h1>
            <p className="text-xs text-slate-500 font-medium">Panel Pengurus Yayasan Dikdasmen PGRI Jawa Timur</p>
          </div>

          {/* Create Button */}
          {activeTab !== 'persuratan' && (
            <button
              onClick={() => {
                setEditItem(null);
                if (activeTab === 'berita') {
                  setBeritaForm({ judul: '', kategori: 'Kegiatan', konten: '', penulis: 'Admin Dikdasmen PGRI', gambar: null });
                }
                if (activeTab === 'lembaga') {
                  setLembagaForm({
                    npsn: '', nama_sekolah: '', jenjang: 'SMA/MA', kabupaten_kota: 'Kota Surabaya',
                    alamat: '', kepala_sekolah: '', jumlah_siswa: 0, jumlah_guru: 0, akreditasi: 'A', kontak: ''
                  });
                }
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-sm rounded-xl shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah {activeTab === 'berita' ? 'Berita Baru' : 'Lembaga Sekolah'}</span>
            </button>
          )}
        </div>

        {/* Realtime Debounce Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-7 top-6" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            placeholder={`Cari real-time data ${activeTab}...`}
            className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white text-sm"
          />
        </div>

        {/* Table Content */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500 font-medium">Memuat data...</div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-medium">Tidak ada data ditemukan</div>
          ) : (
            <div className="overflow-x-auto">

              {/* 1. TABLE BERITA */}
              {activeTab === 'berita' && (
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-6">Judul Berita</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Tanggal & Penulis</th>
                      <th className="py-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-4 px-6 font-bold text-slate-800">{item.judul}</td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 bg-red-50 text-red-700 rounded-md text-xs font-semibold">
                            {item.kategori}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-xs text-slate-500">
                          {item.tanggal} ({item.penulis})
                        </td>
                        <td className="py-4 px-4 text-center space-x-2">
                          <button
                            onClick={() => {
                              setEditItem(item);
                              setBeritaForm({
                                judul: item.judul,
                                kategori: item.kategori,
                                konten: item.konten,
                                penulis: item.penulis,
                                gambar: null
                              });
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.judul)}
                            className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* 2. TABLE PERSURATAN */}
              {activeTab === 'persuratan' && (
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-6">No. Resi</th>
                      <th className="py-3 px-4">Pemohon / Sekolah</th>
                      <th className="py-3 px-4">Jenis & Perihal</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-4 px-6 font-mono font-bold text-red-800">{item.no_resi}</td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-800">{item.nama_pengaju}</div>
                          <div className="text-xs text-slate-500">{item.lembaga_sekolah} ({item.kabupaten_kota})</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-slate-800">{item.jenis_surat}</div>
                          <div className="text-xs text-slate-500">{item.perihal}</div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-800' :
                              item.status === 'Diproses' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center space-x-2">
                          <button
                            onClick={() => {
                              setSuratStatusForm({
                                id: item.id,
                                status: item.status,
                                catatan_admin: item.catatan_admin || ''
                              });
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold"
                          >
                            Update Status
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.no_resi)}
                            className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* 3. TABLE LEMBAGA (SIL) */}
              {activeTab === 'lembaga' && (
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-6">NPSN & Nama Sekolah</th>
                      <th className="py-3 px-4">Jenjang & Wilayah</th>
                      <th className="py-3 px-4">Kepala Sekolah</th>
                      <th className="py-3 px-4 text-center">Akreditasi</th>
                      <th className="py-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-800">{item.nama_sekolah}</div>
                          <div className="text-xs text-slate-500">NPSN: {item.npsn}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-slate-800">{item.jenjang}</div>
                          <div className="text-xs text-slate-500">{item.kabupaten_kota}</div>
                        </td>
                        <td className="py-4 px-4 text-xs font-semibold text-slate-700">{item.kepala_sekolah}</td>
                        <td className="py-4 px-4 text-center">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-xs">
                            {item.akreditasi}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center space-x-2">
                          <button
                            onClick={() => {
                              setEditItem(item);
                              setLembagaForm({ ...item });
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.nama_sekolah)}
                            className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* 4. SETTINGS FORM (PROFIL KETUA YAYASAN) */}
              {activeTab === 'settings' && (
                <div className="p-8 max-w-2xl">
                  <form onSubmit={handleSaveSettings} className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Nama Ketua Yayasan *</label>
                      <input
                        type="text"
                        value={settingsForm.nama_ketua}
                        onChange={(e) => setSettingsForm({ ...settingsForm, nama_ketua: e.target.value })}
                        required
                        className="w-full p-3 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Jabatan Ketua *</label>
                      <input
                        type="text"
                        value={settingsForm.jabatan_ketua}
                        onChange={(e) => setSettingsForm({ ...settingsForm, jabatan_ketua: e.target.value })}
                        required
                        className="w-full p-3 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Teks Kata Sambutan Ketua Yayasan *</label>
                      <textarea
                        rows={8}
                        value={settingsForm.sambutan_ketua}
                        onChange={(e) => setSettingsForm({ ...settingsForm, sambutan_ketua: e.target.value })}
                        placeholder="Tuliskan pidato / kata sambutan lengkap ketua yayasan..."
                        className="w-full p-3 rounded-xl border border-slate-300 text-sm font-normal leading-relaxed"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Upload Foto Resmi Ketua Yayasan</label>

                      {settingsForm.current_foto && (
                        <div className="flex items-center gap-4 mb-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                          <img
                            src={settingsForm.current_foto.startsWith('http') || settingsForm.current_foto.startsWith('/') ? settingsForm.current_foto : `https://api.kingcreativestudio.my.id/yayasan-pgri-jatim${settingsForm.current_foto}`}
                            alt="Foto Ketua Yayasan saat ini"
                            className="w-16 h-16 rounded-full object-cover border-2 border-red-700"
                          />
                          <div className="text-xs text-slate-600">
                            <span className="font-semibold block text-slate-900">Foto Ketua Saat Ini</span>
                            <span>Akan diganti jika Anda mengunggah berkas baru di bawah.</span>
                          </div>
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSettingsForm({ ...settingsForm, foto_ketua: e.target.files[0] })}
                        className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 border border-slate-300 rounded-xl p-1 bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={settingsLoading}
                      className="px-6 py-3 bg-red-700 hover:bg-red-800 text-white font-bold text-sm rounded-xl shadow-md disabled:opacity-50 transition-all"
                    >
                      {settingsLoading ? 'Menyimpan...' : 'Simpan Pengaturan Ketua'}
                    </button>
                  </form>
                </div>
              )}

            </div>
          )}

          {/* Pagination */}
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <Pagination
              pagination={pagination}
              onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
              onLimitChange={(limit) => setPagination(prev => ({ ...prev, limit, page: 1 }))}
            />
          </div>
        </div>

      </main>

      {/* MODAL FORM CREATE / EDIT */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          activeTab === 'berita' ? (editItem ? 'Edit Berita' : 'Tambah Berita Baru') :
            activeTab === 'persuratan' ? 'Update Status Persuratan' :
              (editItem ? 'Edit Data Lembaga' : 'Tambah Data Lembaga')
        }
      >
        {activeTab === 'berita' && (
          <form onSubmit={handleSubmitBerita} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Judul Berita / Kegiatan *</label>
              <input
                type="text"
                value={beritaForm.judul}
                onChange={(e) => setBeritaForm({ ...beritaForm, judul: e.target.value })}
                required
                placeholder="Contoh: Rapat Koordinasi Wilayah Dikdasmen PGRI Jatim"
                className="w-full p-3 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Kategori *</label>
                <select
                  value={beritaForm.kategori}
                  onChange={(e) => setBeritaForm({ ...beritaForm, kategori: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm"
                >
                  <option value="Kegiatan">Kegiatan</option>
                  <option value="Pendidikan">Pendidikan</option>
                  <option value="Pengumuman">Pengumuman</option>
                  <option value="Prestasi">Prestasi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Upload Foto Thumbnail Kegiatan</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBeritaForm({ ...beritaForm, gambar: e.target.files[0] })}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 border border-slate-300 rounded-xl p-1 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Deskripsi Lengkap (React Quill Rich Text) *</label>
              <div className="bg-white rounded-xl overflow-hidden border border-slate-300">
                <ReactQuill
                  theme="snow"
                  value={beritaForm.konten}
                  onChange={(content) => setBeritaForm({ ...beritaForm, konten: content })}
                  placeholder="Tuliskan isi berita / kegiatan lengkap dengan format rich text..."
                  className="h-48 mb-12"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-bold text-sm rounded-xl shadow-md transition-all">
              Simpan Berita & Kegiatan
            </button>
          </form>
        )}

        {activeTab === 'persuratan' && (
          <form onSubmit={handleSubmitStatusSurat} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Status Persuratan *</label>
              <select
                value={suratStatusForm.status}
                onChange={(e) => setSuratStatusForm({ ...suratStatusForm, status: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm"
              >
                <option value="Diproses">Diproses (Sedang Diverifikasi)</option>
                <option value="Disetujui">Disetujui (Selesai & Diterbitkan)</option>
                <option value="Ditolak">Ditolak (Membutuhkan Perbaikan)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Catatan Admin / Pengurus</label>
              <textarea
                rows={3}
                value={suratStatusForm.catatan_admin}
                onChange={(e) => setSuratStatusForm({ ...suratStatusForm, catatan_admin: e.target.value })}
                placeholder="Masukkan pesan atau arahan kepada pengaju..."
                className="w-full p-3 rounded-xl border border-slate-300 text-sm"
              ></textarea>
            </div>
            <button type="submit" className="w-full py-3 bg-red-700 text-white font-bold text-sm rounded-xl">
              Update Status Surat
            </button>
          </form>
        )}

        {activeTab === 'lembaga' && (
          <form onSubmit={handleSubmitLembaga} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">NPSN *</label>
                <input
                  type="text"
                  value={lembagaForm.npsn}
                  onChange={(e) => setLembagaForm({ ...lembagaForm, npsn: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Nama Sekolah *</label>
                <input
                  type="text"
                  value={lembagaForm.nama_sekolah}
                  onChange={(e) => setLembagaForm({ ...lembagaForm, nama_sekolah: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Jenjang *</label>
                <select
                  value={lembagaForm.jenjang}
                  onChange={(e) => setLembagaForm({ ...lembagaForm, jenjang: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                >
                  <option value="TK/PAUD">TK / PAUD</option>
                  <option value="SD/MI">SD / MI</option>
                  <option value="SMP/MTs">SMP / MTs</option>
                  <option value="SMA/MA">SMA / MA</option>
                  <option value="SMK">SMK</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Kabupaten/Kota *</label>
                <input
                  type="text"
                  value={lembagaForm.kabupaten_kota}
                  onChange={(e) => setLembagaForm({ ...lembagaForm, kabupaten_kota: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Kepala Sekolah *</label>
                <input
                  type="text"
                  value={lembagaForm.kepala_sekolah}
                  onChange={(e) => setLembagaForm({ ...lembagaForm, kepala_sekolah: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Akreditasi</label>
                <input
                  type="text"
                  value={lembagaForm.akreditasi}
                  onChange={(e) => setLembagaForm({ ...lembagaForm, akreditasi: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Alamat Sekolah</label>
              <textarea
                rows={2}
                value={lembagaForm.alamat}
                onChange={(e) => setLembagaForm({ ...lembagaForm, alamat: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
              ></textarea>
            </div>

            <button type="submit" className="w-full py-3 bg-red-700 text-white font-bold text-sm rounded-xl">
              Simpan Data Lembaga
            </button>
          </form>
        )}
      </Modal>

    </div>
  );
}
