import React from 'react';
import { Pill } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#6b21a8] flex items-center justify-center animate-bounce shadow-md">
        <Pill className="w-6 h-6" />
      </div>
      <div className="space-y-1 text-center">
        <h3 className="text-sm font-bold text-slate-800">Loading New Meera Chemist...</h3>
        <p className="text-xs text-slate-400">Fetching latest products & medicine catalog</p>
      </div>
    </div>
  );
}
