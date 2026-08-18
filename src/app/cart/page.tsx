'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, FileText, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { getAuthToken } from '../../lib/authSession';

export default function CartPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const { items, updateQuantity, removeItem, clearCart, getSubtotal, requiresPrescription } =
    useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="p-12 text-center text-sm text-slate-500">Loading cart...</div>;
  }

  const subtotal = getSubtotal();
  const shippingFee = subtotal >= 500 || subtotal === 0 ? 0 : 50;
  const grandTotal = subtotal + shippingFee;
  const rxRequired = requiresPrescription();

  const handleProceedToCheckout = () => {
    const token = getAuthToken();
    if (!token) {
      router.push('/account/login?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-brand-600" /> Shopping Cart
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review your selected medicines and health items</p>
        </div>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Empty Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Your cart is currently empty</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore our wide range of prescription medicines, daily vitamins, baby care & medical devices.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-600/20 hover:bg-brand-700 transition"
          >
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Line Items List */}
          <div className="lg:col-span-2 space-y-4">
            {rxRequired && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
                <FileText className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">Prescription Required Notice</h4>
                  <p className="text-amber-800 mt-0.5">
                    Your cart contains prescription items. You will be prompted to select or upload a valid prescription during checkout.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl border border-slate-200/80 divide-y divide-slate-100 shadow-sm overflow-hidden">
              {items.map((item) => (
                <div key={item.product.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 bg-slate-50 rounded-xl border border-slate-100 shrink-0 overflow-hidden">
                    <Image
                      src={item.product.thumbnailUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80'}
                      alt={item.product.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 space-y-1 text-center sm:text-left">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="text-sm font-bold text-slate-900 hover:text-brand-600 transition line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-500">
                      <span>Unit Price: ₹{item.product.salePrice}</span>
                      {item.product.requiresPrescription && (
                        <span className="text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full text-[10px]">
                          Rx Required
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Edit Controls */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Total Line Price */}
                  <div className="text-right min-w-[80px]">
                    <span className="text-sm font-extrabold text-slate-900 block">
                      ₹{item.product.salePrice * item.quantity}
                    </span>
                  </div>

                  {/* Remove Action */}
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-2 text-slate-400 hover:text-red-600 transition rounded-lg hover:bg-red-50"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Summary Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Order Summary</h3>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="font-bold text-slate-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  {shippingFee === 0 ? (
                    <span className="font-bold text-emerald-600">FREE</span>
                  ) : (
                    <span className="font-bold text-slate-900">₹{shippingFee}</span>
                  )}
                </div>
                {subtotal < 500 && (
                  <p className="text-[11px] text-brand-600 bg-brand-50 p-2 rounded-xl">
                    Add ₹{500 - subtotal} more for FREE shipping!
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Grand Total</span>
                <span className="text-xl font-extrabold text-brand-700">₹{grandTotal}</span>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-brand-600/20 transition flex items-center justify-center gap-2 active:scale-95"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Guarantee Badge */}
            <div className="p-4 bg-slate-900 text-slate-300 rounded-2xl text-xs space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold">
                <ShieldCheck className="w-4 h-4 text-brand-500" /> Safe & Secure Checkout
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                256-bit SSL encrypted checkout. Authentic medicines dispatched directly from licensed Meera Chemist pharmacy outlet.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
