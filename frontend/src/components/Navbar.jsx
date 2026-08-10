import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, FileText, Database, Phone, Home, Info, BookOpen, Award, Users, History, Target, Shield, Plus, Minus } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tentangKamiDropdownOpen, setTentangKamiDropdownOpen] = useState(false);
  const [layananDropdownOpen, setLayananDropdownOpen] = useState(false);

  // Mobile collapse states (default collapsed)
  const [mobileTentangKamiOpen, setMobileTentangKamiOpen] = useState(false);
  const [mobileLayananOpen, setMobileLayananOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleSubmenuClick = (hash) => {
    setTentangKamiDropdownOpen(false);
    setMobileMenuOpen(false);
    if (location.pathname === '/profil') {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/profil#${hash}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-emerald-800 text-white backdrop-blur-md border-b border-emerald-900 shadow-md">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo Brand */}
          <Link to="/" className="flex items-center group">
            <div className="bg-white p-1.5 rounded-xl shadow-xs flex items-center justify-center transition-transform group-hover:scale-105">
              <img
                src="/logo.png"
                alt="Logo PGRI Dikdasmen Jatim"
                className="h-11 sm:h-12 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 font-medium text-emerald-100 text-sm">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg transition-colors ${isActive('/') ? 'text-white font-semibold bg-emerald-900/80 border border-emerald-600/50 shadow-inner' : 'hover:text-white hover:bg-emerald-700/60'}`}
            >
              Beranda
            </Link>

            <Link
              to="/sambutan"
              className={`px-3 py-2 rounded-lg transition-colors ${isActive('/sambutan') ? 'text-white font-semibold bg-emerald-900/80 border border-emerald-600/50 shadow-inner' : 'hover:text-white hover:bg-emerald-700/60'}`}
            >
              Sambutan Ketua
            </Link>

            {/* Dropdown Menu Tentang Kami */}
            <div
              className="relative"
              onMouseEnter={() => setTentangKamiDropdownOpen(true)}
              onMouseLeave={() => setTentangKamiDropdownOpen(false)}
            >
              <button
                onClick={() => setTentangKamiDropdownOpen(!tentangKamiDropdownOpen)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${location.pathname === '/profil' ? 'text-white font-semibold bg-emerald-900/80 border border-emerald-600/50 shadow-inner' : 'hover:text-white hover:bg-emerald-700/60'}`}
              >
                <span>Tentang Kami</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${tentangKamiDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Submenu Dropdown Tentang Kami */}
              {tentangKamiDropdownOpen && (
                <div className="absolute top-full left-0 w-60 bg-white text-slate-800 rounded-xl shadow-2xl border border-emerald-100 py-2 mt-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => handleSubmenuClick('visi-misi')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 transition-colors text-left text-slate-700 hover:text-emerald-800"
                  >
                    <Target className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-sm">Visi & Misi</div>
                      <div className="text-xs text-slate-500">Cita-cita & Arah Pengabdian</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSubmenuClick('sejarah')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 transition-colors text-left text-slate-700 hover:text-emerald-800"
                  >
                    <History className="w-4 h-4 text-purple-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-sm">Sejarah Yayasan</div>
                      <div className="text-xs text-slate-500">Jejak Langkah Dikdasmen</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSubmenuClick('lambang')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 transition-colors text-left text-slate-700 hover:text-emerald-800"
                  >
                    <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-sm">Lambang Yayasan</div>
                      <div className="text-xs text-slate-500">Arti & Makna Simbolik</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSubmenuClick('kepengurusan')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 transition-colors text-left text-slate-700 hover:text-emerald-800"
                  >
                    <Users className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-sm">Kepengurusan</div>
                      <div className="text-xs text-slate-500">Struktur & Jajaran Pengurus</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Dropdown Menu Layanan */}
            <div
              className="relative"
              onMouseEnter={() => setLayananDropdownOpen(true)}
              onMouseLeave={() => setLayananDropdownOpen(false)}
            >
              <button
                onClick={() => setLayananDropdownOpen(!layananDropdownOpen)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${location.pathname.startsWith('/layanan') ? 'text-white font-semibold bg-emerald-900/80 border border-emerald-600/50 shadow-inner' : 'hover:text-white hover:bg-emerald-700/60'}`}
              >
                <span>Layanan</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${layananDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Submenu Dropdown */}
              {layananDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white text-slate-800 rounded-xl shadow-2xl border border-emerald-100 py-2 mt-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    to="/layanan/persuratan"
                    onClick={() => setLayananDropdownOpen(false)}
                    className="flex items-start gap-3 px-4 py-2.5 hover:bg-emerald-50 transition-colors text-slate-700 hover:text-emerald-800"
                  >
                    <FileText className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-sm">Persuratan</div>
                      <div className="text-xs text-slate-500">Layanan & Verifikasi E-Surat Resmi</div>
                    </div>
                  </Link>
                  <Link
                    to="/layanan/sistem-informasi"
                    onClick={() => setLayananDropdownOpen(false)}
                    className="flex items-start gap-3 px-4 py-2.5 hover:bg-emerald-50 transition-colors text-slate-700 hover:text-emerald-800"
                  >
                    <Database className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-sm">Sistem Informasi Lembaga</div>
                      <div className="text-xs text-slate-500">Direktori Sekolah & Lembaga PGRI</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/berita"
              className={`px-3 py-2 rounded-lg transition-colors ${isActive('/berita') ? 'text-white font-semibold bg-emerald-900/80 border border-emerald-600/50 shadow-inner' : 'hover:text-white hover:bg-emerald-700/60'}`}
            >
              Berita
            </Link>

            <Link
              to="/kontak"
              className={`px-3 py-2 rounded-lg transition-colors ${isActive('/kontak') ? 'text-white font-semibold bg-emerald-900/80 border border-emerald-600/50 shadow-inner' : 'hover:text-white hover:bg-emerald-700/60'}`}
            >
              Kontak
            </Link>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-white hover:bg-emerald-700/70 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-700 bg-emerald-800 px-4 pt-2 pb-6 space-y-2 shadow-xl">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${isActive('/') ? 'bg-emerald-900/90 text-white font-semibold border border-emerald-600' : 'text-emerald-100 hover:bg-emerald-700'}`}
          >
            <Home className="w-5 h-5 text-yellow-300" />
            Beranda
          </Link>

          <Link
            to="/sambutan"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${isActive('/sambutan') ? 'bg-emerald-900/90 text-white font-semibold border border-emerald-600' : 'text-emerald-100 hover:bg-emerald-700'}`}
          >
            <Award className="w-5 h-5 text-yellow-300" />
            Sambutan Ketua
          </Link>

          {/* Mobile Collapsible Accordion: Tentang Kami */}
          <div className="border border-emerald-700/80 rounded-xl overflow-hidden bg-emerald-900/40">
            <button
              onClick={() => setMobileTentangKamiOpen(!mobileTentangKamiOpen)}
              className="w-full flex items-center justify-between px-3.5 py-3 text-base font-medium text-emerald-100 hover:bg-emerald-700/60 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <Info className="w-5 h-5 text-yellow-300" />
                Tentang Kami
              </span>
              <span className="p-1 rounded bg-emerald-800/80 text-yellow-300">
                {mobileTentangKamiOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </span>
            </button>

            {mobileTentangKamiOpen && (
              <div className="px-3 pb-3 pt-1 space-y-1 bg-emerald-950/40 border-t border-emerald-700/50">
                <button
                  onClick={() => handleSubmenuClick('visi-misi')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-emerald-100 hover:bg-emerald-700 text-left"
                >
                  <Target className="w-4 h-4 text-emerald-300" />
                  VISI MISI
                </button>

                <button
                  onClick={() => handleSubmenuClick('sejarah')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-emerald-100 hover:bg-emerald-700 text-left"
                >
                  <History className="w-4 h-4 text-purple-300" />
                  Sejarah Singkat
                </button>

                <button
                  onClick={() => handleSubmenuClick('lambang')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-emerald-100 hover:bg-emerald-700 text-left"
                >
                  <Shield className="w-4 h-4 text-amber-300" />
                  Lambang Yayasan
                </button>

                <button
                  onClick={() => handleSubmenuClick('kepengurusan')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-emerald-100 hover:bg-emerald-700 text-left"
                >
                  <Users className="w-4 h-4 text-blue-300" />
                  Kepengurusan
                </button>
              </div>
            )}
          </div>

          {/* Mobile Collapsible Accordion: Menu Layanan */}
          <div className="border border-emerald-700/80 rounded-xl overflow-hidden bg-emerald-900/40">
            <button
              onClick={() => setMobileLayananOpen(!mobileLayananOpen)}
              className="w-full flex items-center justify-between px-3.5 py-3 text-base font-medium text-emerald-100 hover:bg-emerald-700/60 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-yellow-300" />
                Menu Layanan
              </span>
              <span className="p-1 rounded bg-emerald-800/80 text-yellow-300">
                {mobileLayananOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </span>
            </button>

            {mobileLayananOpen && (
              <div className="px-3 pb-3 pt-1 space-y-1 bg-emerald-950/40 border-t border-emerald-700/50">
                <Link
                  to="/layanan/persuratan"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${isActive('/layanan/persuratan') ? 'bg-emerald-900/90 text-white font-semibold' : 'text-emerald-100 hover:bg-emerald-700'}`}
                >
                  <FileText className="w-4 h-4 text-red-300" />
                  Persuratan Online
                </Link>
                <Link
                  to="/layanan/sistem-informasi"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${isActive('/layanan/sistem-informasi') ? 'bg-emerald-900/90 text-white font-semibold' : 'text-emerald-100 hover:bg-emerald-700'}`}
                >
                  <Database className="w-4 h-4 text-amber-300" />
                  Sistem Informasi Lembaga
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/berita"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${isActive('/berita') ? 'bg-emerald-900/90 text-white font-semibold border border-emerald-600' : 'text-emerald-100 hover:bg-emerald-700'}`}
          >
            <BookOpen className="w-5 h-5 text-blue-300" />
            Berita & Pengumuman
          </Link>

          <Link
            to="/kontak"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${isActive('/kontak') ? 'bg-emerald-900/90 text-white font-semibold border border-emerald-600' : 'text-emerald-100 hover:bg-emerald-700'}`}
          >
            <Phone className="w-5 h-5 text-purple-300" />
            Kontak
          </Link>
        </div>
      )}
    </header>
  );
}
