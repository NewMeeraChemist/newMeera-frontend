'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, FileText, Package, LogOut, Users, UserCheck } from 'lucide-react';
import { createSupabaseBrowserClient } from '../../lib/supabaseBrowser';

const ADMIN_PATH = '/ops-console-7f2q';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  if (pathname === `${ADMIN_PATH}/login`) {
    return <>{children}</>;
  }

  const navItems = [
    { label: 'Overview', href: ADMIN_PATH, icon: LayoutDashboard },
    { label: 'Manage Orders', href: `${ADMIN_PATH}/orders`, icon: ShoppingBag },
    { label: 'Prescription Queue', href: `${ADMIN_PATH}/prescriptions`, icon: FileText },
    { label: 'Inventory & Prices', href: `${ADMIN_PATH}/products`, icon: Package },
    { label: 'Customer Directory', href: `${ADMIN_PATH}/customers`, icon: Users },
    { label: 'Team & Access', href: `${ADMIN_PATH}/team`, icon: UserCheck },
  ];


  const handleSignOut = async () => {
    await supabase.auth.signOut();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    router.push(`${ADMIN_PATH}/login`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Navigation Sidebar */}
        <aside className="lg:col-span-1 bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2 shadow-sm h-fit">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
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
              <span>Admin Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="lg:col-span-3">{children}</main>
      </div>
    </div>
  );
}
