import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, BookOpen, FileText, Database, Plus, Search,
  Trash2, Edit, CheckCircle, XCircle, Clock, Eye, AlertTriangle, Upload,
  UserCheck, Sparkles, Phone
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import { useParams, useNavigate, Navigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import { api } from '../utils/api';
import { API_ENDPOINTS } from '../utils/endpoints';
import { requestHandler } from '../utils/request';
import toast from 'react-hot-toast';
import { getImageUrl } from '../utils/image';

export default function AdminDashboard() {
  const { tab } = useParams();
  const navigate = useNavigate();

  // Auth state initialized from localStorage token
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('adminToken')));
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);

  // Derive activeTab from route params (e.g. /admin/berita, /admin/persuratan, /admin/sistem-informasi)
  const tabParamMap = {
    'berita': 'berita',
    'persuratan': 'persuratan',
    'sistem-informasi': 'lembaga',
    'lembaga': 'lembaga',
    'pengurus': 'pengurus',
    'settings': 'settings'
  };
  const activeTab = tabParamMap[tab] || 'berita';

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
  const [pengurusForm, setPengurusForm] = useState({
    nama: '', jabatan: '', kategori: 'Pengurus Harian', deskripsi: '', urutan: 1, foto: null
  });
  const [settingsForm, setSettingsForm] = useState({
    hero_title: 'Pendidikan Bermutu, Generasi Berkarakter',
    hero_subtitle: 'Website resmi Yayasan Pembina Lembaga Pendidikan Dasar dan Menengah PGRI Jawa Timur sebagai sarana informasi, digitalisasi persuratan, dan integrasi lembaga sekolah se-Jawa Timur.',
    hero_image: null,
    current_hero_image: '',
    title_sambutan_home: 'Selamat Datang di Website Resmi Yayasan Pembina Lembaga Dikdasmen PGRI Jawa Timur',
    quote_sambutan_home: 'Kami meyakini bahwa pendidikan merupakan fondasi utama dalam membangun sumber daya manusia yang unggul, berkarakter, berintegritas, serta mampu menjawab tantangan zaman. Yayasan Pembina Lembaga Dikdasmen PGRI Jawa Timur berkomitmen untuk terus meningkatkan mutu tata kelola yayasan, memperkuat kualitas layanan pendidikan, serta mendukung profesionalisme pendidik.',
    nama_ketua: 'Drs. H. Winadi, M.Pd',
    jabatan_ketua: 'Ketua Yayasan Dikdasmen PGRI Jawa Timur',
    sambutan_ketua: '',
    sejarah_yayasan: '',
    visi_yayasan: '',
    misi_yayasan: '',
    stat_kabupaten: '38',
    stat_sekolah: '500+',
    stat_guru: '15.000+',
    stat_siswa: '100.000+',
    alamat_yayasan: 'Jl. Wonorejo Timur Blok A Nomor 43 – Rungkut – Surabaya, Kode Pos 60296',
    telepon_yayasan: '(031) 870-1234 / 870-1235',
    email_yayasan: 'yplpdmpgrijatim@gmail.com',
    website_yayasan: 'www.yplpdm_pgrijatim.com',
    jam_operasional: 'Senin - Jumat: 08.00 - 15.30 WIB',
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
        hero_title: data.data.hero_title || 'Pendidikan Bermutu, Generasi Berkarakter',
        hero_subtitle: data.data.hero_subtitle || 'Website resmi Yayasan Pembina Lembaga Pendidikan Dasar dan Menengah PGRI Jawa Timur sebagai sarana informasi, digitalisasi persuratan, dan integrasi lembaga sekolah se-Jawa Timur.',
        current_hero_image: data.data.hero_image || '',
        title_sambutan_home: data.data.title_sambutan_home || 'Selamat Datang di Website Resmi Yayasan Pembina Lembaga Dikdasmen PGRI Jawa Timur',
        quote_sambutan_home: data.data.quote_sambutan_home || 'Kami meyakini bahwa pendidikan merupakan fondasi utama dalam membangun sumber daya manusia yang unggul, berkarakter, berintegritas, serta mampu menjawab tantangan zaman. Yayasan Pembina Lembaga Dikdasmen PGRI Jawa Timur berkomitmen untuk terus meningkatkan mutu tata kelola yayasan, memperkuat kualitas layanan pendidikan, serta mendukung profesionalisme pendidik.',
        nama_ketua: data.data.nama_ketua || 'Drs. H. Winadi, M.Pd',
        jabatan_ketua: data.data.jabatan_ketua || 'Ketua Yayasan Dikdasmen PGRI Jawa Timur',
        sambutan_ketua: data.data.sambutan_ketua || '',
        sejarah_yayasan: data.data.sejarah_yayasan || '',
        visi_yayasan: data.data.visi_yayasan || '',
        misi_yayasan: data.data.misi_yayasan || '',
        stat_kabupaten: data.data.stat_kabupaten || '38',
        stat_sekolah: data.data.stat_sekolah || '500+',
        stat_guru: data.data.stat_guru || '15.000+',
        stat_siswa: data.data.stat_siswa || '100.000+',
        alamat_yayasan: data.data.alamat_yayasan || 'Jl. Wonorejo Timur Blok A Nomor 43 – Rungkut – Surabaya, Kode Pos 60296',
        telepon_yayasan: data.data.telepon_yayasan || '(031) 870-1234 / 870-1235',
        email_yayasan: data.data.email_yayasan || 'yplpdmpgrijatim@gmail.com',
        website_yayasan: data.data.website_yayasan || 'www.yplpdm_pgrijatim.com',
        jam_operasional: data.data.jam_operasional || 'Senin - Jumat: 08.00 - 15.30 WIB',
        current_foto: data.data.foto_ketua || ''
      }));
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSettingsLoading(true);
    const formData = new FormData();
    formData.append('hero_title', settingsForm.hero_title);
    formData.append('hero_subtitle', settingsForm.hero_subtitle);
    formData.append('title_sambutan_home', settingsForm.title_sambutan_home);
    formData.append('quote_sambutan_home', settingsForm.quote_sambutan_home);
    formData.append('nama_ketua', settingsForm.nama_ketua);
    formData.append('jabatan_ketua', settingsForm.jabatan_ketua);
    formData.append('sambutan_ketua', settingsForm.sambutan_ketua);
    formData.append('sejarah_yayasan', settingsForm.sejarah_yayasan);
    formData.append('visi_yayasan', settingsForm.visi_yayasan);
    formData.append('misi_yayasan', settingsForm.misi_yayasan);
    formData.append('stat_kabupaten', settingsForm.stat_kabupaten);
    formData.append('stat_sekolah', settingsForm.stat_sekolah);
    formData.append('stat_guru', settingsForm.stat_guru);
    formData.append('stat_siswa', settingsForm.stat_siswa);
    formData.append('alamat_yayasan', settingsForm.alamat_yayasan);
    formData.append('telepon_yayasan', settingsForm.telepon_yayasan);
    formData.append('email_yayasan', settingsForm.email_yayasan);
    formData.append('website_yayasan', settingsForm.website_yayasan);
    formData.append('jam_operasional', settingsForm.jam_operasional);
    if (settingsForm.foto_ketua) {
      formData.append('foto_ketua', settingsForm.foto_ketua);
    }
    if (settingsForm.hero_image) {
      formData.append('hero_image', settingsForm.hero_image);
    }

    const { data, error } = await requestHandler(() =>
      api.put(API_ENDPOINTS.SETTINGS.UPDATE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    );

    setSettingsLoading(false);
    if (error) {
      toast.error('Gagal memperbarui profil yayasan');
    } else {
      toast.success('Profil, Hero & Sambutan Yayasan berhasil disimpan!');
      if (data?.data) {
        setSettingsForm(prev => ({
          ...prev,
          ...(data.data.foto_ketua ? { current_foto: data.data.foto_ketua } : {}),
          ...(data.data.hero_image ? { current_hero_image: data.data.hero_image } : {})
        }));
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
    if (tab === 'pengurus') endpoint = API_ENDPOINTS.PENGURUS.LIST;

    const { data, error } = await requestHandler(() =>
      api.get(endpoint, { params: { page, limit, search: querySearch } })
    );

    setLoading(false);
    if (error) {
      toast.error('Gagal memuat data');
    } else {
      setItems(data.data || []);
      if (data.pagination) setPagination(data.pagination);
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
    if (activeTab === 'pengurus') endpoint = API_ENDPOINTS.PENGURUS.DELETE(id);

    const { error } = await requestHandler(() => api.delete(endpoint));
    if (error) {
      toast.error('Gagal menghapus data');
    } else {
      toast.success('Data berhasil dihapus');
      loadTabData(activeTab, pagination.page, pagination.limit, debouncedSearch);
    }
  };

  // Submit Pengurus
  const handleSubmitPengurus = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('nama', pengurusForm.nama);
    data.append('jabatan', pengurusForm.jabatan);
    data.append('kategori', pengurusForm.kategori);
    data.append('deskripsi', pengurusForm.deskripsi);
    data.append('urutan', pengurusForm.urutan);
    if (pengurusForm.foto) data.append('foto', pengurusForm.foto);

    let requestFn = () => api.post(API_ENDPOINTS.PENGURUS.CREATE, data, { headers: { 'Content-Type': 'multipart/form-data' } });
    if (editItem) {
      requestFn = () => api.put(API_ENDPOINTS.PENGURUS.UPDATE(editItem.id), data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }

    const { error } = await requestHandler(requestFn);
    if (error) {
      toast.error(error);
    } else {
      toast.success(editItem ? 'Data pengurus berhasil diperbarui' : 'Pengurus baru berhasil ditambahkan');
      setIsModalOpen(false);
      loadTabData('pengurus', pagination.page, pagination.limit, debouncedSearch);
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
      // AUTH CHECK: If not authenticated, redirect to /admin/login
    }
  };

  // AUTH CHECK: If not authenticated, redirect to /admin/login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
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
              {activeTab === 'pengurus' && 'Manajemen Pengurus Yayasan'}
              {activeTab === 'settings' && 'Kelola Profil, Visi Misi & Sambutan'}
            </h1>
            <p className="text-xs text-slate-500 font-medium">Panel Pengurus Yayasan Dikdasmen PGRI Jawa Timur</p>
          </div>

          {/* Create Button */}
          {activeTab !== 'persuratan' && activeTab !== 'settings' && (
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
                if (activeTab === 'pengurus') {
                  setPengurusForm({ nama: '', jabatan: '', kategori: 'Pengurus Harian', deskripsi: '', urutan: 1, foto: null });
                }
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-sm rounded-xl shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>
                {activeTab === 'berita' && 'Tambah Berita Baru'}
                {activeTab === 'lembaga' && 'Tambah Lembaga Sekolah'}
                {activeTab === 'pengurus' && 'Tambah Pengurus Yayasan'}
              </span>
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
                          <div className="font-bold text-slate-800">{item.nama_pengirim || item.nama_pengaju}</div>
                          <div className="text-xs text-slate-500">{item.pengirim_surat || item.lembaga_sekolah} {item.no_hp ? `(${item.no_hp})` : ''}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-slate-800">No: {item.nomor_surat || '-'}</div>
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

              {/* 4. TABLE PENGURUS YAYASAN */}
              {activeTab === 'pengurus' && (
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-6">Urutan & Nama Pengurus</th>
                      <th className="py-3 px-4">Jabatan</th>
                      <th className="py-3 px-4">Kategori / Divisi</th>
                      <th className="py-3 px-4">Deskripsi Peran</th>
                      <th className="py-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                              {item.urutan}
                            </span>
                            <div>
                              <div className="font-bold text-slate-900">{item.nama}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-semibold text-red-700">{item.jabatan}</td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold">
                            {item.kategori}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-xs text-slate-600 max-w-xs">{item.deskripsi || '-'}</td>
                        <td className="py-4 px-4 text-center space-x-2">
                          <button
                            onClick={() => {
                              setEditItem(item);
                              setPengurusForm({
                                nama: item.nama,
                                jabatan: item.jabatan,
                                kategori: item.kategori || 'Pengurus Harian',
                                deskripsi: item.deskripsi || '',
                                urutan: item.urutan || 1,
                                foto: null
                              });
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.nama)}
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

              {/* 5. SETTINGS FORM (PROFIL YAYASAN & KETUA) */}
              {activeTab === 'settings' && (
                <div className="p-8 max-w-3xl space-y-8">
                  <form onSubmit={handleSaveSettings} className="space-y-6">
                    {/* Hero Section Settings */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                      <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-emerald-700" />
                        Pengaturan Banner Beranda (Hero Section)
                      </h3>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Judul Hero (Title Utama) *</label>
                        <input
                          type="text"
                          value={settingsForm.hero_title}
                          onChange={(e) => setSettingsForm({ ...settingsForm, hero_title: e.target.value })}
                          required
                          placeholder="Pendidikan Bermutu, Generasi Berkarakter"
                          className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Subjudul / Deskripsi Hero *</label>
                        <textarea
                          rows={3}
                          value={settingsForm.hero_subtitle}
                          onChange={(e) => setSettingsForm({ ...settingsForm, hero_subtitle: e.target.value })}
                          required
                          placeholder="Website resmi Yayasan Pembina Lembaga Pendidikan Dasar..."
                          className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Upload Gambar Hero Visual Beranda</label>
                        {settingsForm.current_hero_image && (
                          <div className="flex items-center gap-4 mb-4 p-3 bg-white border border-slate-200 rounded-2xl">
                            <img
                              src={getImageUrl(settingsForm.current_hero_image)}
                              alt="Gambar Hero Beranda saat ini"
                              className="w-24 h-16 object-cover rounded-xl border border-slate-200"
                            />
                            <div className="text-xs text-slate-600">
                              <span className="font-semibold block text-slate-900">Gambar Hero Saat Ini</span>
                              <span>Akan diganti jika Anda mengunggah berkas baru.</span>
                            </div>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setSettingsForm({ ...settingsForm, hero_image: e.target.files[0] })}
                          className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100 border border-slate-300 rounded-xl p-1 bg-white"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                      <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-red-700" />
                        Pengaturan Profil & Sambutan Ketua Yayasan (Beranda)
                      </h3>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Judul Sambutan Beranda *</label>
                        <input
                          type="text"
                          value={settingsForm.title_sambutan_home}
                          onChange={(e) => setSettingsForm({ ...settingsForm, title_sambutan_home: e.target.value })}
                          required
                          placeholder="Selamat Datang di Website Resmi Yayasan..."
                          className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Ringkasan Kutipan Sambutan Beranda *</label>
                        <textarea
                          rows={4}
                          value={settingsForm.quote_sambutan_home}
                          onChange={(e) => setSettingsForm({ ...settingsForm, quote_sambutan_home: e.target.value })}
                          required
                          placeholder="Kami meyakini bahwa pendidikan merupakan fondasi utama..."
                          className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white italic"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Nama Ketua Yayasan *</label>
                        <input
                          type="text"
                          value={settingsForm.nama_ketua}
                          onChange={(e) => setSettingsForm({ ...settingsForm, nama_ketua: e.target.value })}
                          required
                          className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Jabatan Ketua *</label>
                        <input
                          type="text"
                          value={settingsForm.jabatan_ketua}
                          onChange={(e) => setSettingsForm({ ...settingsForm, jabatan_ketua: e.target.value })}
                          required
                          className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Teks Kata Sambutan Ketua Yayasan *</label>
                        <textarea
                          rows={6}
                          value={settingsForm.sambutan_ketua}
                          onChange={(e) => setSettingsForm({ ...settingsForm, sambutan_ketua: e.target.value })}
                          placeholder="Tuliskan pidato / kata sambutan lengkap ketua yayasan..."
                          className="w-full p-3 rounded-xl border border-slate-300 text-sm font-normal leading-relaxed bg-white"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Upload Foto Resmi Ketua Yayasan</label>
                        {settingsForm.current_foto && (
                          <div className="flex items-center gap-4 mb-4 p-3 bg-white border border-slate-200 rounded-2xl">
                            <img
                              src={getImageUrl(settingsForm.current_foto)}
                              alt="Foto Ketua Yayasan saat ini"
                              className="w-16 h-16 rounded-full object-cover border-2 border-red-700"
                            />
                            <div className="text-xs text-slate-600">
                              <span className="font-semibold block text-slate-900">Foto Ketua Saat Ini</span>
                              <span>Akan diganti jika Anda mengunggah berkas baru.</span>
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
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                      <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-emerald-700" />
                        Pengaturan Visi, Misi & Sejarah Yayasan
                      </h3>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Visi Yayasan</label>
                        <textarea
                          rows={3}
                          value={settingsForm.visi_yayasan}
                          onChange={(e) => setSettingsForm({ ...settingsForm, visi_yayasan: e.target.value })}
                          placeholder="Visi resmi yayasan..."
                          className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Misi Yayasan (Pisahkan dengan baris baru untuk tiap poin)</label>
                        <textarea
                          rows={5}
                          value={settingsForm.misi_yayasan}
                          onChange={(e) => setSettingsForm({ ...settingsForm, misi_yayasan: e.target.value })}
                          placeholder="Tuliskan poin-poin misi..."
                          className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Sejarah Yayasan</label>
                        <textarea
                          rows={6}
                          value={settingsForm.sejarah_yayasan}
                          onChange={(e) => setSettingsForm({ ...settingsForm, sejarah_yayasan: e.target.value })}
                          placeholder="Teks sejarah singkat pembentukan yayasan..."
                          className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white"
                        ></textarea>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                      <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-600" />
                        Pengaturan Statistik Beranda (Counter Data)
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Kabupaten / Kota se-Jatim</label>
                          <input
                            type="text"
                            value={settingsForm.stat_kabupaten}
                            onChange={(e) => setSettingsForm({ ...settingsForm, stat_kabupaten: e.target.value })}
                            placeholder="Contoh: 38"
                            className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Sekolah PGRI</label>
                          <input
                            type="text"
                            value={settingsForm.stat_sekolah}
                            onChange={(e) => setSettingsForm({ ...settingsForm, stat_sekolah: e.target.value })}
                            placeholder="Contoh: 500+"
                            className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Guru & Pendidik</label>
                          <input
                            type="text"
                            value={settingsForm.stat_guru}
                            onChange={(e) => setSettingsForm({ ...settingsForm, stat_guru: e.target.value })}
                            placeholder="Contoh: 15.000+"
                            className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Siswa & Peserta Didik</label>
                          <input
                            type="text"
                            value={settingsForm.stat_siswa}
                            onChange={(e) => setSettingsForm({ ...settingsForm, stat_siswa: e.target.value })}
                            placeholder="Contoh: 100.000+"
                            className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                      <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                        <Phone className="w-5 h-5 text-emerald-700" />
                        Pengaturan Kontak & Alamat Yayasan (Footer & Kontak Page)
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Alamat Kantor Yayasan</label>
                          <textarea
                            rows={2}
                            value={settingsForm.alamat_yayasan}
                            onChange={(e) => setSettingsForm({ ...settingsForm, alamat_yayasan: e.target.value })}
                            placeholder="Tuliskan alamat lengkap kantor..."
                            className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white"
                          ></textarea>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Nomor Telepon / Fax</label>
                            <input
                              type="text"
                              value={settingsForm.telepon_yayasan}
                              onChange={(e) => setSettingsForm({ ...settingsForm, telepon_yayasan: e.target.value })}
                              placeholder="Contoh: (031) 870-1234 / 870-1235"
                              className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Email Resmi</label>
                            <input
                              type="email"
                              value={settingsForm.email_yayasan}
                              onChange={(e) => setSettingsForm({ ...settingsForm, email_yayasan: e.target.value })}
                              placeholder="Contoh: yplpdmpgrijatim@gmail.com"
                              className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Domain / Nama Website</label>
                            <input
                              type="text"
                              value={settingsForm.website_yayasan}
                              onChange={(e) => setSettingsForm({ ...settingsForm, website_yayasan: e.target.value })}
                              placeholder="Contoh: www.yplpdm_pgrijatim.com"
                              className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Jam Operasional Kantor</label>
                            <input
                              type="text"
                              value={settingsForm.jam_operasional}
                              onChange={(e) => setSettingsForm({ ...settingsForm, jam_operasional: e.target.value })}
                              placeholder="Contoh: Senin - Jumat: 08.00 - 15.30 WIB"
                              className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={settingsLoading}
                      className="w-full py-3.5 bg-red-700 hover:bg-red-800 text-white font-bold text-sm rounded-xl shadow-md disabled:opacity-50 transition-all"
                    >
                      {settingsLoading ? 'Menyimpan...' : 'Simpan Semua Pengaturan Profil'}
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
              activeTab === 'pengurus' ? (editItem ? 'Edit Pengurus Yayasan' : 'Tambah Pengurus Yayasan') :
                (editItem ? 'Edit Data Lembaga' : 'Tambah Data Lembaga')
        }
      >
        {activeTab === 'pengurus' && (
          <form onSubmit={handleSubmitPengurus} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Nama Lengkap Pengurus *</label>
              <input
                type="text"
                value={pengurusForm.nama}
                onChange={(e) => setPengurusForm({ ...pengurusForm, nama: e.target.value })}
                required
                placeholder="Contoh: Drs. H. Winadi, M.Pd"
                className="w-full p-3 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Jabatan *</label>
                <input
                  type="text"
                  value={pengurusForm.jabatan}
                  onChange={(e) => setPengurusForm({ ...pengurusForm, jabatan: e.target.value })}
                  required
                  placeholder="Contoh: Ketua Yayasan / Sekretaris"
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Kategori / Divisi</label>
                <select
                  value={pengurusForm.kategori}
                  onChange={(e) => setPengurusForm({ ...pengurusForm, kategori: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm"
                >
                  <option value="Pengurus Harian">Pengurus Harian</option>
                  <option value="Pembina">Pembina</option>
                  <option value="Pengawas">Pengawas</option>
                  <option value="Bidang Pendidikan">Bidang Pendidikan</option>
                  <option value="Bidang Keuangan & Aset">Bidang Keuangan & Aset</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Urutan Tampilan</label>
                <input
                  type="number"
                  value={pengurusForm.urutan}
                  onChange={(e) => setPengurusForm({ ...pengurusForm, urutan: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Upload Foto Pengurus (Opsional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPengurusForm({ ...pengurusForm, foto: e.target.files[0] })}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 border border-slate-300 rounded-xl p-1 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Deskripsi Tugas / Catatan Singkat</label>
              <textarea
                rows={3}
                value={pengurusForm.deskripsi}
                onChange={(e) => setPengurusForm({ ...pengurusForm, deskripsi: e.target.value })}
                placeholder="Tugas & wewenang pengurus..."
                className="w-full p-3 rounded-xl border border-slate-300 text-sm"
              ></textarea>
            </div>

            <button type="submit" className="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-bold text-sm rounded-xl shadow-md transition-all">
              Simpan Data Pengurus
            </button>
          </form>
        )}
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
