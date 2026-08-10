import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Globe, Send, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import AOS from 'aos';

export default function KontakPage() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    telepon: '',
    subjek: '',
    pesan: ''
  });

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.pesan) {
      toast.error('Mohon lengkapi nama dan isi pesan Anda');
      return;
    }
    toast.success('Pesan Anda berhasil dikirimkan ke Sekretariat Yayasan Dikdasmen PGRI Jatim!');
    setFormData({ nama: '', email: '', telepon: '', subjek: '', pesan: '' });
  };

  return (
    <div className="bg-white py-12 lg:py-20 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3" data-aos="fade-up">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider border border-purple-100">
            <Phone className="w-4 h-4 text-purple-600" />
            Layanan Komunikasi
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Hubungi Pengurus Yayasan Dikdasmen PGRI Jatim
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Kami siap melayani konsultasi, informasi persuratan, dan koordinasi lembaga sekolah PGRI se-Jawa Timur.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10" data-aos="fade-up">
          
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-8 space-y-8 flex flex-col justify-between shadow-xl">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Sekretariat Yayasan</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Kantor Yayasan Pembina Lembaga Pendidikan Dasar dan Menengah PGRI Provinsi Jawa Timur.
              </p>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                  <div>
                    <span className="font-bold text-white block">Alamat Kantor:</span>
                    <span>Jl. Wonorejo Timur Blok A Nomor 43 – Rungkut – Surabaya, Kode Pos 60296</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Telepon:</span>
                    <span>(031) 828-4455 / 828-4456</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-blue-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Email Resmi:</span>
                    <span>yplpdmpgrijatim@gmail.com</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Globe className="w-5 h-5 text-yellow-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Website Domain:</span>
                    <span>www.yplpdm_pgrijatim.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 text-xs text-yellow-300 font-semibold">
              Jam Kerja Sekretariat: Senin - Jumat (08.00 - 16.00 WIB)
            </div>
          </div>

          {/* Form Kirim Pesan */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-red-700" />
              <span>Kirim Pesan / Pertanyaan</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nama Lengkap *</label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    required
                    placeholder="Nama Anda..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="email@sekolah.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">No. Telepon / WhatsApp</label>
                  <input
                    type="text"
                    name="telepon"
                    value={formData.telepon}
                    onChange={handleChange}
                    placeholder="081234567890"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Subjek Pesan</label>
                  <input
                    type="text"
                    name="subjek"
                    value={formData.subjek}
                    onChange={handleChange}
                    placeholder="Informasi Layanan / Kerjasama"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Isi Pesan *</label>
                <textarea
                  name="pesan"
                  rows={4}
                  value={formData.pesan}
                  onChange={handleChange}
                  required
                  placeholder="Tuliskan pertanyaan atau pesan Anda..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white text-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-700 hover:bg-red-800 text-white font-bold text-sm rounded-xl shadow-md transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Pesan</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
