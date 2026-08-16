'use client';

import React from 'react';
import Link from 'next/link';
import { Pill, ShieldCheck, Truck, Clock, Lock, Sparkles, Stethoscope, Mail, ArrowRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-900">
      {/* Top Newsletter Banner */}
      <div className="max-w-7xl mx-auto px-4 mb-14">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <span className="bg-brand-500/20 text-brand-300 px-3 py-1 rounded-full text-xs font-bold border border-brand-500/30 inline-flex items-center gap-1.5">
              Online Pharmacy & Health Store
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Get Healthcare & Medicine Updates
            </h3>
            <p className="text-xs text-slate-400 max-w-xl">
              Subscribe for pharmacy updates, exclusive medicine discounts, and wellness health tips.
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="w-full lg:w-auto flex items-center gap-2 max-w-md">
            <div className="relative flex-1">
              <input
                type="email"
                placeholder="Enter your email..."
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-gradient-to-r from-brand-600 to-purple-700 hover:from-brand-500 hover:to-purple-600 text-white font-bold text-xs rounded-2xl transition shadow-md flex items-center gap-1.5 shrink-0"
            >
              Subscribe <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand Summary */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-700 flex items-center justify-center shadow-md shadow-brand-600/30">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight">New Meera <span className="text-brand-500">Chemist</span></span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            India&apos;s trusted licensed online pharmacy and chemist. Delivering 100% authentic prescription medicines, wellness products, and healthcare essentials to your doorstep.
          </p>
          <div className="text-xs text-slate-400 space-y-1">
            <p><strong>License No:</strong> DL-2026-NMC-8923</p>
            <p><strong>GSTIN:</strong> 07AAACN1234F1Z9</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Pharmacy & Products</h3>
          <ul className="space-y-2 text-xs">
            <li><Link href="/products" className="hover:text-brand-400 transition">All Medicines & Products</Link></li>
            <li><Link href="/products?category=skincare" className="hover:text-brand-400 transition">Skin & Personal Care</Link></li>
            <li><Link href="/categories/medicines" className="hover:text-brand-400 transition">Prescription Medicines</Link></li>
            <li><Link href="/categories/wellness-supplements" className="hover:text-brand-400 transition">Wellness & Multivitamins</Link></li>
            <li><Link href="/account/prescriptions" className="hover:text-brand-400 transition">Upload Prescription</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Pharmacy Helpdesk</h3>
          <ul className="space-y-2 text-xs">
            <li><span className="text-slate-400">Helpline:</span> +91 98765 43210</li>
            <li><span className="text-slate-400">Email:</span> support@meerachemist.com</li>
            <li><span className="text-slate-400">Pharmacy Hours:</span> 24 Hours / 7 Days</li>
            <li><span className="text-slate-400">Main Pharmacy Store:</span> Main Market, Healthcare Enclave, Delhi 110001</li>
          </ul>
        </div>

        {/* Pharmacy Trust Badges */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Medical Standards</h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0" />
              <span>100% Authentic Medicines</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Stethoscope className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verified Pharmacist Review</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Truck className="w-4 h-4 text-brand-400 shrink-0" />
              <span>Temperature-Controlled Express Dispatch</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Lock className="w-4 h-4 text-brand-400 shrink-0" />
              <span>DPDP Compliant Data Encryption</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} New Meera Chemist. All rights reserved.</p>
        <div className="flex gap-4">
          <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
          <span className="hover:text-slate-300 cursor-pointer">Prescription Policy</span>
        </div>
      </div>
    </footer>
  );
}
