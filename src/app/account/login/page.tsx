'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Pill, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { createSupabaseBrowserClient } from '../../../lib/supabaseBrowser';
import { api } from '../../../lib/api';
import { setAuthSession } from '../../../lib/authSession';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const supabase = createSupabaseBrowserClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      let authToken = '';
      let isSuccess = false;

      // 1. Try Supabase Client direct Auth
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error && data?.session) {
          authToken = data.session.access_token;
          isSuccess = true;
        }
      } catch {
        // Fallback to Express backend
      }

      // 2. Fallback to Express Backend API if Supabase client sign-in failed
      if (!isSuccess) {
        try {
          const res = await api.login({ email, password });
          if (res && res.token) {
            authToken = res.token;
            isSuccess = true;
          }
        } catch (apiErr: unknown) {
          throw new Error((apiErr as Error).message || 'Invalid email or password');
        }
      }

      if (isSuccess && authToken) {
        setAuthSession(authToken);

        if (typeof window !== 'undefined') {
          window.location.href = redirectPath;
        } else {
          router.push(redirectPath);
          router.refresh();
        }
      } else {
        throw new Error('Failed to sign in. Please verify your email and password.');
      }
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-md shadow-brand-600/20">
          <Pill className="w-7 h-7 stroke-[2.5]" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Sign In</h1>
        <p className="text-xs text-slate-500">Access your orders, saved addresses & prescriptions</p>
      </div>

      {redirectPath.includes('/checkout') && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Please sign in to your account to complete your order checkout.</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@example.com"
              className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600 text-slate-900"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Password</label>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600 text-slate-900"
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
          {loading ? 'Signing in...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
        Don&apos;t have an account yet?{' '}
        <Link
          href={redirectPath !== '/account' ? `/account/signup?redirect=${encodeURIComponent(redirectPath)}` : '/account/signup'}
          className="font-bold text-brand-600 hover:text-brand-700"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading sign in...</div>}>
      <LoginForm />
    </Suspense>
  );
}

