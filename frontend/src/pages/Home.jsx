import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Award, Shield, FileText, Database, ArrowRight, CheckCircle2,
  Sparkles, BookOpen, Users, GraduationCap, Building2, MapPin, Calendar
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import heroImg from '../assets/hero-img.jpeg';
import heroBg from '../assets/hero-bg.png';
import { api } from '../utils/api';
import { API_ENDPOINTS } from '../utils/endpoints';
import { requestHandler } from '../utils/request';
import { getImageUrl } from '../utils/image';

export default function Home() {
  const [settings, setSettings] = useState({
    hero_title: 'Pendidikan Bermutu, Generasi Berkarakter',
    hero_subtitle: 'Website resmi Yayasan Pembina Lembaga Pendidikan Dasar dan Menengah PGRI Jawa Timur sebagai sarana informasi, digitalisasi persuratan, dan integrasi lembaga sekolah se-Jawa Timur.',
    hero_image: null,
    title_sambutan_home: 'Selamat Datang di Website Resmi Yayasan Pembina Lembaga Dikdasmen PGRI Jawa Timur',
    quote_sambutan_home: 'Kami meyakini bahwa pendidikan merupakan fondasi utama dalam membangun sumber daya manusia yang unggul, berkarakter, berintegritas, serta mampu menjawab tantangan zaman. Yayasan Pembina Lembaga Dikdasmen PGRI Jawa Timur berkomitmen untuk terus meningkatkan mutu tata kelola yayasan, memperkuat kualitas layanan pendidikan, serta mendukung profesionalisme pendidik.',
    nama_ketua: 'Drs. H. Winadi, M.Pd',
    jabatan_ketua: 'Ketua Yayasan Dikdasmen PGRI Jatim',
    foto_ketua: null,
    stat_kabupaten: '38',
    stat_sekolah: '500+',
    stat_guru: '15.000+',
    stat_siswa: '100.000+'
  });
  const [beritaList, setBeritaList] = useState([]);
  const [loadingBerita, setLoadingBerita] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      easing: 'ease-out-cubic'
    });
    fetchSettings();
    fetchLatestBerita();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await requestHandler(() => api.get(API_ENDPOINTS.SETTINGS.GET));
    if (!error && data?.data) {
      setSettings(prev => ({
        ...prev,
        hero_title: data.data.hero_title || prev.hero_title,
        hero_subtitle: data.data.hero_subtitle || prev.hero_subtitle,
        hero_image: data.data.hero_image || null,
        title_sambutan_home: data.data.title_sambutan_home || prev.title_sambutan_home,
        quote_sambutan_home: data.data.quote_sambutan_home || prev.quote_sambutan_home,
        nama_ketua: data.data.nama_ketua || prev.nama_ketua,
        jabatan_ketua: data.data.jabatan_ketua || prev.jabatan_ketua,
        foto_ketua: data.data.foto_ketua || null,
        stat_kabupaten: data.data.stat_kabupaten || '38',
        stat_sekolah: data.data.stat_sekolah || '500+',
        stat_guru: data.data.stat_guru || '15.000+',
        stat_siswa: data.data.stat_siswa || '100.000+'
      }));
    }
  };

  const fetchLatestBerita = async () => {
    setLoadingBerita(true);
    const { data, error } = await requestHandler(() =>
      api.get(API_ENDPOINTS.BERITA.LIST, { params: { page: 1, limit: 3 } })
    );
    setLoadingBerita(false);
    if (!error && data?.data) {
      setBeritaList(data.data);
    }
  };

  return (
    <div className="bg-white text-slate-800 font-sans">

      {/* 1. HERO SECTION - CLEAN, ELEGANT & SPACIOUS */}
      <section className="relative overflow-hidden bg-white pt-10 pb-16 lg:py-28 lg:min-h-[82vh] flex items-center border-b border-slate-100">
        {/* Background Image positioned at bottom with Low Opacity */}
        <div className="absolute bottom-0 inset-x-0 h-full z-0 opacity-10 pointer-events-none flex items-end">
          <img
            src={heroBg}
            alt="Hero Background Pattern"
            className="w-full h-auto max-h-full object-cover object-bottom"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-left" data-aos="fade-up">

              {/* Badge Tagline */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs sm:text-sm font-semibold">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Yayasan Dikdasmen PGRI Jawa Timur</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-snug sm:leading-tight whitespace-pre-line">
                {settings.hero_title}
              </h1>

              {/* Subheading text */}
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl">
                {settings.hero_subtitle}
              </p>

              {/* Features Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-slate-600 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Pengajuan Surat Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Data Sekolah Terpadu</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Informasi Resmi Yayasan</span>
                </div>
              </div>

            </div>

            {/* Right Hero Image Visual (No Border, No Shadow) */}
            <div className="lg:col-span-6" data-aos="fade-up" data-aos-delay="100">
              <div className="mx-auto max-w-lg bg-white border border-slate-50 rounded-xl overflow-hidden">
                <img
                  src={settings.hero_image ? getImageUrl(settings.hero_image) : heroImg}
                  alt="Yayasan Dikdasmen PGRI Jawa Timur"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SAMBUTAN KETUA YAYASAN PREVIEW */}
      <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 grid grid-cols-1 lg:grid-cols-12" data-aos="fade-up">

            {/* Profil Ketua Sidebar */}
            <div className="lg:col-span-4 bg-emerald-800 text-white p-8 sm:p-10 flex flex-col justify-between items-center text-center">
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl bg-white/10 p-1.5 border-2 border-yellow-400 flex items-center justify-center mb-4 overflow-hidden shadow-md">
                {settings.foto_ketua ? (
                  <img
                    src={getImageUrl(settings.foto_ketua)}
                    alt={settings.nama_ketua}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <GraduationCap className="w-14 h-14 text-yellow-300" />
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-white">{settings.nama_ketua}</h3>
                <p className="text-xs sm:text-sm text-yellow-300 font-medium">
                  {settings.jabatan_ketua}
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-emerald-700/80 w-full text-xs text-emerald-100">
                Pengurus Wilayah Jawa Timur
              </div>
            </div>

            {/* Kutipan Sambutan */}
            <div className="lg:col-span-8 p-6 sm:p-10 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
                  Kata Sambutan Ketua Yayasan
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {settings.title_sambutan_home}
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm lg:text-base leading-relaxed italic">
                  "{settings.quote_sambutan_home}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <span className="text-xs text-slate-500 font-medium">Assalamu'alaikum Warahmatullahi Wabarakatuh</span>
                <Link
                  to="/sambutan"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-900 transition-colors"
                >
                  <span>Baca Sambutan Selengkapnya</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. ARTI LAMBANG YAYASAN */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto space-y-2 mb-12" data-aos="fade-up">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Makna & Filosofi
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Arti Lambang Yayasan Dikdasmen PGRI Jatim
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Unsur-unsur utama lambang melambangkan pengabdian mulia dunia pendidikan yang berlandaskan Pancasila.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Unsur 1 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:bg-white hover:shadow-md transition-all space-y-3" data-aos="fade-up" data-aos-delay="100">
              <div className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-800 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Sayap Bulu (5 Helai)</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Masing-masing 5 helai di kiri & kanan berwarna kuning. Melambangkan cita-cita setinggi angkasa di bidang pendidikan berlandaskan Pancasila.
              </p>
            </div>

            {/* Unsur 2 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:bg-white hover:shadow-md transition-all space-y-3" data-aos="fade-up" data-aos-delay="150">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Suluh Tegak (4 Garis)</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Melambangkan fungsi guru pada empat tingkat pendidikan (PAUD/Pra-sekolah, Dasar, Menengah, dan Perguruan Tinggi).
              </p>
            </div>

            {/* Unsur 3 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:bg-white hover:shadow-md transition-all space-y-3" data-aos="fade-up" data-aos-delay="200">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Nyala Api (5 Sinar)</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Warna merah melambangkan semangat pengabdian serta pancaran nilai-nilai luhur Pancasila dalam mendidik bangsa.
              </p>
            </div>

            {/* Unsur 4 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:bg-white hover:shadow-md transition-all space-y-3" data-aos="fade-up" data-aos-delay="250">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Tali Hijau Melingkar</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Melambangkan persaudaraan dan pengabdian yang dilandasi kesucian, kemurnian, keberanian, serta kesetiaan kepada NKRI.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. LAYANAN DIKDASMEN SECTION */}
      <section className="py-14 sm:py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto space-y-2 mb-12" data-aos="fade-up">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100/70 px-3 py-1 rounded-full">
              Layanan Digital
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Layanan Utama Yayasan Dikdasmen
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Sistem persuratan online & direktori sekolah PGRI di Jawa Timur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

            {/* Service 1: Persuratan */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 hover:border-emerald-200 transition-all" data-aos="fade-up">
              <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Layanan Persuratan Online</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Pengajuan rekomendasi yayasan, pengantar mutasi, permohonan izin operasional, serta verifikasi dan pelacakan resi surat secara transparan.
              </p>
              <div className="pt-2">
                <Link
                  to="/layanan/persuratan"
                  className="inline-flex items-center gap-2 font-bold text-emerald-800 hover:text-emerald-900 text-sm"
                >
                  <span>Akses Form & Lacak Surat</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Service 2: SIL */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 hover:border-yellow-200 transition-all" data-aos="fade-up" data-aos-delay="100">
              <div className="w-12 h-12 rounded-2xl bg-yellow-600 text-white flex items-center justify-center">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Sistem Informasi Lembaga (SIL)</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Direktori data sekolah PGRI di Jawa Timur (NPSN, jumlah siswa & guru, akreditasi, serta kontak sekolah) dari jenjang PAUD, SD, SMP, SMA/SMK.
              </p>
              <div className="pt-2">
                <Link
                  to="/layanan/sistem-informasi"
                  className="inline-flex items-center gap-2 font-bold text-yellow-700 hover:text-yellow-800 text-xs sm:text-sm"
                >
                  <span>Cari & Lihat Data Lembaga</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. BERITA & KEGIATAN YAYASAN SECTION */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4" data-aos="fade-up">
            <div className="space-y-2">
              <span className="text-xs font-bold text-red-700 uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full border border-red-100">
                Informasi & Kegiatan
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Berita & Kegiatan Terbaru
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Kabar terbaru seputar program, agenda, serta kegiatan Dikdasmen PGRI Jawa Timur.
              </p>
            </div>
            <Link
              to="/berita"
              className="inline-flex items-center gap-2 font-bold text-red-700 hover:text-red-800 transition-colors text-sm shrink-0"
            >
              <span>Lihat Semua Berita</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingBerita ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-50 rounded-3xl h-72 animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : beritaList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {beritaList.map((item, index) => (
                <article
                  key={item.id}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {item.gambar && (
                      <div className="w-full h-48 bg-slate-100 overflow-hidden">
                        <img
                          src={getImageUrl(item.gambar)}
                          alt={item.judul}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                        <span className="px-3 py-1 bg-red-50 text-red-700 font-semibold rounded-full border border-red-100">
                          {item.kategori || 'Kegiatan'}
                        </span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.tanggal}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 hover:text-red-700 transition-colors">
                        {item.judul}
                      </h3>
                      <div
                        className="text-slate-600 text-xs line-clamp-3 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: item.konten }}
                      />
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
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
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-200/80 text-slate-500 text-sm">
              Belum ada berita atau kegiatan terbaru yang dipublikasikan.
            </div>
          )}

        </div>
      </section>

      {/* 5. STATISTIK RINGKAS */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">

            <div data-aos="zoom-in">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-yellow-400 mb-1">{settings.stat_kabupaten}</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Kabupaten / Kota se-Jatim</div>
            </div>

            <div data-aos="zoom-in" data-aos-delay="100">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-yellow-400 mb-1">{settings.stat_sekolah}</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Sekolah PGRI</div>
            </div>

            <div data-aos="zoom-in" data-aos-delay="200">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-yellow-400 mb-1">{settings.stat_guru}</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Guru & Pendidik</div>
            </div>

            <div data-aos="zoom-in" data-aos-delay="300">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-yellow-400 mb-1">{settings.stat_siswa}</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Siswa & Peserta Didik</div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
