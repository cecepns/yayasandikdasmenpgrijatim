import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowLeft } from 'lucide-react';
import { api } from '../utils/api';
import { API_ENDPOINTS } from '../utils/endpoints';
import { requestHandler } from '../utils/request';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to admin dashboard
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin/berita', { replace: true });
    }
  }, [navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginForm.username || !loginForm.password) {
      toast.error('Masukkan username dan password admin');
      return;
    }

    setLoading(true);
    const { data, error } = await requestHandler(() =>
      api.post(API_ENDPOINTS.AUTH.LOGIN, loginForm)
    );

    setLoading(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Login Admin Berhasil!');
      localStorage.setItem('adminToken', JSON.stringify(data.data));
      navigate('/admin/berita', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-red-50 text-red-700 rounded-2xl mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">PANEL ADMIN DIKDASMEN</h1>
          <p className="text-xs text-slate-500">Yayasan Pembina Lembaga Pendidikan PGRI Jawa Timur</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Username Admin</label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                required
                placeholder="Username admin..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-slate-50 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-slate-50 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-red-700 hover:bg-red-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-700/20 disabled:opacity-50 transition-all mt-2"
          >
            {loading ? 'Proses Masuk...' : 'Masuk ke Panel Admin'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Website Utama</span>
          </button>
        </div>

      </div>
    </div>
  );
}
