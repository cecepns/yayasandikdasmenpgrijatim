import React, { useState, useEffect } from 'react';
import { Database, Search, Building2, Users, GraduationCap, Award, MapPin, Phone, Filter } from 'lucide-react';
import { api } from '../utils/api';
import { API_ENDPOINTS } from '../utils/endpoints';
import { requestHandler } from '../utils/request';
import Pagination from '../components/Pagination';
import toast from 'react-hot-toast';
import AOS from 'aos';

export default function SistemInformasiPage() {
  const [lembagaList, setLembagaList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters & Pagination State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedJenjang, setSelectedJenjang] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // Debounce search effect (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch data
  useEffect(() => {
    fetchLembagaData(pagination.page, pagination.limit, debouncedSearch, selectedJenjang);
  }, [pagination.page, pagination.limit, debouncedSearch, selectedJenjang]);

  const fetchLembagaData = async (page, limit, querySearch, jenjangFilter) => {
    setLoading(true);
    const { data, error } = await requestHandler(() =>
      api.get(API_ENDPOINTS.LEMBAGA.LIST, {
        params: {
          page,
          limit,
          search: querySearch,
          jenjang: jenjangFilter
        }
      })
    );

    setLoading(false);
    if (error) {
      toast.error('Gagal memuat data lembaga');
    } else {
      setLembagaList(data.data || []);
      setPagination(data.pagination);
    }
  };

  return (
    <div className="bg-white py-12 lg:py-20 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3" data-aos="fade-up">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-yellow-50 text-yellow-800 text-xs font-bold uppercase tracking-wider border border-yellow-200">
            <Database className="w-4 h-4 text-yellow-600" />
            Portal Data Terpadu
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Sistem Informasi Lembaga (SIL) PGRI Jatim
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Direktori resmi data sekolah & lembaga pendidikan di bawah naungan Yayasan Pembina Lembaga Dikdasmen PGRI Jawa Timur.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4" data-aos="fade-up">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Realtime Search Input */}
            <div className="md:col-span-8 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                placeholder="Cari Nama Sekolah, NPSN, atau Kabupaten/Kota..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white text-sm"
              />
            </div>

            {/* Filter Jenjang */}
            <div className="md:col-span-4 relative">
              <Filter className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <select
                value={selectedJenjang}
                onChange={(e) => {
                  setSelectedJenjang(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white text-sm font-medium"
              >
                <option value="">Semua Jenjang Sekolah</option>
                <option value="TK/PAUD">TK / PAUD</option>
                <option value="SD/MI">SD / MI</option>
                <option value="SMP/MTs">SMP / MTs</option>
                <option value="SMA/MA">SMA / MA</option>
                <option value="SMK">SMK</option>
              </select>
            </div>

          </div>
        </div>

        {/* Table / Grid Content */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden" data-aos="fade-up">
          
          {loading ? (
            <div className="p-12 text-center text-slate-500 font-medium">
              Memuat data Sistem Informasi Lembaga...
            </div>
          ) : lembagaList.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700">Tidak ada data lembaga ditemukan</p>
              <p className="text-xs text-slate-400">Coba ubah kata kunci pencarian atau filter jenjang.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-6">NPSN & Nama Sekolah</th>
                    <th className="py-4 px-4">Jenjang & Wilayah</th>
                    <th className="py-4 px-4">Alamat & Kontak</th>
                    <th className="py-4 px-4">Kepala Sekolah</th>
                    <th className="py-4 px-4 text-center">Siswa / Guru</th>
                    <th className="py-4 px-4 text-center">Akreditasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lembagaList.map((item) => (
                    <tr key={item.id} className="hover:bg-red-50/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">{item.nama_sekolah}</div>
                        <div className="text-xs text-slate-500">NPSN: <span className="font-mono">{item.npsn}</span></div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold mb-1">
                          {item.jenjang}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span>{item.kabupaten_kota}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-600 max-w-xs">
                        <div className="font-medium text-slate-800 leading-snug">{item.alamat || '-'}</div>
                        {item.kontak && (
                          <div className="flex items-center gap-1 text-slate-500 font-mono text-[11px] mt-1">
                            <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>{item.kontak}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-xs font-semibold text-slate-800">
                        {item.kepala_sekolah}
                      </td>
                      <td className="py-4 px-4 text-center text-xs">
                        <span className="font-bold text-slate-800">{item.jumlah_siswa}</span> Siswa / <span className="font-bold text-slate-800">{item.jumlah_guru}</span> Guru
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-extrabold bg-emerald-100 text-emerald-800">
                          {item.akreditasi}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="p-4 border-t border-slate-100 bg-slate-50">
            <Pagination
              pagination={pagination}
              onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
              onLimitChange={(limit) => setPagination(prev => ({ ...prev, limit, page: 1 }))}
            />
          </div>

        </div>

      </div>
    </div>
  );
}
