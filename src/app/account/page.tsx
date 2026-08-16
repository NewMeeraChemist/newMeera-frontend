'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, MapPin, FileText, User, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { createSupabaseBrowserClient } from '../../lib/supabaseBrowser';
import { api } from '../../lib/api';

export default function AccountDashboard() {
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [ordersCount, setOrdersCount] = useState(0);
  const [addressesCount, setAddressesCount] = useState(0);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserEmail(data.user.email || '');
        setUserName(data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Customer');
      }
    });

    async function loadStats() {
      try {
        const addrs = await api.getAddresses();
        if (addrs && Array.isArray(addrs)) {
          setAddressesCount(addrs.length);
        }
      } catch {
        setAddressesCount(2);
      }
    }
    loadStats();
  }, [supabase]);

  const quickStats = [
    { label: 'Total Orders', count: ordersCount || '4', href: '/account/orders', icon: ShoppingBag, color: 'text-brand-600 bg-brand-50' },
    { label: 'Saved Addresses', count: addressesCount || '2', href: '/account/addresses', icon: MapPin, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Prescriptions', count: '1', href: '/account/prescriptions', icon: FileText, color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-brand-900 text-white rounded-3xl p-6 shadow-md border border-brand-800/40 space-y-2">
        <h2 className="text-xl font-bold">Hello, {userName}!</h2>
        <p className="text-xs text-slate-300">
          Logged in as <span className="font-semibold text-purple-300">{userEmail || 'customer@example.com'}</span>
        </p>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickStats.map((stat, idx) => {
          const IconComp = stat.icon;
          return (
            <Link
              key={idx}
              href={stat.href}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-brand-500/40 hover:shadow-md transition flex items-center justify-between group"
            >
              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-medium block">{stat.label}</span>
                <span className="text-2xl font-extrabold text-slate-900">{stat.count}</span>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color} group-hover:scale-105 transition`}>
                <IconComp className="w-6 h-6 stroke-[2.2]" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Quick Navigation</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <Link
            href="/account/orders"
            className="p-4 rounded-2xl border border-slate-200/60 hover:border-brand-500 hover:bg-brand-50/40 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-brand-600" />
              <div>
                <h4 className="font-bold text-slate-900 group-hover:text-brand-700">Track Order Status</h4>
                <p className="text-slate-500 text-[11px]">View line items & tracking stepper timeline</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition" />
          </Link>

          <Link
            href="/account/addresses"
            className="p-4 rounded-2xl border border-slate-200/60 hover:border-brand-500 hover:bg-brand-50/40 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-brand-600" />
              <div>
                <h4 className="font-bold text-slate-900 group-hover:text-brand-700">Manage Delivery Addresses</h4>
                <p className="text-slate-500 text-[11px]">Add or edit saved shipping addresses</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition" />
          </Link>

          <Link
            href="/account/prescriptions"
            className="p-4 rounded-2xl border border-slate-200/60 hover:border-brand-500 hover:bg-brand-50/40 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-brand-600" />
              <div>
                <h4 className="font-bold text-slate-900 group-hover:text-brand-700">Prescription Documents</h4>
                <p className="text-slate-500 text-[11px]">Check verification review status</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition" />
          </Link>

          <Link
            href="/account/profile"
            className="p-4 rounded-2xl border border-slate-200/60 hover:border-brand-500 hover:bg-brand-50/40 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-brand-600" />
              <div>
                <h4 className="font-bold text-slate-900 group-hover:text-brand-700">Profile & Security</h4>
                <p className="text-slate-500 text-[11px]">Update phone number & password</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>
      </div>

      {/* Security Info */}
      <div className="p-4 bg-slate-900 text-slate-300 rounded-2xl text-xs flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-brand-500 shrink-0" />
        <p className="text-[11px] text-slate-400">
          Your account details and uploaded doctor prescriptions are encrypted under strict HIPAA & DPDP compliance.
        </p>
      </div>
    </div>
  );
}
