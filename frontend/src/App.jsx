import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import SambutanPage from './pages/SambutanPage';
import ProfilPage from './pages/ProfilPage';
import PersuratanPage from './pages/PersuratanPage';
import SistemInformasiPage from './pages/SistemInformasiPage';
import BeritaPage from './pages/BeritaPage';
import BeritaDetailPage from './pages/BeritaDetailPage';
import KontakPage from './pages/KontakPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLoginPage from './pages/AdminLoginPage';

// Helper to reset scroll position to top (0, 0) on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Dedicated Admin Routes (Without Main Navbar & Footer) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<Navigate to="/admin/berita" replace />} />
        <Route path="/admin/:tab" element={<AdminDashboard />} />

        {/* Public Routes with Navbar and Footer */}
        <Route
          path="*"
          element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/sambutan" element={<SambutanPage />} />
                  <Route path="/profil" element={<ProfilPage />} />
                  <Route path="/layanan/persuratan" element={<PersuratanPage />} />
                  <Route path="/layanan/sistem-informasi" element={<SistemInformasiPage />} />
                  <Route path="/berita" element={<BeritaPage />} />
                  <Route path="/berita/:id" element={<BeritaDetailPage />} />
                  <Route path="/kontak" element={<KontakPage />} />
                </Routes>
              </div>
              <Footer />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
