import React, { useState, useEffect } from 'react';
import { Award, Quote, CheckCircle2, ArrowRight, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import { api } from '../utils/api';
import { API_ENDPOINTS } from '../utils/endpoints';
import { requestHandler } from '../utils/request';

export default function SambutanPage() {
  const [settings, setSettings] = useState({
    nama_ketua: 'Drs. H. Winadi, M.Pd',
    jabatan_ketua: 'Ketua Yayasan Dikdasmen PGRI Jawa Timur',
    foto_ketua: null,
    sambutan_ketua: ''
  });

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await requestHandler(() => api.get(API_ENDPOINTS.SETTINGS.GET));
    if (!error && data?.data) {
      setSettings(prev => ({
        ...prev,
        nama_ketua: data.data.nama_ketua || prev.nama_ketua,
        jabatan_ketua: data.data.jabatan_ketua || prev.jabatan_ketua,
        foto_ketua: data.data.foto_ketua || null,
        sambutan_ketua: data.data.sambutan_ketua || prev.sambutan_ketua
      }));
    }
  };

  return (
    <div className="bg-white py-12 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Header Title */}
        <div className="text-center space-y-4" data-aos="fade-up">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider border border-red-100">
            <Award className="w-4 h-4 text-yellow-600" />
            Pengurus Wilayah Yayasan Dikdasmen PGRI Jatim
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Kata Sambutan Ketua Yayasan Dikdasmen PGRI Jawa Timur
          </h1>
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="w-14 h-14 rounded-full bg-red-700 text-white flex items-center justify-center font-bold text-lg overflow-hidden border-2 border-yellow-400">
              {settings.foto_ketua ? (
                <img
                  src={settings.foto_ketua.startsWith('http') || settings.foto_ketua.startsWith('/') ? settings.foto_ketua : `https://api.kingcreativestudio.my.id/yayasan-pgri-jatim${settings.foto_ketua}`}
                  alt={settings.nama_ketua}
                  className="w-full h-full object-cover"
                />
              ) : (
                <GraduationCap className="w-8 h-8 text-yellow-300" />
              )}
            </div>
            <div className="text-left">
              <div className="font-bold text-slate-900 text-base">{settings.nama_ketua}</div>
              <div className="text-xs text-red-700 font-semibold">{settings.jabatan_ketua}</div>
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base font-normal whitespace-pre-line" data-aos="fade-up" data-aos-delay="100">

          {settings.sambutan_ketua ? (
            <div>{settings.sambutan_ketua}</div>
          ) : (
            <>
              <div className="p-4 bg-white rounded-2xl border-l-4 border-red-700 shadow-xs font-semibold text-slate-900 italic">
                "Assalamu'alaikum Warahmatullahi Wabarakatuh.<br />Salam sejahtera untuk kita semua."
              </div>

              <p>
                Puji syukur ke hadirat Allah SWT atas segala rahmat dan karunia-Nya, sehingga Website Yayasan Pembina Lembaga Pendidikan Dasar dan Menengah (Dikdasmen) PGRI Jawa Timur dapat hadir sebagai media informasi, komunikasi, dan kolaborasi bagi seluruh keluarga besar PGRI serta masyarakat luas.
              </p>

              <p className="font-semibold text-slate-900">
                Selamat datang di website resmi Yayasan Pembina Lembaga Dikdasmen PGRI Jawa Timur.
              </p>

              <p>
                Kami meyakini bahwa pendidikan merupakan fondasi utama dalam membangun sumber daya manusia yang unggul, berkarakter, berintegritas, serta mampu menjawab tantangan zaman. Oleh karena itu, Yayasan Pembina Lembaga Dikdasmen PGRI Jawa Timur berkomitmen untuk terus meningkatkan mutu tata kelola yayasan, memperkuat kualitas layanan pendidikan, mendukung profesionalisme tenaga pendidik dan kependidikan, serta mendorong lahirnya generasi yang cerdas, berakhlak mulia, kreatif, dan berdaya saing.
              </p>
            </>
          )}

          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-semibold text-slate-500">
            <span className="italic text-slate-900 font-bold">Wassalamu'alaikum Warahmatullahi Wabarakatuh.</span>
            <div className="bg-red-50 text-red-800 px-3 py-1.5 rounded-lg border border-red-100">
              Slogan: “Pendidikan Bermutu, Generasi Berkarakter”
            </div>
          </div>

        </div>

        {/* Bottom Callouts */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100">
          <Link
            to="/profil"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-colors"
          >
            <span>Lihat Profil & Arti Lambang Yayasan</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/layanan/persuratan"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-700 text-white font-medium text-sm hover:bg-red-800 transition-colors"
          >
            <span>Akses Layanan Persuratan Online</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
