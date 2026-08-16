'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  FileText,
  Package,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  IndianRupee,
  RefreshCw,
} from 'lucide-react';
import { adminApi } from '@/lib/adminApi';
import { AdminDashboardStats } from '@/types';

const ADMIN_PATH = '/ops-console-7f2q';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const mockAuditLogs = [
    { id: '1', action: 'UPDATE_ORDER_STATUS', details: 'Changed Order #NMC-2026-8891 status to CONFIRMED', timestamp: '10 mins ago', ip: '192.168.1.1' },
    { id: '2', action: 'REVIEW_PRESCRIPTION', details: 'Approved prescription document for Rx #rx-101', timestamp: '45 mins ago', ip: '192.168.1.1' },
    { id: '3', action: 'UPDATE_PRODUCT', details: 'Updated stock quantity for Paracetamol 500mg (Qty: 4)', timestamp: '2 hours ago', ip: '192.168.1.1' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Operations Dashboard</h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time fulfillment, inventory & prescription control center</p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Live Metrics</span>
        </button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Orders Today */}
        <Link
          href={`${ADMIN_PATH}/orders`}
          className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-slate-400 hover:shadow-md transition flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium block">Orders Today</span>
            <span className="text-2xl font-extrabold text-slate-900">
              {loading ? '...' : stats?.ordersToday ?? 0}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl border flex items-center justify-center text-amber-700 bg-amber-50 border-amber-200 group-hover:scale-105 transition">
            <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
          </div>
        </Link>

        {/* Card 2: Revenue Today */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium block">Revenue Today</span>
            <span className="text-2xl font-extrabold text-emerald-600 flex items-center">
              ₹{loading ? '...' : stats?.revenueToday.toLocaleString() ?? '0'}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl border flex items-center justify-center text-emerald-700 bg-emerald-50 border-emerald-200">
            <IndianRupee className="w-5 h-5 stroke-[2.2]" />
          </div>
        </div>

        {/* Card 3: Revenue This Week */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium block">Revenue (7 Days)</span>
            <span className="text-2xl font-extrabold text-blue-600 flex items-center">
              ₹{loading ? '...' : stats?.revenueThisWeek.toLocaleString() ?? '0'}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl border flex items-center justify-center text-blue-700 bg-blue-50 border-blue-200">
            <TrendingUp className="w-5 h-5 stroke-[2.2]" />
          </div>
        </div>

        {/* Card 4: Pending Prescriptions */}
        <Link
          href={`${ADMIN_PATH}/prescriptions`}
          className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-slate-400 hover:shadow-md transition flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium block">Pending Prescriptions</span>
            <span className="text-2xl font-extrabold text-purple-700">
              {loading ? '...' : stats?.pendingPrescriptionsCount ?? 0}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl border flex items-center justify-center text-purple-700 bg-purple-50 border-purple-200 group-hover:scale-105 transition">
            <FileText className="w-5 h-5 stroke-[2.2]" />
          </div>
        </Link>
      </div>

      {/* Low Stock Product Alerts Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900">Low-Stock Product Alerts</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
              {stats?.lowStockCount ?? 0} Items
            </span>
          </div>
          <Link
            href={`${ADMIN_PATH}/products?stockStatus=low_stock`}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>Manage Inventory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-6 text-center text-xs text-slate-400">Loading inventory alerts...</div>
        ) : !stats?.lowStockItems || stats.lowStockItems.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl">
            No low stock items detected. All products have healthy inventory level (&gt; 10 units).
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {stats.lowStockItems.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900">{item.name}</h4>
                  <span className="text-[11px] text-slate-500">Unit Price: ₹{item.salePrice}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 font-bold text-[11px]">
                    {item.stockQty} left in stock
                  </span>
                  <Link
                    href={`${ADMIN_PATH}/products`}
                    className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[11px] font-semibold hover:bg-slate-800 transition"
                  >
                    Restock
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fulfillment Quick Operations & Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fulfillment Actions */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Fulfillment Operations</h3>
          <div className="space-y-3 text-xs">
            <Link
              href={`${ADMIN_PATH}/orders`}
              className="p-4 rounded-2xl border border-slate-200/60 hover:border-slate-400 hover:bg-slate-50 transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-slate-800" />
                <div>
                  <h4 className="font-bold text-slate-900">Process Pending Orders</h4>
                  <p className="text-slate-500 text-[11px]">Update order status to Packed, Shipped or Delivered</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition" />
            </Link>

            <Link
              href={`${ADMIN_PATH}/prescriptions`}
              className="p-4 rounded-2xl border border-slate-200/60 hover:border-slate-400 hover:bg-slate-50 transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-purple-700" />
                <div>
                  <h4 className="font-bold text-slate-900">Prescription Verification Queue</h4>
                  <p className="text-slate-500 text-[11px]">Pharmacist review of uploaded doctor prescriptions</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition" />
            </Link>
          </div>
        </div>

        {/* Security Audit Trail */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600" /> Recent Administrative Audit Trail
          </h3>
          <div className="divide-y divide-slate-100 text-xs">
            {mockAuditLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between text-slate-600">
                <div>
                  <span className="font-mono font-bold text-slate-900 text-[11px] bg-slate-100 px-2 py-0.5 rounded-md mr-2">
                    {log.action}
                  </span>
                  <span>{log.details}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {log.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
