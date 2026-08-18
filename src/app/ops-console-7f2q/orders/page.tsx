'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  ShoppingBag,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  PackageCheck,
  Truck,
  X,
  User,
  MapPin,
  FileText,
} from 'lucide-react';
import { adminApi } from '@/lib/adminApi';
import { Order, OrderItem, Address } from '@/types';

const STATUSES = ['all', 'pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Selected Order Detail Modal
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderDetail, setOrderDetail] = useState<{
    order: Order;
    items: Array<{ id: string; productNameSnapshot: string; quantity: number; unitPrice: number; totalPrice: number }>;
    shippingAddress: Address | null;
    customerInfo: { id: string; fullName: string; phone?: string } | null;
  } | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = useCallback(async (page: number = pagination.page) => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: page.toString(),
        pageSize: '10',
      };
      if (selectedStatus !== 'all') params.status = selectedStatus;
      if (search) params.search = search;

      const res = await adminApi.getOrders(params);
      setOrders(res.orders);
      setPagination(res.pagination);
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, selectedStatus, search]);

  useEffect(() => {
    fetchOrders(1);
  }, [fetchOrders]);

  const handleViewDetail = async (orderId: string) => {
    setSelectedOrderId(orderId);
    setLoadingDetail(true);
    try {
      const detail = await adminApi.getOrderDetail(orderId);
      setOrderDetail(detail);
    } catch (err) {
      console.error('Failed to fetch order detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      if (orderDetail) {
        setOrderDetail({
          ...orderDetail,
          order: { ...orderDetail.order, status: newStatus as any },
        });
      }
      fetchOrders(pagination.page);
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert('Failed to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">Pending Review</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-[11px]">Confirmed</span>;
      case 'packed':
        return <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 font-bold text-[11px]">Packed</span>;
      case 'shipped':
        return <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 font-bold text-[11px]">Out for Delivery</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">Delivered</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 font-bold text-[11px]">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Order Fulfillment Queue</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage customer orders, status updates, shipping and invoices</p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-100 scrollbar-none">
          {STATUSES.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedStatus === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {st.charAt(0).toUpperCase() + st.slice(1)}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order number (e.g. NMC-2026-8891)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="p-4">Order Number</th>
                <th className="p-4">Date</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading order fulfillment queue...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No orders found for this criteria.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-mono font-bold text-slate-900">{ord.orderNumber}</td>
                    <td className="p-4 text-slate-500">{new Date(ord.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 font-bold text-slate-900">₹{ord.total}</td>
                    <td className="p-4 text-slate-600 font-semibold">{ord.paymentMethod}</td>
                    <td className="p-4">{getStatusBadge(ord.status)}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleViewDetail(ord.id)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-800 font-semibold text-xs transition inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Order</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Page <span className="font-bold text-slate-900">{pagination.page}</span> of{' '}
            <span className="font-bold text-slate-900">{pagination.totalPages || 1}</span> ({pagination.total} orders)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchOrders(pagination.page - 1)}
              disabled={pagination.page <= 1 || loading}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => fetchOrders(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || loading}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrderId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Order Details</h3>
                <p className="text-xs text-slate-400 font-mono">{orderDetail?.order.orderNumber}</p>
              </div>
              <button onClick={() => setSelectedOrderId(null)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {loadingDetail ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading order items & customer details...</div>
            ) : orderDetail ? (
              <div className="space-y-5 text-xs">
                {/* Status Update Control */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block">Current Status</span>
                    <div className="mt-1">{getStatusBadge(orderDetail.order.status)}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">Update Status:</span>
                    <select
                      value={orderDetail.order.status}
                      disabled={updatingStatus}
                      onChange={(e) => handleUpdateStatus(orderDetail.order.id, e.target.value)}
                      className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-teal-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="packed">Packed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Shipping & Customer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-slate-100 bg-white space-y-1">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-teal-600" /> Customer Information
                    </h4>
                    <p className="font-semibold text-slate-800">{orderDetail.customerInfo?.fullName || 'Walk-in / Online Guest'}</p>
                    <p className="text-slate-500">{orderDetail.customerInfo?.phone || 'No phone provided'}</p>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-100 bg-white space-y-1">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-teal-600" /> Delivery Address
                    </h4>
                    {orderDetail.shippingAddress ? (
                      <p className="text-slate-600">
                        {orderDetail.shippingAddress.line1}, {orderDetail.shippingAddress.city}, {orderDetail.shippingAddress.state} - {orderDetail.shippingAddress.pincode}
                      </p>
                    ) : (
                      <p className="text-slate-400">Standard Pharmacy Store Pickup</p>
                    )}
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="bg-slate-50 p-3 font-bold text-slate-700 border-b border-slate-200">
                    Order Items Breakdown
                  </div>
                  <div className="divide-y divide-slate-100 p-3 space-y-2">
                    {orderDetail.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs py-1">
                        <div>
                          <div className="font-bold text-slate-900">{item.productNameSnapshot}</div>
                          <div className="text-[11px] text-slate-400">Qty: {item.quantity} × ₹{item.unitPrice}</div>
                        </div>
                        <div className="font-bold text-slate-900">₹{item.totalPrice}</div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                    <span>Grand Total:</span>
                    <span className="text-teal-700">₹{orderDetail.order.total}</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
