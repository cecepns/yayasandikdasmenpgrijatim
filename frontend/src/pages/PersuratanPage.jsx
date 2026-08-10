import React, { useState, useEffect } from 'react';
import { FileText, Search, Send, CheckCircle, Clock, AlertCircle, Upload, ShieldCheck, HelpCircle } from 'lucide-react';
import { api } from '../utils/api';
import { API_ENDPOINTS } from '../utils/endpoints';
import { requestHandler } from '../utils/request';
import toast from 'react-hot-toast';
import AOS from 'aos';

export default function PersuratanPage() {
  const [activeTab, setActiveTab] = useState('pengajuan'); // 'pengajuan' | 'lacak'
  const [loading, setLoading] = useState(false);

  // Form Pengajuan
  const [formData, setFormData] = useState({
    nama_pengaju: '',
    lembaga_sekolah: '',
    kabupaten_kota: 'Kota Surabaya',
    jenis_surat: 'Surat Rekomendasi Yayasan',
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
    setFormData(prev => ({ ...prev, file_lampiran: e.target.files[0] }));
  };

  const handleSubmitPengajuan = async (e) => {
    e.preventDefault();
    if (!formData.nama_pengaju || !formData.lembaga_sekolah || !formData.perihal) {
      toast.error('Mohon lengkapi formulir pengajuan surat');
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('nama_pengaju', formData.nama_pengaju);
    data.append('lembaga_sekolah', formData.lembaga_sekolah);
    data.append('kabupaten_kota', formData.kabupaten_kota);
    data.append('jenis_surat', formData.jenis_surat);
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
      toast.success(`Pengajuan Surat Berhasil! Nomor Resi Anda: ${resData.data.no_resi}`);
      setSearchResi(resData.data.no_resi);
      setActiveTab('lacak');
      handleLacakResi(resData.data.no_resi);
      setFormData({
        nama_pengaju: '',
        lembaga_sekolah: '',
        kabupaten_kota: 'Kota Surabaya',
        jenis_surat: 'Surat Rekomendasi Yayasan',
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
      toast.success('Status resi berhasil ditemukan');
    }
  };

  return (
    <div className="bg-white py-12 lg:py-20 text-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3" data-aos="fade-up">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider border border-red-100">
            <FileText className="w-4 h-4 text-red-600" />
            Layanan Layanan Persuratan Online
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pelayanan E-Surat Resmi Yayasan Dikdasmen PGRI Jatim
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Pengajuan rekomendasi, permohonan mutasi, izin operasional, serta lacak status pengajuan surat secara transparan.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center border-b border-slate-200">
          <button
            onClick={() => setActiveTab('pengajuan')}
            className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm border-b-2 transition-all ${
              activeTab === 'pengajuan'
                ? 'border-red-700 text-red-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Form Pengajuan Surat</span>
          </button>

          <button
            onClick={() => setActiveTab('lacak')}
            className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm border-b-2 transition-all ${
              activeTab === 'lacak'
                ? 'border-red-700 text-red-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Lacak Status Surat (Resi)</span>
          </button>
        </div>

        {/* TAB 1: FORM PENGAJUAN SURAT */}
        {activeTab === 'pengajuan' && (
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm" data-aos="fade-up">
            <form onSubmit={handleSubmitPengajuan} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Nama Pemohon / Kepala Sekolah *
                  </label>
                  <input
                    type="text"
                    name="nama_pengaju"
                    value={formData.nama_pengaju}
                    onChange={handleInputChange}
                    placeholder="Contoh: Drs. Supriyanto, M.Pd"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Lembaga / Sekolah PGRI *
                  </label>
                  <input
                    type="text"
                    name="lembaga_sekolah"
                    value={formData.lembaga_sekolah}
                    onChange={handleInputChange}
                    placeholder="Contoh: SMA PGRI 1 Surabaya"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Kabupaten / Kota Perwakilan *
                  </label>
                  <input
                    type="text"
                    name="kabupaten_kota"
                    value={formData.kabupaten_kota}
                    onChange={handleInputChange}
                    placeholder="Contoh: Kota Surabaya / Kab. Sidoarjo"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Jenis Surat *
                  </label>
                  <select
                    name="jenis_surat"
                    value={formData.jenis_surat}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white text-sm"
                  >
                    <option value="Surat Rekomendasi Yayasan">Surat Rekomendasi Yayasan</option>
                    <option value="Surat Pengantar Dinas">Surat Pengantar Dinas</option>
                    <option value="Surat Keterangan Lembaga">Surat Keterangan Lembaga</option>
                    <option value="Permohonan Mutasi Guru/KS">Permohonan Mutasi Guru/KS</option>
                    <option value="Perpanjangan Izin Operasional">Perpanjangan Izin Operasional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Perihal Surat *
                </label>
                <input
                  type="text"
                  name="perihal"
                  value={formData.perihal}
                  onChange={handleInputChange}
                  placeholder="Contoh: Pengajuan Rekomendasi Perpanjangan Akreditasi Sekolah"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Keterangan Tambahan / Detail
                </label>
                <textarea
                  name="keterangan"
                  rows={4}
                  value={formData.keterangan}
                  onChange={handleInputChange}
                  placeholder="Tuliskan rincian permohonan surat..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white text-sm"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Lampiran Berkas / Surat Pendukung (PDF/Docx/Gambar)
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer border border-slate-300 rounded-xl p-1 bg-white"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-red-700 hover:bg-red-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-700/20 disabled:opacity-50 transition-all"
                >
                  <Send className="w-5 h-5" />
                  <span>{loading ? 'Mengirim Pengajuan...' : 'Kirim Pengajuan Surat'}</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 2: LACAK RESI SURAT */}
        {activeTab === 'lacak' && (
          <div className="space-y-8" data-aos="fade-up">
            
            {/* Search Input Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    value={searchResi}
                    onChange={(e) => setSearchResi(e.target.value)}
                    placeholder="Masukkan Nomor Resi (Contoh: SRT-20260810-001)"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white text-sm"
                  />
                </div>
                <button
                  onClick={() => handleLacakResi()}
                  disabled={searching}
                  className="px-6 py-3 bg-red-700 hover:bg-red-800 text-white font-bold text-sm rounded-xl shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>{searching ? 'Mencari...' : 'Lacak Resi'}</span>
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
                    <h3 className="text-xl font-extrabold text-red-800">{lacakResult.no_resi}</h3>
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
                    <span className="text-xs text-slate-500 font-semibold uppercase">Nama Pemohon:</span>
                    <p className="font-bold text-slate-800">{lacakResult.nama_pengaju}</p>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase">Lembaga Sekolah:</span>
                    <p className="font-bold text-slate-800">{lacakResult.lembaga_sekolah} ({lacakResult.kabupaten_kota})</p>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase">Jenis & Perihal:</span>
                    <p className="font-bold text-slate-800">{lacakResult.jenis_surat} - {lacakResult.perihal}</p>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase">Tanggal Pengajuan:</span>
                    <p className="font-bold text-slate-800">{lacakResult.tanggal_pengajuan || 'Terbaru'}</p>
                  </div>
                </div>

                {lacakResult.catatan_admin && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                    <span className="font-bold text-slate-800 block mb-1">Catatan Pengurus Yayasan:</span>
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
