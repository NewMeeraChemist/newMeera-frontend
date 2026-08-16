'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  ShoppingBag,
  X,
  Phone,
  Calendar,
} from 'lucide-react';
import { adminApi } from '@/lib/adminApi';
import { Address } from '@/types';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Array<{ id: string; fullName: string; phone?: string; createdAt: string; orderCount: number }>>([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Customer Detail Drawer Modal
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [customerDetail, setCustomerDetail] = useState<{
    customer: { id: string; fullName: string; phone?: string; createdAt: string };
    addresses: Address[];
    orders: Array<{ id: string; orderNumber: string; status: string; total: number; paymentMethod: string; createdAt: string }>;
  } | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchCustomers = async (page: number = pagination.page) => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: page.toString(),
        pageSize: '10',
      };
      if (search) params.search = search;

      const res = await adminApi.getCustomers(params);
      setCustomers(res.customers);
      setPagination(res.pagination);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(1);
  }, [search]);

  const handleViewCustomer = async (customerId: string) => {
    setSelectedCustomerId(customerId);
    setLoadingDetail(true);
    try {
      const res = await adminApi.getCustomerDetail(customerId);
      setCustomerDetail(res);
    } catch (err) {
      console.error('Failed to fetch customer detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Customer Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">Read-only view of customer accounts, delivery addresses and order history</p>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Registered Date</th>
                <th className="p-4">Total Orders</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Loading customer profiles...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No customers found matching search.
                  </td>
                </tr>
              ) : (
                customers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold text-xs">
                        {cust.fullName.charAt(0).toUpperCase()}
                      </div>
                      <span>{cust.fullName}</span>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">{cust.phone || 'N/A'}</td>
                    <td className="p-4 text-slate-500">{new Date(cust.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 font-bold text-slate-800 text-[11px]">
                        {cust.orderCount} Orders
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleViewCustomer(cust.id)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-800 font-semibold text-xs transition inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Profile & History</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Server-side Pagination Footer */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Page <span className="font-bold text-slate-900">{pagination.page}</span> of{' '}
            <span className="font-bold text-slate-900">{pagination.totalPages || 1}</span> ({pagination.total} registered customers)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchCustomers(pagination.page - 1)}
              disabled={pagination.page <= 1 || loading}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => fetchCustomers(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || loading}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Customer Detail Read-Only Drawer Modal */}
      {selectedCustomerId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-base">
                  {customerDetail?.customer.fullName.charAt(0).toUpperCase() || 'C'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{customerDetail?.customer.fullName}</h3>
                  <p className="text-xs text-slate-400">Read-Only Customer Audit Overview</p>
                </div>
              </div>
              <button onClick={() => setSelectedCustomerId(null)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {loadingDetail ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading profile, address book, and order history...</div>
            ) : customerDetail ? (
              <div className="space-y-5 text-xs">
                {/* Profile Overview */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block">Phone Number</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-teal-600" />
                      {customerDetail.customer.phone || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block">Account Created</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-teal-600" />
                      {new Date(customerDetail.customer.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Delivery Address Book */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-teal-600" /> Registered Delivery Addresses ({customerDetail.addresses.length})
                  </h4>
                  {customerDetail.addresses.length === 0 ? (
                    <p className="text-slate-400 text-xs py-2">No addresses saved by customer.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {customerDetail.addresses.map((addr) => (
                        <div key={addr.id} className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{addr.label}</span>
                            {addr.isDefault && (
                              <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.5 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600">
                            {addr.line1}, {addr.line2 ? `${addr.line2}, ` : ''}{addr.city}, {addr.state} - {addr.pincode}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Order History Timeline */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-teal-600" /> Order History ({customerDetail.orders.length})
                  </h4>
                  {customerDetail.orders.length === 0 ? (
                    <p className="text-slate-400 text-xs py-2">No past orders placed by this customer.</p>
                  ) : (
                    <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                      {customerDetail.orders.map((ord) => (
                        <div key={ord.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                          <div>
                            <div className="font-mono font-bold text-slate-900">{ord.orderNumber}</div>
                            <div className="text-[11px] text-slate-400">{new Date(ord.createdAt).toLocaleDateString()}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-slate-900">₹{ord.total}</div>
                            <div className="text-[11px] font-semibold capitalize text-teal-700">{ord.status}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
