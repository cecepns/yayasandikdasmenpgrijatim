import React, { useState, useEffect } from 'react';
import { FileText, Search, Send, CheckCircle, Clock, AlertCircle, Upload, ShieldCheck, Mail, User, Phone, Building2, Calendar, Hash, FileCheck } from 'lucide-react';
import { api } from '../utils/api';
import { API_ENDPOINTS } from '../utils/endpoints';
import { requestHandler } from '../utils/request';
import toast from 'react-hot-toast';
import AOS from 'aos';
import { getImageUrl } from '../utils/image';

export default function PersuratanPage() {
  const [activeTab, setActiveTab] = useState('pengajuan'); // 'pengajuan' | 'lacak'
  const [loading, setLoading] = useState(false);

  // Form Pengajuan Surat General / Umum
  const [formData, setFormData] = useState({
    email: '',
    nama_pengirim: '',
    pengirim_surat: 'Sekolah / Lembaga PGRI',
    no_hp: '',
    kepada: 'Ketua Yayasan Dikdasmen PGRI Jawa Timur',
    unit_kerja: 'Pengurus Harian Yayasan',
    nomor_surat: '',
    tanggal_surat: new Date().toISOString().slice(0, 10),
    perihal: '',
    keterangan: '',
    file_lampiran: null
  });

  // Lacak Status State
  const [searchResi, setSearchResi] = useState('');
  const [lacakResult, setLacakResult] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      toast.error('Ukuran berkas maksimal 10 MB');
      return;
    }
    setFormData(prev => ({ ...prev, file_lampiran: file }));
  };

  const handleSubmitPengajuan = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.nama_pengirim || !formData.nomor_surat || !formData.perihal) {
      toast.error('Mohon isi semua bidang formulir wajib (*)');
      return;
    }
    if (!formData.file_lampiran) {
      toast.error('Mohon unggah berkas file surat (PDF / Gambar)');
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('email', formData.email);
    data.append('nama_pengirim', formData.nama_pengirim);
    data.append('pengirim_surat', formData.pengirim_surat);
    data.append('no_hp', formData.no_hp);
    data.append('kepada', formData.kepada);
    data.append('unit_kerja', formData.unit_kerja);
    data.append('nomor_surat', formData.nomor_surat);
    data.append('tanggal_surat', formData.tanggal_surat);
    data.append('perihal', formData.perihal);
    data.append('keterangan', formData.keterangan);
    if (formData.file_lampiran) {
      data.append('file_lampiran', formData.file_lampiran);
    }

    const { data: resData, error } = await requestHandler(() =>
      api.post(API_ENDPOINTS.PERSURATAN.CREATE, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    );

    setLoading(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success(`Pengajuan Surat Berhasil! Nomor Resi: ${resData.data.no_resi}`);
      setSearchResi(resData.data.no_resi);
      setActiveTab('lacak');
      handleLacakResi(resData.data.no_resi);
      setFormData({
        email: '',
        nama_pengirim: '',
        pengirim_surat: 'Sekolah / Lembaga PGRI',
        no_hp: '',
        kepada: 'Ketua Yayasan Dikdasmen PGRI Jawa Timur',
        unit_kerja: 'Pengurus Harian Yayasan',
        nomor_surat: '',
        tanggal_surat: new Date().toISOString().slice(0, 10),
        perihal: '',
        keterangan: '',
        file_lampiran: null
      });
    }
  };

  const handleLacakResi = async (resiQuery) => {
    const query = resiQuery || searchResi;
    if (!query) {
      toast.error('Masukkan Nomor Resi Pengajuan Surat');
      return;
    }
    setSearching(true);
    setLacakResult(null);

    const { data, error } = await requestHandler(() =>
      api.get(API_ENDPOINTS.PERSURATAN.LACAK(query.trim()))
    );

    setSearching(false);
    if (error) {
      toast.error('Nomor resi tidak ditemukan');
    } else {
      setLacakResult(data.data);
      toast.success('Status resi surat ditemukan');
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen py-10 lg:py-16 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title Header Card */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-3xl p-8 shadow-xl text-center space-y-3" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 text-yellow-300 text-xs font-bold uppercase tracking-wider border border-white/20">
            <FileText className="w-4 h-4 text-yellow-300" />
            Layanan Persuratan Resmi
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Layanan Persuratan Yayasan Dikdasmen PGRI Jatim
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Formulir penerimaan & pengajuan surat resmi bagi Instansi Pemerintah, Dinas Pendidikan, Sekolah/Lembaga Swasta, Perusahaan, Organisasi, maupun Umum.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center bg-white p-2 rounded-2xl shadow-xs border border-slate-200">
          <button
            onClick={() => setActiveTab('pengajuan')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'pengajuan'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Form Pengisian Surat</span>
          </button>

          <button
            onClick={() => setActiveTab('lacak')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'lacak'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Lacak Status Surat (Resi)</span>
          </button>
        </div>

        {/* TAB 1: FORM PENGISIAN SURAT UMUM */}
        {activeTab === 'pengajuan' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg space-y-6" data-aos="fade-up">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900">Formulir Pengajuan / Penerimaan Surat</h2>
              <p className="text-xs text-red-600 font-semibold mt-1">* Menunjukkan pertanyaan yang wajib diisi</p>
            </div>

            <form onSubmit={handleSubmitPengajuan} className="space-y-6">

              {/* 1. Email */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
                <label className="block text-sm font-bold text-slate-900">
                  Email <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="nama.email@domain.com"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-sm"
                  />
                </div>
              </div>

              {/* 2. Nama Pengirim */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
                <label className="block text-sm font-bold text-slate-900">
                  Nama Pengirim <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="nama_pengirim"
                    value={formData.nama_pengirim}
                    onChange={handleInputChange}
                    placeholder="Tuliskan nama lengkap pengirim..."
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-sm"
                  />
                </div>
              </div>

              {/* 3. Pengirim Surat (Kategori Instansi/Lembaga) */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
                <label className="block text-sm font-bold text-slate-900">
                  Pengirim Surat / Instansi / Kategori <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <select
                    name="pengirim_surat"
                    value={formData.pengirim_surat}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-sm"
                  >
                    <option value="Sekolah / Lembaga PGRI">Sekolah / Lembaga Swasta PGRI</option>
                    <option value="Dinas Pendidikan / Pemerintah">Dinas Pendidikan / Instansi Pemerintah</option>
                    <option value="Perusahaan / Swasta">Perusahaan / Badan Swasta</option>
                    <option value="Organisasi Masyarakat">Organisasi / Yayasan Lain</option>
                    <option value="Umum / Perorangan">Umum / Perorangan</option>
                  </select>
                </div>
              </div>

              {/* 4. No HP / WhatsApp */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
                <label className="block text-sm font-bold text-slate-900">
                  No HP / WhatsApp <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="no_hp"
                    value={formData.no_hp}
                    onChange={handleInputChange}
                    placeholder="Contoh: 081234567890"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-sm"
                  />
                </div>
              </div>

              {/* 5. Kepada & 6. Unit Kerja Tujuan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
                  <label className="block text-sm font-bold text-slate-900">
                    Kepada (Tujuan Surat)
                  </label>
                  <input
                    type="text"
                    name="kepada"
                    value={formData.kepada}
                    onChange={handleInputChange}
                    placeholder="Contoh: Ketua Yayasan Dikdasmen PGRI Jatim"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-sm"
                  />
                </div>

                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
                  <label className="block text-sm font-bold text-slate-900">
                    Unit Kerja / Bidang Tujuan <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="unit_kerja"
                    value={formData.unit_kerja}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-sm"
                  >
                    <option value="Pengurus Harian Yayasan">Pengurus Harian Yayasan</option>
                    <option value="Sekretariat & Persuratan">Sekretariat & Persuratan</option>
                    <option value="Bidang Pendidikan">Bidang Pendidikan</option>
                    <option value="Bidang Keuangan & Aset">Bidang Keuangan & Aset</option>
                    <option value="Umum & Humas">Umum & Humas</option>
                  </select>
                </div>
              </div>

              {/* 7. Nomor Surat & 8. Tanggal Surat */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
                  <label className="block text-sm font-bold text-slate-900">
                    Nomor Surat <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="nomor_surat"
                      value={formData.nomor_surat}
                      onChange={handleInputChange}
                      placeholder="Contoh: 045/YPLP-PGRI/VIII/2026"
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-sm"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
                  <label className="block text-sm font-bold text-slate-900">
                    Tanggal Surat <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="date"
                      name="tanggal_surat"
                      value={formData.tanggal_surat}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* 9. Perihal Surat */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
                <label className="block text-sm font-bold text-slate-900">
                  Perihal Surat <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="perihal"
                  value={formData.perihal}
                  onChange={handleInputChange}
                  placeholder="Tuliskan perihal / subjek surat..."
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-sm"
                />
              </div>

              {/* Detail / Catatan Keterangan */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
                <label className="block text-sm font-bold text-slate-900">
                  Ringkasan Isi / Catatan Pengirim (Opsional)
                </label>
                <textarea
                  name="keterangan"
                  rows={3}
                  value={formData.keterangan}
                  onChange={handleInputChange}
                  placeholder="Tuliskan rincian pesan atau catatan singkat..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-sm"
                ></textarea>
              </div>

              {/* 10. Upload File Surat */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
                <label className="block text-sm font-bold text-slate-900">
                  Silakan Upload File Surat <span className="text-red-600">*</span>
                </label>
                <p className="text-xs text-slate-500">Upload 1 file yang didukung: PDF atau Image. Maksimal 10 MB.</p>
                
                <div className="pt-2">
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                    required
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer border border-slate-300 rounded-xl p-1 bg-white"
                  />
                </div>
              </div>

              {/* Disclaimer Note */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 leading-relaxed space-y-1">
                <span className="font-bold block text-emerald-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" /> Disclamer Pengiriman Berkas
                </span>
                <p>
                  Setiap dokumen yang dikirim melalui aplikasi ini merupakan dokumen resmi yang akan diverifikasi oleh Sekretariat Yayasan Pembina Lembaga Dikdasmen PGRI Jawa Timur.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-base rounded-2xl shadow-lg shadow-emerald-800/20 disabled:opacity-50 transition-all"
              >
                <Send className="w-5 h-5" />
                <span>{loading ? 'Mengirim Surat...' : 'Kirim Surat Resmi'}</span>
              </button>

            </form>
          </div>
        )}

        {/* TAB 2: LACAK RESI SURAT */}
        {activeTab === 'lacak' && (
          <div className="space-y-8" data-aos="fade-up">
            
            {/* Search Input Box */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    value={searchResi}
                    onChange={(e) => setSearchResi(e.target.value)}
                    placeholder="Masukkan Nomor Resi (Contoh: SRT-20260810-1234)"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-sm"
                  />
                </div>
                <button
                  onClick={() => handleLacakResi()}
                  disabled={searching}
                  className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>{searching ? 'Mencari...' : 'Lacak Status Resi'}</span>
                </button>
              </div>
            </div>

            {/* Tracking Result Box */}
            {lacakResult && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Nomor Resi Surat
                    </span>
                    <h3 className="text-xl font-extrabold text-emerald-900">{lacakResult.no_resi}</h3>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {lacakResult.status === 'Disetujui' && (
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                        <CheckCircle className="w-4 h-4" />
                        Disetujui / Selesai
                      </span>
                    )}
                    {lacakResult.status === 'Diproses' && (
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                        <Clock className="w-4 h-4" />
                        Dalam Proses Verifikasi
                      </span>
                    )}
                    {lacakResult.status === 'Ditolak' && (
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                        <AlertCircle className="w-4 h-4" />
                        Ditolak / Membutuhkan Perbaikan
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase">Nama Pengirim:</span>
                    <p className="font-bold text-slate-800">{lacakResult.nama_pengirim || lacakResult.nama_pengaju}</p>
                    <p className="text-xs text-slate-500">{lacakResult.email}</p>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase">Pengirim Surat / Instansi:</span>
                    <p className="font-bold text-slate-800">{lacakResult.pengirim_surat || lacakResult.lembaga_sekolah}</p>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase">Nomor & Tanggal Surat:</span>
                    <p className="font-bold text-slate-800">{lacakResult.nomor_surat || '-'} ({lacakResult.tanggal_surat || 'Hari ini'})</p>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase">Tujuan Unit Kerja:</span>
                    <p className="font-bold text-slate-800">{lacakResult.unit_kerja || 'Pengurus Harian'}</p>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-xs text-slate-500 font-semibold uppercase">Perihal Surat:</span>
                    <p className="font-bold text-slate-800">{lacakResult.perihal}</p>
                  </div>

                  {lacakResult.file_lampiran && (
                    <div className="sm:col-span-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-500 font-semibold uppercase block">File Lampiran Surat:</span>
                        <span className="text-xs text-slate-600">Berkas pendukung yang telah diunggah</span>
                      </div>
                      <a
                        href={getImageUrl(lacakResult.file_lampiran)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold border border-emerald-200 transition-colors shadow-sm"
                      >
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span>Lihat / Unduh File Lampiran</span>
                      </a>
                    </div>
                  )}
                </div>

                {lacakResult.catatan_admin && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                    <span className="font-bold text-slate-800 block mb-1">Catatan Sekretariat Yayasan:</span>
                    <p className="text-slate-600 italic">{lacakResult.catatan_admin}</p>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
