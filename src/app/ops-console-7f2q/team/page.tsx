'use client';

import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Search,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserCheck,
  X,
  AlertTriangle,
  Mail,
  User,
} from 'lucide-react';
import { adminApi } from '@/lib/adminApi';
import { AdminUser, UserRole } from '@/types';

export default function AdminTeamPage() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Invite Modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    fullName: '',
    role: 'admin' as UserRole,
  });
  const [inviting, setInviting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchTeam = async (page: number = pagination.page) => {
    setLoading(true);
    try {
      const res = await adminApi.getAdminUsers({ page: page.toString(), pageSize: '10' });
      setAdminUsers(res.adminUsers);
      setPagination(res.pagination);
    } catch (err) {
      console.error('Failed to fetch admin team:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam(1);
  }, []);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.email || !inviteForm.fullName) return;

    setInviting(true);
    try {
      await adminApi.inviteAdminUser(inviteForm);
      setIsInviteModalOpen(false);
      setInviteForm({ email: '', fullName: '', role: 'admin' });
      fetchTeam(pagination.page);
    } catch (err: any) {
      console.error('Failed to invite admin:', err);
      alert(err.message || 'Error inviting admin user.');
    } finally {
      setInviting(false);
    }
  };

  const handleToggleActive = async (adminId: string, currentActive: boolean) => {
    setUpdatingId(adminId);
    try {
      await adminApi.updateAdminUser(adminId, { isActive: !currentActive });
      fetchTeam(pagination.page);
    } catch (err) {
      console.error('Failed to update active status:', err);
      alert('Failed to update admin status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRoleChange = async (adminId: string, newRole: string) => {
    setUpdatingId(adminId);
    try {
      await adminApi.updateAdminUser(adminId, { role: newRole });
      fetchTeam(pagination.page);
    } catch (err) {
      console.error('Failed to update role:', err);
      alert('Failed to update admin role.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Admin Team & Privileges</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Super Admin Role Restricted
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Invite new team members, grant permissions, and control staff access</p>
        </div>
        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite New Admin</span>
        </button>
      </div>

      {/* Team Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="p-4">Admin Name & Email</th>
                <th className="p-4">Assigned Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Loading admin team directory...
                  </td>
                </tr>
              ) : adminUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No admin users found.
                  </td>
                </tr>
              ) : (
                adminUsers.map((admin) => (
                  <tr key={admin.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-semibold text-slate-900 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                        {admin.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{admin.fullName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{admin.email}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <select
                        value={admin.role}
                        disabled={updatingId === admin.id}
                        onChange={(e) => handleRoleChange(admin.id, e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-teal-500"
                      >
                        <option value="admin">Admin</option>
                        <option value="pharmacist">Pharmacist</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </td>
                    <td className="p-4">
                      {admin.isActive ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                          Active Staff
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 font-bold text-[11px]">
                          Deactivated
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-500">{new Date(admin.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleActive(admin.id, admin.isActive)}
                        disabled={updatingId === admin.id}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                          admin.isActive
                            ? 'border border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                            : 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {admin.isActive ? 'Deactivate Access' : 'Reactivate Access'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Server-side Pagination Footer */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Page <span className="font-bold text-slate-900">{pagination.page}</span> of{' '}
            <span className="font-bold text-slate-900">{pagination.totalPages || 1}</span> ({pagination.total} staff users)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchTeam(pagination.page - 1)}
              disabled={pagination.page <= 1 || loading}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => fetchTeam(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || loading}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Invite Admin User Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Invite New Administrator</h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={inviteForm.fullName}
                    onChange={(e) => setInviteForm({ ...inviteForm, fullName: e.target.value })}
                    placeholder="e.g. Dr. Anish Sharma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    placeholder="e.g. anish@meerachemist.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Assign System Role</label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as UserRole })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-teal-500 font-semibold"
                >
                  <option value="admin">Admin (Fulfillment & Catalog Management)</option>
                  <option value="pharmacist">Pharmacist (Prescription Review Queue)</option>
                  <option value="super_admin">Super Admin (Full Platform Control)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {inviting ? 'Sending Invite...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
