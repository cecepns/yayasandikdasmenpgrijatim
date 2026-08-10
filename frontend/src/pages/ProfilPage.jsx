import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Shield, Sparkles, CheckCircle2, Target, Eye, Users, History, GraduationCap, Building2 } from 'lucide-react';
import AOS from 'aos';
import { api } from '../utils/api';
import { API_ENDPOINTS } from '../utils/endpoints';
import { requestHandler } from '../utils/request';

export default function ProfilPage() {
  const [profileData, setProfileData] = useState({
    visi: 'Menjadi lembaga pembina pendidikan yang unggul, profesional, berkarakter Pancasila, dan terdepan dalam mewujudkan pendidikan bermutu di Jawa Timur.',
    misi: [
      'Meningkatkan mutu tata kelola lembaga pendidikan PGRI di seluruh kabupaten/kota se-Jawa Timur.',
      'Mendorong profesionalisme, kesejahteraan, dan kompetensi tenaga pendidik dan kependidikan.',
      'Mengembangkan digitalisasi layanan persuratan dan sistem informasi manajemen sekolah.',
      'Membangun karakter generasi muda yang cerdas, berakhlak mulia, dan berdaya saing global.'
    ],
    sejarah: `Yayasan Pembina Lembaga Pendidikan (YPLP) PGRI didirikan sebagai badan khusus Persatuan Guru Republik Indonesia yang bertugas membina, mengelola, dan mengikhtiarkan perkembangan lembaga pendidikan persekolahan PGRI di seluruh jenjang pendidikan dasar dan menengah.

Di Jawa Timur, YPLP Dikdasmen PGRI tumbuh dan berkembang pesat seiring tingginya kebutuhan masyarakat akan pendidikan berkualitas, berkarakter nasionalis, dan terjangkau. Berawal dari inisiatif para tokoh pendidik PGRI Jawa Timur untuk memberikan wadah formal bagi sekolah-sekolah swasta PGRI agar memiliki standar kurikulum, tata kelola, serta sarana prasarana yang tangguh.

Hingga saat ini, YPLP Dikdasmen PGRI Jawa Timur terus bertransformasi menjadi pusat pengayoman modern yang memadukan semangat historis pengabdian guru dengan modernisasi digitalisasi layanan pendidikan.`
  });

  const [pengurusList, setPengurusList] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }

    loadProfileAndPengurus();
  }, []);

  const loadProfileAndPengurus = async () => {
    // Load Settings
    const { data: settingsRes } = await requestHandler(() => api.get(API_ENDPOINTS.SETTINGS.GET));
    if (settingsRes?.data) {
      const s = settingsRes.data;
      setProfileData(prev => ({
        ...prev,
        visi: s.visi_yayasan || prev.visi,
        misi: s.misi_yayasan ? s.misi_yayasan.split('\n').filter(Boolean) : prev.misi,
        sejarah: s.sejarah_yayasan || prev.sejarah
      }));
    }

    // Load Pengurus
    const { data: pengurusRes } = await requestHandler(() => api.get(API_ENDPOINTS.PENGURUS.LIST));
    if (pengurusRes?.data) {
      setPengurusList(pengurusRes.data);
    }
  };

  return (
    <div className="bg-white py-12 lg:py-20 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4" data-aos="fade-up">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider border border-red-100">
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
        <section id="visi-misi" className="scroll-mt-28 space-y-8" data-aos="fade-up">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Visi & Misi Yayasan</h2>
            <p className="text-slate-600 text-sm mt-2">Landasan filosofis dan arah pandang penyelenggaraan pendidikan PGRI Jawa Timur.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Visi */}
            <div className="bg-gradient-to-br from-red-700 to-red-900 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-yellow-300" />
                </div>
                <h3 className="text-2xl font-bold">Visi Yayasan</h3>
                <p className="text-red-100 text-base leading-relaxed italic">
                  “{profileData.visi}”
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
              <h3 className="text-2xl font-bold">Misi Yayasan</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                {profileData.misi.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 2. KEPENGURUSAN */}
        <section id="kepengurusan" className="scroll-mt-28 space-y-8" data-aos="fade-up">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">
              <Users className="w-3.5 h-3.5" /> Structure & Executive Board
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Kepengurusan Yayasan</h2>
            <p className="text-slate-600 text-sm">Susunan jajaran Pembina, Pengawas, dan Pengurus YPLP Dikdasmen PGRI Jawa Timur.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pengurusList.length > 0 ? (
              pengurusList.map((p) => {
                const initials = p.nama ? p.nama.split(' ').map(n => n[0]).slice(0, 2).join('') : 'P';
                return (
                  <div key={p.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-3 hover:shadow-md transition-shadow">
                    {p.foto ? (
                      <img
                        src={p.foto.startsWith('http') || p.foto.startsWith('/') ? p.foto : `https://api.kingcreativestudio.my.id/yayasan-pgri-jatim${p.foto}`}
                        alt={p.nama}
                        className="w-20 h-20 rounded-full object-cover mx-auto shadow-md border-2 border-red-700"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 font-bold text-xl flex items-center justify-center mx-auto shadow-inner">
                        {initials}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{p.nama}</h3>
                      <p className="text-xs font-bold text-red-700 uppercase tracking-wider">{p.jabatan}</p>
                    </div>
                    <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                      {p.kategori}
                    </span>
                    {p.deskripsi && (
                      <p className="text-xs text-slate-600 leading-relaxed pt-1">{p.deskripsi}</p>
                    )}
                  </div>
                );
              })
            ) : (
              <>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 font-bold text-xl flex items-center justify-center mx-auto shadow-inner">
                    KW
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Drs. H. Winadi, M.Pd</h3>
                  <p className="text-xs font-semibold text-red-700 uppercase tracking-wider">Ketua Yayasan</p>
                  <p className="text-sm text-slate-600">Memimpin penyelenggaraan dan perumusan kebijakan pengayoman sekolah-sekolah PGRI di Jawa Timur.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 font-bold text-xl flex items-center justify-center mx-auto shadow-inner">
                    DS
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Drs. Supriyanto, M.Pd</h3>
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Sekretaris Yayasan</p>
                  <p className="text-sm text-slate-600">Mengelola tata kelola persuratan, tata usaha, serta hubungan antar lembaga perwakilan kabupaten/kota.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xl flex items-center justify-center mx-auto shadow-inner">
                    BS
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">H. Budi Santoso, SE, M.M</h3>
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Bendahara Yayasan</p>
                  <p className="text-sm text-slate-600">Bertanggung jawab atas pengelolaan dana, akuntabilitas keuangan, dan pengembangan sarana prasarana sekolah.</p>
                </div>
              </>
            )}
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h4 className="font-bold text-lg text-yellow-400">Pengurus YPLP PGRI Kabupaten / Kota se-Jawa Timur</h4>
              <p className="text-xs text-slate-300">Didukung oleh perwakilan YPLP PGRI di 38 Kabupaten/Kota yang mengkoordinasikan ribuan jenjang TK, SD, SMP, SMA, dan SMK PGRI.</p>
            </div>
            <span className="shrink-0 bg-yellow-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl">
              38 Perwakilan Kab/Kota
            </span>
          </div>
        </section>

        {/* 3. SEJARAH YAYASAN */}
        <section id="sejarah" className="scroll-mt-28 space-y-8" data-aos="fade-up">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider border border-purple-100">
              <History className="w-3.5 h-3.5" /> Rejak Perjalanan
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Sejarah Yayasan</h2>
            <p className="text-slate-600 text-sm">Jejak dedikasi pembinaan pendidikan dasar dan menengah oleh PGRI Jawa Timur.</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 lg:p-10 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-700 text-white flex items-center justify-center shrink-0 shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                {profileData.sejarah.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. LAMBANG YAYASAN */}
        <section id="lambang" className="scroll-mt-28 space-y-8" data-aos="fade-up">
          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 lg:p-12 space-y-10">
            <div className="max-w-3xl space-y-2">
              <span className="text-xs font-bold text-red-700 uppercase tracking-wider bg-red-100/70 px-3 py-1 rounded-full">
                Identitas Kebangsaan
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Lambang Yayasan & Makna Filosofis
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Lambang Yayasan Pembina Lembaga Pendidikan Dasar dan Menengah PGRI Jawa Timur memiliki unsur utama berupa sayap bulu, suluh obor, serta warna dasar yang melambangkan pengabdian mulia dunia pendidikan.
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
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
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
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
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
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
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
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Tali hijau melingkar: Melambangkan persaudaraan dan pengabdian yang dilandasi kesucian, cinta kasih, kemurnian, keberanian, serta kesetiaan kepada negara dan bangsa Indonesia.
                </p>
              </div>

            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
