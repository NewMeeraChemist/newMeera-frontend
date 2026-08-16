'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, MapPin, User, FileText, LogOut, Pill } from 'lucide-react';
import { createSupabaseBrowserClient } from '../../lib/supabaseBrowser';
import { clearAuthSession } from '../../lib/authSession';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  // Do not render sidebar layout for login and signup pages
  if (pathname === '/account/login' || pathname === '/account/signup') {
    return <>{children}</>;
  }

  const navItems = [
    { label: 'Dashboard', href: '/account', icon: LayoutDashboard },
    { label: 'My Orders', href: '/account/orders', icon: ShoppingBag },
    { label: 'Delivery Addresses', href: '/account/addresses', icon: MapPin },
    { label: 'Uploaded Prescriptions', href: '/account/prescriptions', icon: FileText },
    { label: 'Profile & Security', href: '/account/profile', icon: User },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    clearAuthSession();
    router.push('/account/login');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Navigation Sidebar */}
        <aside className="lg:col-span-1 bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2 shadow-sm h-fit">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = pathname === item.href || (item.href !== '/account' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-brand-600'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="lg:col-span-3">{children}</main>
      </div>
    </div>
  );
}
