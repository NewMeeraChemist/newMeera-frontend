'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingBag, User, Video, Star } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { createSupabaseBrowserClient } from '../../lib/supabaseBrowser';
import { getAuthToken, isSessionExpired, clearAuthSession } from '../../lib/authSession';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const totalCartCount = useCartStore((state) => state.getTotalCount());
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    setIsMounted(true);

    async function checkAuth() {
      if (isSessionExpired()) {
        clearAuthSession();
        setUser(null);
        return;
      }

      const token = getAuthToken();
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        const name = data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Account';
        setUser({ name, email: data.user.email || '' });
      } else if (token) {
        setUser({ name: 'Account', email: '' });
      } else {
        setUser(null);
      }
    }

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
      } else if (session?.user) {
        const name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Account';
        setUser({ name, email: session.user.email || '' });
      }
    });

    const handleLocalAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('auth_state_changed', handleLocalAuthChange);
    window.addEventListener('storage', handleLocalAuthChange);

    return () => {
      authListener?.subscription.unsubscribe();
      window.removeEventListener('auth_state_changed', handleLocalAuthChange);
      window.removeEventListener('storage', handleLocalAuthChange);
    };
  }, [supabase, pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white border-b border-slate-100 text-slate-800 font-sans">
      {/* Top New Meera Chemist Announcement Ticker Bar */}
      <div className="bg-[#fcf7ff] text-[#581c87] text-xs py-2 px-4 border-b border-purple-100/60 font-medium">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[12px]">
          <div className="flex items-center gap-2">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0 inline" />
            <span className="font-semibold">₹200 OFF above ₹3499! Use <span className="font-bold text-purple-900">NMC200</span></span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-purple-900">
            <Link href="/products" className="hover:underline">
              All Medicines
            </Link>
            <span>•</span>
            <Link href="/account/prescriptions" className="hover:underline">
              Upload Prescription
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-6">
        {/* Empty left or secondary space for balance */}
        <div className="w-32 hidden md:block"></div>

        {/* Brand Logo (New Meera Chemist Style) */}
        <Link href="/" className="flex items-center gap-2.5 group mx-auto md:mx-0">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#6b21a8] to-[#9333ea] text-white flex items-center justify-center font-bold text-xl shadow-md shadow-purple-600/20 group-hover:scale-105 transition-all">
            N
          </div>
          <span className="text-3xl font-black tracking-tight text-[#4c1d95] font-serif">
            New Meera Chemist
          </span>
        </Link>

        {/* User Account & Cart CTAs */}
        <div className="flex items-center gap-5">
          {isMounted && user ? (
            <Link
              href="/account"
              className="flex items-center gap-2 text-sm font-bold text-[#6b21a8] hover:text-[#581c87] bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200 transition"
            >
              <div className="w-5 h-5 rounded-full bg-[#6b21a8] text-white flex items-center justify-center text-[10px] font-black">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="max-w-[120px] truncate">{user.name}</span>
            </Link>
          ) : (
            <Link
              href="/account/login"
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-[#6b21a8] transition"
            >
              <User className="w-4.5 h-4.5 text-slate-600" />
              <span>Login</span>
            </Link>
          )}

          <Link
            href="/cart"
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-[#6b21a8] transition relative"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-slate-700" />
              {isMounted && totalCartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#6b21a8] text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {totalCartCount}
                </span>
              )}
            </div>
            <span>Cart</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
