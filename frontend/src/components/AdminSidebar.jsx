import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, Database, BookOpen, LogOut, Menu, X, ArrowLeft, UserCheck } from 'lucide-react';

export default function AdminSidebar({ activeTab, setActiveTab, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'berita', label: 'Kelola Berita', icon: BookOpen },
    { id: 'persuratan', label: 'Layanan Persuratan', icon: FileText },
    { id: 'lembaga', label: 'Data Lembaga (SIL)', icon: Database },
    { id: 'settings', label: 'Profil Ketua Yayasan', icon: UserCheck },
  ];

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
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <img src="/logo.png" alt="Logo PGRI" className="h-10 w-auto bg-white p-1 rounded" />
            <div>
              <h2 className="font-bold text-white text-sm leading-tight">PANEL ADMIN</h2>
              <p className="text-xs text-red-400 font-medium">Dikdasmen PGRI Jatim</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Manajemen Data
            </div>
            {menuItems.map(item => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
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
            onClick={onLogout}
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
