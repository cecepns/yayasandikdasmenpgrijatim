import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, FileText, Database, ShieldCheck, Phone, Home, Info, BookOpen, Award } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [layananDropdownOpen, setLayananDropdownOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo Brand Only */}
          <Link to="/" className="flex items-center group">
            <img
              src="/logo.png"
              alt="Logo PGRI Dikdasmen Jatim"
              className="h-12 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 font-medium text-gray-700 text-sm">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg transition-colors ${isActive('/') ? 'text-red-700 font-semibold bg-red-50' : 'hover:text-red-700 hover:bg-gray-50'}`}
            >
              Beranda
            </Link>

            <Link
              to="/sambutan"
              className={`px-3 py-2 rounded-lg transition-colors ${isActive('/sambutan') ? 'text-red-700 font-semibold bg-red-50' : 'hover:text-red-700 hover:bg-gray-50'}`}
            >
              Sambutan Ketua
            </Link>

            <Link
              to="/profil"
              className={`px-3 py-2 rounded-lg transition-colors ${isActive('/profil') ? 'text-red-700 font-semibold bg-red-50' : 'hover:text-red-700 hover:bg-gray-50'}`}
            >
              Profil Yayasan
            </Link>

            {/* Dropdown Menu Layanan */}
            <div
              className="relative"
              onMouseEnter={() => setLayananDropdownOpen(true)}
              onMouseLeave={() => setLayananDropdownOpen(false)}
            >
              <button
                onClick={() => setLayananDropdownOpen(!layananDropdownOpen)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${location.pathname.startsWith('/layanan') ? 'text-red-700 font-semibold bg-red-50' : 'hover:text-red-700 hover:bg-gray-50'}`}
              >
                <span>Layanan</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${layananDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Submenu Dropdown */}
              {layananDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 mt-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    to="/layanan/persuratan"
                    className="flex items-start gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-gray-700 hover:text-red-700"
                  >
                    <FileText className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-sm">Persuratan</div>
                      <div className="text-xs text-gray-500">Layanan & Verifikasi E-Surat Resmi</div>
                    </div>
                  </Link>
                  <Link
                    to="/layanan/sistem-informasi"
                    className="flex items-start gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-gray-700 hover:text-red-700"
                  >
                    <Database className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-sm">Sistem Informasi Lembaga</div>
                      <div className="text-xs text-gray-500">Direktori Sekolah & Lembaga PGRI</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/berita"
              className={`px-3 py-2 rounded-lg transition-colors ${isActive('/berita') ? 'text-red-700 font-semibold bg-red-50' : 'hover:text-red-700 hover:bg-gray-50'}`}
            >
              Berita
            </Link>

            <Link
              to="/kontak"
              className={`px-3 py-2 rounded-lg transition-colors ${isActive('/kontak') ? 'text-red-700 font-semibold bg-red-50' : 'hover:text-red-700 hover:bg-gray-50'}`}
            >
              Kontak
            </Link>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-red-700 hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-6 space-y-2 shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${isActive('/') ? 'bg-red-50 text-red-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            <Home className="w-5 h-5 text-red-600" />
            Beranda
          </Link>

          <Link
            to="/sambutan"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${isActive('/sambutan') ? 'bg-red-50 text-red-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            <Award className="w-5 h-5 text-yellow-600" />
            Sambutan Ketua
          </Link>

          <Link
            to="/profil"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${isActive('/profil') ? 'bg-red-50 text-red-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            <Info className="w-5 h-5 text-emerald-600" />
            Profil Yayasan
          </Link>

          <div className="space-y-1 pl-3 border-l-2 border-red-200 my-1">
            <div className="px-3 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Menu Layanan
            </div>
            <Link
              to="/layanan/persuratan"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${isActive('/layanan/persuratan') ? 'bg-red-50 text-red-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <FileText className="w-4 h-4 text-red-600" />
              Persuratan Online
            </Link>
            <Link
              to="/layanan/sistem-informasi"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${isActive('/layanan/sistem-informasi') ? 'bg-red-50 text-red-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <Database className="w-4 h-4 text-yellow-600" />
              Sistem Informasi Lembaga
            </Link>
          </div>

          <Link
            to="/berita"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${isActive('/berita') ? 'bg-red-50 text-red-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            <BookOpen className="w-5 h-5 text-blue-600" />
            Berita & Pengumuman
          </Link>

          <Link
            to="/kontak"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${isActive('/kontak') ? 'bg-red-50 text-red-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            <Phone className="w-5 h-5 text-purple-600" />
            Kontak
          </Link>
        </div>
      )}
    </header>
  );
}
