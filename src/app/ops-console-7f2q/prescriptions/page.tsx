'use client';

import React, { useEffect, useState } from 'react';
import {
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  X,
  MessageSquare,
} from 'lucide-react';
import { adminApi } from '@/lib/adminApi';
import { Prescription } from '@/types';

export default function AdminPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'pending_review' | 'approved' | 'rejected' | 'all'>('pending_review');

  // Preview & Action Modals
  const [previewSignedUrl, setPreviewSignedUrl] = useState<string | null>(null);
  const [reviewModalRx, setReviewModalRx] = useState<Prescription | null>(null);
  const [reviewAction, setReviewAction] = useState<'approved' | 'rejected'>('approved');
  const [pharmacistNote, setPharmacistNote] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchPrescriptions = async (page: number = pagination.page) => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: page.toString(),
        pageSize: '10',
      };
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await adminApi.getPrescriptions(params);
      setPrescriptions(res.prescriptions);
      setPagination(res.pagination);
    } catch (err) {
      console.error('Failed to fetch prescriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions(1);
  }, [statusFilter]);

  const handleOpenDocPreview = async (rxId: string) => {
    try {
      const res = await adminApi.getPrescriptionSignedUrl(rxId);
      if (res.signedUrl) {
        setPreviewSignedUrl(res.signedUrl);
      } else {
        alert('Could not generate signed URL for prescription document.');
      }
    } catch (err) {
      console.error('Signed URL generation failed:', err);
      alert('Error retrieving signed document URL.');
    }
  };

  const handleOpenReviewModal = (rx: Prescription, action: 'approved' | 'rejected') => {
    setReviewModalRx(rx);
    setReviewAction(action);
    setPharmacistNote(action === 'approved' ? 'Verified valid prescription document.' : 'Illegible document or missing doctor signature.');
  };

  const handleSubmitReview = async () => {
    if (!reviewModalRx) return;

    setSubmittingReview(true);
    try {
      await adminApi.reviewPrescription(reviewModalRx.id, reviewAction, pharmacistNote);
      setReviewModalRx(null);
      fetchPrescriptions(pagination.page);
    } catch (err) {
      console.error('Failed to submit prescription review:', err);
      alert('Error updating prescription review status.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Prescription Review Queue</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
              Pharmacist Portal
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Review customer doctor uploads, verify authenticity and issue approvals</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-sm flex items-center gap-2">
        {(['pending_review', 'approved', 'rejected', 'all'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition ${
              statusFilter === tab
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Prescriptions Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="p-4">Prescription ID</th>
                <th className="p-4">Customer ID</th>
                <th className="p-4">Linked Order</th>
                <th className="p-4">Uploaded At</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading prescription queue...
                  </td>
                </tr>
              ) : prescriptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No prescription documents found for this filter.
                  </td>
                </tr>
              ) : (
                prescriptions.map((rx) => (
                  <tr key={rx.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-mono font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-600" />
                      <span>{rx.id.slice(0, 8)}...</span>
                    </td>
                    <td className="p-4 font-mono text-slate-500">{rx.customerId?.slice(0, 8) || 'Guest'}</td>
                    <td className="p-4 font-mono text-slate-600">{rx.orderId ? rx.orderId.slice(0, 8) : 'Not linked yet'}</td>
                    <td className="p-4 text-slate-500">{new Date(rx.createdAt).toLocaleString()}</td>
                    <td className="p-4">
                      {rx.status === 'pending_review' ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                          Pending Review
                        </span>
                      ) : rx.status === 'approved' ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                          Approved
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 font-bold text-[11px]">
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* View Document */}
                        <button
                          onClick={() => handleOpenDocPreview(rx.id)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold transition flex items-center gap-1"
                          title="View Document via Signed URL"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="text-[11px]">View File</span>
                        </button>

                        {/* Approve / Reject Actions */}
                        {rx.status === 'pending_review' && (
                          <>
                            <button
                              onClick={() => handleOpenReviewModal(rx, 'approved')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleOpenReviewModal(rx, 'rejected')}
                              className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] transition"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Page <span className="font-bold text-slate-900">{pagination.page}</span> of{' '}
            <span className="font-bold text-slate-900">{pagination.totalPages || 1}</span> ({pagination.total} prescriptions)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchPrescriptions(pagination.page - 1)}
              disabled={pagination.page <= 1 || loading}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => fetchPrescriptions(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || loading}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Signed URL Preview Modal */}
      {previewSignedUrl && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" /> Prescribed Doctor Document Preview
              </h3>
              <button onClick={() => setPreviewSignedUrl(null)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="bg-slate-100 rounded-2xl p-4 flex items-center justify-center max-h-[60vh] overflow-hidden">
              <img src={previewSignedUrl} alt="Prescription Upload" className="max-h-[55vh] object-contain rounded-lg shadow-sm" />
            </div>

            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-slate-400">Short-lived secure signed URL (1-hour expiry)</span>
              <a
                href={previewSignedUrl}
                target="_blank"
                rel="noreferrer"
                className="text-teal-600 hover:text-teal-700 font-bold flex items-center gap-1"
              >
                <span>Open Original Image</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalRx && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {reviewAction === 'approved' ? 'Approve Prescription' : 'Reject Prescription'}
              </h3>
              <button onClick={() => setReviewModalRx(null)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Pharmacist Review Notes</label>
                <textarea
                  rows={3}
                  value={pharmacistNote}
                  onChange={(e) => setPharmacistNote(e.target.value)}
                  placeholder="Enter verification details or rejection reason for customer..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalRx(null)}
                  className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  disabled={submittingReview}
                  className={`px-5 py-2 text-white font-bold rounded-xl shadow-md transition ${
                    reviewAction === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {submittingReview ? 'Submitting...' : `Confirm ${reviewAction === 'approved' ? 'Approval' : 'Rejection'}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
