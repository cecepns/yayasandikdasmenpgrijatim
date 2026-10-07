import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, FileText, Database, BookOpen, LogOut, Menu, X, ArrowLeft, Users, Settings, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSidebar({ activeTab }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get current logged in user from localStorage
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('adminToken') || '{}');
    } catch {
      return {};
    }
  })();

  const isSuperAdmin = currentUser?.role === 'admin';

  // Menu items based on role:
  // If Super Admin: all menus + Kelola Admin (users)
  // If Editor (Admin Berita): only Berita & Pengumuman
  const menuItems = isSuperAdmin
    ? [
        { id: 'berita', path: '/admin/berita', label: 'Kelola Berita & Info', icon: BookOpen },
        { id: 'persuratan', path: '/admin/persuratan', label: 'Layanan Persuratan', icon: FileText },
        { id: 'sistem-informasi', path: '/admin/sistem-informasi', label: 'Data Lembaga (SIL)', icon: Database },
        { id: 'pengurus', path: '/admin/pengurus', label: 'Pengurus Yayasan', icon: Users },
        { id: 'settings', path: '/admin/settings', label: 'Profil & Sambutan', icon: Settings },
        { id: 'users', path: '/admin/users', label: 'Kelola Admin / User', icon: UserCheck },
      ]
    : [
        { id: 'berita', path: '/admin/berita', label: 'Berita & Pengumuman', icon: BookOpen },
      ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Berhasil keluar dari Panel Admin');
    navigate('/admin/login', { replace: true });
  };

  const currentTab = activeTab || location.pathname.split('/')[2] || 'berita';

  return (
    <>
      {/* Mobile Toggle Bar */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 text-white p-4">
        <div className="flex items-center gap-2 font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-red-500" />
          <span>ADMIN DIKDASMEN PGRI</span>
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300"
        >
          {collapsed ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Panel */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transition-all duration-300 transform
        ${collapsed ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <img src="/logo.png" alt="Logo PGRI" className="h-10 w-auto bg-white p-1 rounded" />
            <div>
              <h2 className="font-bold text-white text-sm leading-tight">PANEL ADMIN</h2>
              <p className="text-xs text-red-400 font-medium">Dikdasmen PGRI Jatim</p>
            </div>
          </div>

          {/* User Info & Role Badge */}
          <div className="px-5 py-3.5 bg-slate-800/60 border-b border-slate-800/80">
            <div className="flex items-center justify-between gap-2">
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">
                  {currentUser?.nama || currentUser?.username || 'Admin'}
                </p>
                <p className="text-[11px] text-slate-400 font-mono truncate">
                  @{currentUser?.username || 'admin'}
                </p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                isSuperAdmin 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {isSuperAdmin ? 'Super Admin' : 'Admin Berita'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {isSuperAdmin ? 'Manajemen Data & Lembaga' : 'Kelola Konten'}
            </div>
            {menuItems.map(item => {
              const Icon = item.icon;
              const isSelected = currentTab === item.id || location.pathname === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    setCollapsed(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all
                    ${isSelected 
                      ? 'bg-red-700 text-white shadow-md font-semibold' 
                      : 'hover:bg-slate-800 text-slate-300 hover:text-white'}
                  `}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl font-medium text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl font-medium text-sm text-red-400 hover:text-white hover:bg-red-900/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>
    </>
  );
}
