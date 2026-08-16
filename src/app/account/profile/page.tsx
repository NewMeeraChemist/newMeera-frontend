'use client';

import React, { useState, useEffect } from 'react';
import { User, Phone, Lock, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { createSupabaseBrowserClient } from '../../../lib/supabaseBrowser';

export default function ProfilePage() {
  const supabase = createSupabaseBrowserClient();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setFullName(data.user.user_metadata?.full_name || '');
        setPhone(data.user.user_metadata?.phone || '');
      }
    });
  }, [supabase]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage('');
    setErrorMsg('');

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName, phone },
      });

      if (error) throw new Error(error.message);
      setProfileMessage('Profile information updated successfully!');
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage('');
    setErrorMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw new Error(error.message);
      setPasswordMessage('Password changed successfully!');
      setNewPassword('');
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Failed to change password');
    }
  };

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Profile Form */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <User className="w-5 h-5 text-brand-600" /> Personal Profile Information
        </h2>

        {profileMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {profileMessage}
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-3 text-xs max-w-md">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md shadow-brand-600/20 transition flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save Profile Details
          </button>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Lock className="w-5 h-5 text-brand-600" /> Security & Password
        </h2>

        {passwordMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {passwordMessage}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-3 text-xs max-w-md">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">New Password</label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Lock className="w-4 h-4" /> Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
