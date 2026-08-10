import React, { useEffect } from 'react';
import { Award, BookOpen, Shield, Sparkles, CheckCircle2, Target, Eye, Flag } from 'lucide-react';
import AOS from 'aos';

export default function ProfilPage() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="bg-white py-12 lg:py-20 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4" data-aos="fade-up">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider border border-red-100">
            Profil Resmi
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Yayasan Pembina Lembaga Pendidikan Dasar & Menengah PGRI Jawa Timur
          </h1>
          <p className="text-slate-600 text-base">
            Mewujudkan lembaga pendidikan yang berintegritas, berdaya saing, dan berlandaskan semangat pengabdian Pancasila.
          </p>
        </div>

        {/* 1. VISI & MISI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-aos="fade-up">
          {/* Visi */}
          <div className="bg-gradient-to-br from-red-700 to-red-900 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <Eye className="w-6 h-6 text-yellow-300" />
              </div>
              <h2 className="text-2xl font-bold">Visi Yayasan</h2>
              <p className="text-red-100 text-base leading-relaxed italic">
                “Menjadi lembaga pembina pendidikan yang unggul, profesional, berkarakter Pancasila, dan terdepan dalam mewujudkan pendidikan bermutu di Jawa Timur.”
              </p>
            </div>
            <div className="pt-4 border-t border-red-600/60 text-xs text-yellow-300 font-semibold">
              Slogan: Pendidikan Bermutu, Generasi Berkarakter
            </div>
          </div>

          {/* Misi */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold">Misi Yayasan</h2>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Meningkatkan mutu tata kelola lembaga pendidikan PGRI di seluruh kabupaten/kota se-Jawa Timur.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Mendorong profesionalisme, kesejahteraan, dan kompetensi tenaga pendidik dan kependidikan.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Mengembangkan digitalisasi layanan persuratan dan sistem informasi manajemen sekolah.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Membangun karakter generasi muda yang cerdas, berakhlak mulia, dan berdaya saing global.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 2. ARTI LAMBANG YAYASAN (DETAIL CLIENT CHAT) */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 lg:p-12 space-y-10" data-aos="fade-up">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold text-red-700 uppercase tracking-wider bg-red-100/70 px-3 py-1 rounded-full">
              Identitas Kebangsaan
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Arti Lambang Yayasan Dikdasmen PGRI Jawa Timur
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Lambang Yayasan Pembina Lembaga Pendidikan Dasar dan Menengah Persatuan Guru Republik Indonesia Jawa Timur memiliki unsur utama berupa sayap bulu, suluh atau obor, serta warna dasar merah-putih yang melambangkan pengabdian mulia dunia pendidikan.
            </p>
          </div>

          {/* Grid Unsur */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Sayap Bulu */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-yellow-50 text-yellow-800 text-xs font-bold border border-yellow-200">
                <Award className="w-4 h-4 text-yellow-600" />
                Sayap Bulu (5 Helai)
              </div>
              <h3 className="font-bold text-slate-900 text-base">Makna Sayap Bulu (Kuning)</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Masing-masing 5 helai di kiri dan kanan berwarna kuning: Melambangkan cita-cita setinggi angkasa di bidang pendidikan yang berlandaskan Pancasila untuk mengantar generasi muda ke masa depan yang cerah.
              </p>
            </div>

            {/* Suluh Berdiri Tegak */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                <BookOpen className="w-4 h-4 text-amber-600" />
                Suluh Tegak (4 Garis)
              </div>
              <h3 className="font-bold text-slate-900 text-base">Makna Suluh Berdiri Tegak (Kuning)</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Suluh berdiri tegak dengan 4 garis berwarna kuning: Melambangkan fungsi guru pada empat tingkat pendidikan (pra-sekolah/pendidikan anak usia dini, tingkat dasar, tingkat menengah, dan perguruan tinggi) serta luhurnya tugas pengabdian pendidik.
              </p>
            </div>

            {/* Nyala Api */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-50 text-red-800 text-xs font-bold border border-red-200">
                <Sparkles className="w-4 h-4 text-red-600" />
                Nyala Api (5 Sinar)
              </div>
              <h3 className="font-bold text-slate-900 text-base">Makna Nyala Api (Merah)</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Nyala api dengan 5 sinar berwarna merah: Melambangkan semangat pengabdian serta pancaran nilai-nilai luhur Pancasila dalam mendidik bangsa.
              </p>
            </div>

            {/* Tali Hijau */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <Shield className="w-4 h-4 text-emerald-600" />
                Tali Hijau Melingkar
              </div>
              <h3 className="font-bold text-slate-900 text-base">Makna Tali Hijau Melingkar</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tali hijau melingkar: Melambangkan persaudaraan dan pengabdian yang dilandasi kesucian, cinta kasih, kemurnian, keberanian, serta kesetiaan kepada negara dan bangsa Indonesia.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
