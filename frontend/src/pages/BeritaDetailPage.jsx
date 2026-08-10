import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, BookOpen, Share2, Tag } from 'lucide-react';
import { api } from '../utils/api';
import { API_ENDPOINTS } from '../utils/endpoints';
import { requestHandler } from '../utils/request';
import toast from 'react-hot-toast';
import AOS from 'aos';

export default function BeritaDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchBeritaDetail();
  }, [id]);

  const fetchBeritaDetail = async () => {
    setLoading(true);
    const { data, error } = await requestHandler(() =>
      api.get(API_ENDPOINTS.BERITA.DETAIL(id))
    );
    setLoading(false);
    if (error || !data?.data) {
      toast.error('Berita tidak ditemukan');
      navigate('/berita');
    } else {
      setBerita(data.data);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: berita?.judul,
        url: window.location.href,
      }).catch(() => { });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Tautan berita berhasil disalin!');
    }
  };

  if (loading) {
    return (
      <div className="bg-white py-20 text-center text-slate-500 font-medium">
        Memuat detail berita...
      </div>
    );
  }

  if (!berita) return null;

  const imageUrl = berita.gambar
    ? (berita.gambar.startsWith('http') || berita.gambar.startsWith('/') ? berita.gambar : `https://api.kingcreativestudio.my.id/yayasan-pgri-jatim${berita.gambar}`)
    : null;

  return (
    <div className="bg-white py-12 lg:py-16 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Back Link */}
        <div>
          <Link
            to="/berita"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-red-700 transition-colors bg-slate-50 px-4 py-2 rounded-xl border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Berita & Pengumuman</span>
          </Link>
        </div>

        {/* Article Header */}
        <div className="space-y-4" data-aos="fade-up">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
            <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full border border-red-100 uppercase tracking-wider">
              {berita.kategori}
            </span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{berita.tanggal}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>{berita.penulis}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            {berita.judul}
          </h1>
        </div>

        {/* Image Thumbnail Full View */}
        {imageUrl && (
          <div className="w-full rounded-3xl overflow-hidden shadow-md border border-slate-200 bg-slate-100" data-aos="fade-up">
            <img
              src={imageUrl}
              alt={berita.judul}
              className="w-full max-h-[480px] object-cover"
            />
          </div>
        )}

        {/* Content Body */}
        <div
          className="prose max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4 pt-4 border-t border-slate-100"
          data-aos="fade-up"
          dangerouslySetInnerHTML={{ __html: berita.konten }}
        />

        {/* Footer Actions / Share */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-sm transition-colors"
          >
            <Share2 className="w-4 h-4 text-red-700" />
            <span>Bagikan Berita Ini</span>
          </button>

          <Link
            to="/berita"
            className="inline-flex items-center gap-2 text-sm font-bold text-red-700 hover:text-red-800"
          >
            <span>Lihat Berita Lainnya</span>
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </div>

      </div>
    </div>
  );
}
