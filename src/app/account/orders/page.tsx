'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Eye, Clock, CheckCircle2, Truck, PackageCheck, XCircle } from 'lucide-react';
import { api } from '../../../lib/api';

export default function CustomerOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (token) {
          const liveOrders = await api.getOrders();
          if (Array.isArray(liveOrders)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const formatted = liveOrders.map((ord: any) => ({
              id: ord.id,
              orderNumber: ord.orderNumber,
              createdAt: ord.createdAt,
              status: ord.status,
              total: ord.total,
              itemCount: ord.items?.length || 1,
            }));
            setOrders(formatted);
          }
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.warn('Could not load live customer orders:', err);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
      case 'confirmed':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Confirmed</span>;
      case 'packed':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1"><PackageCheck className="w-3 h-3" /> Packed</span>;
      case 'shipped':
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1"><Truck className="w-3 h-3" /> Shipped</span>;
      case 'delivered':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
      case 'cancelled':
        return <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1"><XCircle className="w-3 h-3" /> Cancelled</span>;
      default:
        return <span className="bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full font-bold text-[10px]">{status}</span>;
    }
  };

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch = ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || ord.status === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-600" /> Order History
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Track and view your medicine orders</p>
          </div>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order number..."
              className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto text-xs pb-1">
          {['ALL', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                selectedStatus === st
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Orders Table / List */}
        {filteredOrders.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-8">No orders found matching your search query.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredOrders.map((ord) => (
              <div key={ord.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{ord.orderNumber}</span>
                    {getStatusBadge(ord.status)}
                  </div>
                  <div className="text-slate-500 text-[11px] flex gap-3">
                    <span>Date: {new Date(ord.createdAt).toLocaleDateString()}</span>
                    <span>Items: {ord.itemCount}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-sm font-extrabold text-slate-900">₹{ord.total}</span>
                  <Link
                    href={`/account/orders/${ord.id}`}
                    className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold rounded-xl flex items-center gap-1 transition"
                  >
                    <Eye className="w-3.5 h-3.5" /> Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
