import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Calendar, User, ArrowRight } from 'lucide-react';
import { api } from '../utils/api';
import { API_ENDPOINTS } from '../utils/endpoints';
import { requestHandler } from '../utils/request';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import AOS from 'aos';

export default function BeritaPage() {
  const [beritaList, setBeritaList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  // Detail Modal
  const [selectedBerita, setSelectedBerita] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchBerita(pagination.page, pagination.limit, debouncedSearch);
  }, [pagination.page, pagination.limit, debouncedSearch]);

  const fetchBerita = async (page, limit, querySearch) => {
    setLoading(true);
    const { data, error } = await requestHandler(() =>
      api.get(API_ENDPOINTS.BERITA.LIST, {
        params: { page, limit, search: querySearch }
      })
    );

    setLoading(false);
    if (error) {
      toast.error('Gagal memuat daftar berita');
    } else {
      setBeritaList(data.data || []);
      setPagination(data.pagination);
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    }
  };

  return (
    <div className="bg-white py-12 lg:py-20 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3" data-aos="fade-up">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">
            <BookOpen className="w-4 h-4 text-blue-600" />
            Informasi Terkini
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Berita & Pengumuman Dikdasmen PGRI Jatim
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Kabar terbaru mengenai program kerja, kegiatan rakorwil, serta inovasi pendidikan sekolah PGRI se-Jawa Timur.
          </p>
        </div>

        {/* Realtime Search Bar */}
        <div className="max-w-xl mx-auto relative" data-aos="fade-up">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            placeholder="Cari berita atau kegiatan yayasan..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white text-sm shadow-xs"
          />
        </div>

        {/* Berita Grid */}
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-medium">
            Memuat berita...
          </div>
        ) : beritaList.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">
            Tidak ada berita ditemukan
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beritaList.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Thumbnail Image display */}
                {item.gambar && (
                  <div className="w-full h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={item.gambar.startsWith('http') || item.gambar.startsWith('/') ? item.gambar : `https://api.kingcreativestudio.my.id/yayasan-pgri-jatim${item.gambar}`}
                      alt={item.judul}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="px-3 py-1 bg-red-50 text-red-700 font-semibold rounded-full border border-red-100">
                      {item.kategori}
                    </span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.tanggal}</span>
                    </div>
                  </div>

                  <h2 className="font-bold text-slate-900 text-lg leading-snug line-clamp-2 hover:text-red-700 transition-colors">
                    {item.judul}
                  </h2>

                  <div
                    className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.konten }}
                  />
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.penulis}</span>
                  </div>

                  <Link
                    to={`/berita/${item.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-red-700 hover:text-red-800 transition-colors"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="pt-6">
          <Pagination
            pagination={pagination}
            onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
            onLimitChange={(limit) => setPagination(prev => ({ ...prev, limit, page: 1 }))}
          />
        </div>

        {/* Detail Berita Modal */}
        <Modal
          isOpen={!!selectedBerita}
          onClose={() => setSelectedBerita(null)}
          title={selectedBerita?.judul || 'Detail Berita'}
        >
          {selectedBerita && (
            <div className="space-y-4">
              {selectedBerita.gambar && (
                <div className="w-full h-64 bg-slate-100 rounded-2xl overflow-hidden mb-4">
                  <img
                    src={selectedBerita.gambar.startsWith('http') || selectedBerita.gambar.startsWith('/') ? selectedBerita.gambar : `https://api.kingcreativestudio.my.id/yayasan-pgri-jatim${selectedBerita.gambar}`}
                    alt={selectedBerita.judul}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-center gap-4 text-xs text-slate-500 border-b border-slate-100 pb-3">
                <span className="font-semibold text-red-700">{selectedBerita.kategori}</span>
                <span>•</span>
                <span>{selectedBerita.tanggal}</span>
                <span>•</span>
                <span>Penulis: {selectedBerita.penulis}</span>
              </div>

              <div
                className="text-slate-700 text-sm leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedBerita.konten }}
              />
            </div>
          )}
        </Modal>

      </div>
    </div>
  );
}
