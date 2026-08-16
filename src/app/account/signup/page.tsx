'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pill, Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createSupabaseBrowserClient } from '../../../lib/supabaseBrowser';
import { api } from '../../../lib/api';
import { setAuthSession } from '../../../lib/authSession';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const supabase = createSupabaseBrowserClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // 1. Register customer with auto-confirm via Express API
      try {
        await api.signup({ email, password, fullName });
      } catch {
        // Fallback: Direct Supabase auth signup
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (signUpError) throw signUpError;
      }

      // 2. Automatically sign in the customer
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !signInData.session) {
        setSuccessMsg('Account created successfully! Please sign in with your credentials.');
        setTimeout(() => router.push('/account/login'), 1500);
        return;
      }

      setAuthSession(signInData.session.access_token);

      setSuccessMsg('Account created successfully! Logging you in...');
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/account';
        } else {
          router.push('/account');
        }
      }, 1000);
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-md shadow-brand-600/20">
          <Pill className="w-7 h-7 stroke-[2.5]" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Customer Account</h1>
        <p className="text-xs text-slate-500">Sign up for 24/7 medicine ordering & express pharmacy delivery</p>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
          <div className="relative">
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600 text-slate-900"
            />
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
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
          {loading ? 'Creating account...' : 'Create Account'} <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
        Already have an account?{' '}
        <Link href="/account/login" className="font-bold text-brand-600 hover:text-brand-700">
          Sign In
        </Link>
      </div>
    </div>
  );
}
