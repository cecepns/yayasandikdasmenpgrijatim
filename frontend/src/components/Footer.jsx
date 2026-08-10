import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Globe, ArrowUpRight } from 'lucide-react';
import { api } from '../utils/api';
import { API_ENDPOINTS } from '../utils/endpoints';
import { requestHandler } from '../utils/request';

export default function Footer() {
  const [contactInfo, setContactInfo] = useState({
    alamat_yayasan: 'Jl. Wonorejo Timur Blok A Nomor 43 – Rungkut – Surabaya, Kode Pos 60296',
    telepon_yayasan: '(031) 870-1234 / 870-1235',
    email_yayasan: 'yplpdmpgrijatim@gmail.com',
    website_yayasan: 'www.yplpdm_pgrijatim.com'
  });

  useEffect(() => {
    const fetchContactSettings = async () => {
      const { data, error } = await requestHandler(() => api.get(API_ENDPOINTS.SETTINGS.GET));
      if (!error && data?.data) {
        setContactInfo({
          alamat_yayasan: data.data.alamat_yayasan || 'Jl. Wonorejo Timur Blok A Nomor 43 – Rungkut – Surabaya, Kode Pos 60296',
          telepon_yayasan: data.data.telepon_yayasan || '(031) 870-1234 / 870-1235',
          email_yayasan: data.data.email_yayasan || 'yplpdmpgrijatim@gmail.com',
          website_yayasan: data.data.website_yayasan || 'www.yplpdm_pgrijatim.com'
        });
      }
    };
    fetchContactSettings();
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-12 border-t-4 border-red-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img src="/logo.png" alt="Logo Yayasan PGRI Jatim" className="h-16 w-auto bg-white p-2 rounded-xl object-contain shadow-sm" />
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Yayasan Pembina Lembaga Pendidikan Dasar dan Menengah Persatuan Guru Republik Indonesia Jawa Timur.
            </p>
            <div className="inline-block bg-red-950/80 border border-red-700/50 rounded-lg px-3 py-1.5 text-xs text-red-200">
              Slogan: <span className="font-semibold text-yellow-300">“Pendidikan Bermutu, Generasi Berkarakter”</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Navigasi Utama
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Beranda</span>
                </Link>
              </li>
              <li>
                <Link to="/sambutan" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Sambutan Ketua Yayasan</span>
                </Link>
              </li>
              <li>
                <Link to="/profil" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Profil & Arti Lambang</span>
                </Link>
              </li>
              <li>
                <Link to="/berita" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Berita & Informasi Terbaru</span>
                </Link>
              </li>
              <li>
                <Link to="/kontak" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Hubungi Kami</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Layanan Yayasan */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              Layanan Digital Yayasan
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/layanan/persuratan" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-4 h-4 text-red-400" />
                  <span>Layanan Persuratan Online</span>
                </Link>
              </li>
              <li>
                <Link to="/layanan/persuratan" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-4 h-4 text-red-400" />
                  <span>Cek / Lacak Resi Surat Resmi</span>
                </Link>
              </li>
              <li>
                <Link to="/layanan/sistem-informasi" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-4 h-4 text-yellow-400" />
                  <span>Sistem Informasi Lembaga (SIL)</span>
                </Link>
              </li>
              <li>
                <Link to="/layanan/sistem-informasi" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-4 h-4 text-yellow-400" />
                  <span>Direktori Sekolah PGRI Jatim</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Dynamic Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Kontak Yayasan
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span>{contactInfo.alamat_yayasan}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>{contactInfo.telepon_yayasan}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                <span>{contactInfo.email_yayasan}</span>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-yellow-500 shrink-0" />
                <span>{contactInfo.website_yayasan}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} Yayasan Pembina Lembaga Dikdasmen PGRI Jawa Timur. Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-6">
            <span className="hover:text-gray-400 cursor-pointer">Kebijakan Privasi</span>
            <span className="hover:text-gray-400 cursor-pointer">Syarat & Ketentuan</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
