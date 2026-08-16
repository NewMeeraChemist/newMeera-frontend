'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { createSupabaseBrowserClient } from '../../../lib/supabaseBrowser';
import { adminApi } from '../../../lib/adminApi';

const ADMIN_PATH = '/ops-console-7f2q';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [websiteHp, setWebsiteHp] = useState(''); // Honeypot bot protection field
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const supabase = createSupabaseBrowserClient();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (websiteHp && websiteHp.trim().length > 0) {
      setErrorMsg('Automated submission rejected.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !authData.user) {
        throw new Error('Invalid authentication credentials');
      }

      if (authData.session) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', authData.session.access_token);
          document.cookie = `auth_token=${authData.session.access_token}; path=/; max-age=86400; SameSite=Lax`;
        }
      }

      // Check admin status via Express API /api/admin/verify or user metadata
      let isVerifiedAdmin = false;
      try {
        const verifyRes = await adminApi.verifyAdminStatus();
        if (verifyRes && verifyRes.isAdmin) {
          isVerifiedAdmin = true;
        }
      } catch {
        // Fallback: Check if user metadata role is admin
        if (authData.user.user_metadata?.role === 'admin') {
          isVerifiedAdmin = true;
        }
      }

      if (!isVerifiedAdmin) {
        await supabase.auth.signOut();
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        throw new Error('Access denied. Account lacks active administrative privileges.');
      }

      if (typeof window !== 'undefined') {
        window.location.href = ADMIN_PATH;
      } else {
        router.push(ADMIN_PATH);
        router.refresh();
      }
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Admin authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 bg-slate-900 text-white rounded-3xl border border-slate-800 p-8 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">Operations Console Sign In</h1>
        <p className="text-xs text-slate-400">Restricted portal for authorized pharmacy personnel</p>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-red-950/60 border border-red-800/80 rounded-2xl text-xs text-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
        {/* Invisible Honeypot Field for Bot Detection */}
        <div style={{ display: 'none', opacity: 0, position: 'absolute', left: '-9999px' }} aria-hidden="true">
          <label htmlFor="website_hp">Website (Do not fill)</label>
          <input
            id="website_hp"
            type="text"
            name="website_hp"
            tabIndex={-1}
            autoComplete="off"
            value={websiteHp}
            onChange={(e) => setWebsiteHp(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-300 mb-1">Admin Email</label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@meerachemist.com"
              className="w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-brand-600 text-white"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-300 mb-1">Password</label>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-brand-600 text-white"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-600/20 transition flex items-center justify-center gap-2 active:scale-95 ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Verifying Credentials...' : 'Authenticate Admin'} <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
