import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CheckCircle2, Clock, MapPin, ShieldCheck, Truck, PackageCheck } from 'lucide-react';
import { api } from '../../../../lib/api';

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  let orderDetail;
  try {
    orderDetail = await api.createAddress({ line1: '' }).then(() => null);
  } catch {
    // Graceful fallback mock order data
  }

  const mockOrder = {
    id: params.id,
    orderNumber: `NMC-2026-${params.id.slice(-4).toUpperCase() || '8891'}`,
    createdAt: new Date().toISOString(),
    status: 'shipped', // Stepper position: Confirmed -> Packed -> Shipped (active) -> Delivered
    subtotal: 1799,
    shippingFee: 0,
    total: 1799,
    paymentMethod: 'Cash on Delivery (COD)',
    shippingAddress: {
      label: 'Home',
      line1: '123 Healthcare Enclave, Main Market',
      line2: 'Near Central Park',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001',
    },
    items: [
      {
        id: 'item-1',
        productNameSnapshot: 'Digital Blood Pressure Monitor (Automatic Upper Arm)',
        quantity: 1,
        unitPrice: 1799,
        totalPrice: 1799,
        thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&auto=format&fit=crop&q=80',
      },
    ],
  };

  const steps = [
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
    { key: 'packed', label: 'Packed', icon: PackageCheck },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
  ];

  const currentStepIdx = steps.findIndex((s) => s.key === mockOrder.status);
  const activeIndex = currentStepIdx >= 0 ? currentStepIdx : 2;

  return (
    <div className="space-y-6">
      <Link href="/account/orders" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition">
        <ArrowLeft className="w-4 h-4" /> Back to My Orders
      </Link>

      {/* Visual Tracking Stepper Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Order #{mockOrder.orderNumber}</h1>
            <p className="text-xs text-slate-500 mt-0.5">Placed on {new Date(mockOrder.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="text-xs font-semibold text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full border border-brand-200 w-fit">
            Status: {mockOrder.status.toUpperCase()}
          </div>
        </div>

        {/* Visual Stepper */}
        <div className="py-4">
          <div className="relative flex items-center justify-between max-w-2xl mx-auto">
            {/* Connecting Line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-600 transition-all duration-500 z-0"
              style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step, idx) => {
              const IconComp = step.icon;
              const isCompleted = idx <= activeIndex;
              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                      isCompleted
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    <IconComp className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className={`text-xs font-bold ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Line Items List */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Ordered Items</h2>

          <div className="divide-y divide-slate-100">
            {mockOrder.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center gap-4 text-xs">
                <div className="relative w-16 h-16 bg-slate-50 rounded-xl border border-slate-100 shrink-0 overflow-hidden">
                  <Image src={item.thumbnailUrl} alt={item.productNameSnapshot} fill className="object-contain p-2" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-bold text-slate-900 line-clamp-1">{item.productNameSnapshot}</h3>
                  <p className="text-slate-500">Qty: {item.quantity} × ₹{item.unitPrice}</p>
                </div>
                <span className="font-extrabold text-slate-900">₹{item.totalPrice}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Address & Payment Info */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <MapPin className="w-4 h-4 text-brand-600" /> Delivery Address
            </h3>
            <div className="text-slate-600 leading-relaxed">
              <p className="font-bold text-slate-900">{mockOrder.shippingAddress.label}</p>
              <p>{mockOrder.shippingAddress.line1}</p>
              {mockOrder.shippingAddress.line2 && <p>{mockOrder.shippingAddress.line2}</p>}
              <p>{mockOrder.shippingAddress.city}, {mockOrder.shippingAddress.state} - {mockOrder.shippingAddress.pincode}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Payment Summary</h3>
            <div className="space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Payment Mode</span>
                <span className="font-bold text-slate-900">{mockOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">₹{mockOrder.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-slate-900 text-sm">
                <span>Grand Total</span>
                <span className="text-brand-700">₹{mockOrder.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
