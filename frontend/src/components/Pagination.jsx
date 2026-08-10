import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ pagination, onPageChange, onLimitChange }) {
  if (!pagination) return null;

  const { page, limit, total, totalPages } = pagination;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 text-sm text-slate-600 border-t border-slate-100">
      
      {/* Limit Selector */}
      <div className="flex items-center gap-2">
        <span>Tampilkan</span>
        <select 
          value={limit} 
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="border border-slate-300 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span>data per halaman (Total: <strong className="text-slate-800">{total}</strong>)</span>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-2">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev</span>
        </button>

        <span className="px-3 py-1.5 rounded-lg font-semibold bg-red-50 text-red-700 border border-red-100">
          {page} / {totalPages || 1}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
