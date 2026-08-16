'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, Clock, CheckCircle2, XCircle, Upload, ShieldCheck } from 'lucide-react';
import { Prescription } from '@/types';

export default function CustomerPrescriptionsPage() {
  const [prescriptions] = useState<Prescription[]>([
    {
      id: 'rx-101',
      customerId: 'cust-1',
      orderId: 'ord-101',
      fileUrl: 'prescriptions/cust-1/1786573-dr_prescription_cardiac.pdf',
      status: 'approved',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'rx-102',
      customerId: 'cust-1',
      fileUrl: 'prescriptions/cust-1/1786590-antibiotic_rx.jpg',
      status: 'pending_review',
      createdAt: new Date().toISOString(),
    },
  ]);

  const getRxStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_review':
        return <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1"><Clock className="w-3 h-3 text-amber-600" /> Pending Review</span>;
      case 'approved':
        return <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified & Approved</span>;
      case 'rejected':
        return <span className="bg-red-50 text-red-800 border border-red-200 px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1"><XCircle className="w-3 h-3 text-red-600" /> Invalid / Rejected</span>;
      default:
        return <span className="bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full font-bold text-[10px]">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-600" /> Uploaded Prescriptions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Track pharmacist review status for prescription orders</p>
        </div>

        <Link
          href="/products?requiresPrescription=true"
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-600/20 transition flex items-center gap-1.5"
        >
          <Upload className="w-4 h-4" /> Upload New
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        {prescriptions.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-8">No prescription documents uploaded yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {prescriptions.map((rx) => (
              <div key={rx.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 line-clamp-1">{rx.fileUrl.split('/').pop()}</h3>
                    <p className="text-slate-500 text-[11px]">Uploaded on {new Date(rx.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  {getRxStatusBadge(rx.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-900 text-slate-300 rounded-2xl text-xs flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-brand-500 shrink-0" />
        <p className="text-[11px] text-slate-400">
          All uploaded medical documents are reviewed by a licensed Meera Chemist pharmacist before prescription medicines are dispatched.
        </p>
      </div>
    </div>
  );
}
