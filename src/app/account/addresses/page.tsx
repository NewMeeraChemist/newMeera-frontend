'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import { Address } from '@/types';
import { api } from '../../../lib/api';

const defaultMockAddresses: Address[] = [
  {
    id: 'addr-1',
    customerId: 'cust-1',
    label: 'Home',
    line1: '123 Healthcare Enclave, Main Market',
    line2: 'Near Central Park',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'addr-2',
    customerId: 'cust-1',
    label: 'Office',
    line1: 'Suite 405, Medical Tower',
    line2: 'Connaught Place',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110002',
    isDefault: false,
    createdAt: new Date().toISOString(),
  },
];

export default function CustomerAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(defaultMockAddresses);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAddresses() {
      try {
        const data = await api.getAddresses();
        if (data && Array.isArray(data) && data.length > 0) {
          setAddresses(data);
        }
      } catch (err) {
        console.warn('Using default addresses fallback:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAddresses();
  }, []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newForm, setNewForm] = useState({
    label: 'Home',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createAddress(newForm);
      if (newForm.isDefault) {
        setAddresses((prev) =>
          prev.map((a) => ({ ...a, isDefault: false })).concat(created)
        );
      } else {
        setAddresses((prev) => [...prev, created]);
      }
    } catch {
      const newAddress: Address = {
        id: `addr-${Date.now()}`,
        customerId: 'cust-1',
        label: newForm.label,
        line1: newForm.line1,
        line2: newForm.line2,
        city: newForm.city,
        state: newForm.state,
        pincode: newForm.pincode,
        isDefault: newForm.isDefault,
        createdAt: new Date().toISOString(),
      };
      if (newForm.isDefault) {
        setAddresses((prev) =>
          prev.map((a) => ({ ...a, isDefault: false })).concat(newAddress)
        );
      } else {
        setAddresses((prev) => [...prev, newAddress]);
      }
    }

    setShowAddModal(false);
    setNewForm({ label: 'Home', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false });
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-600" /> Saved Delivery Addresses
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage delivery addresses for fast 1-click checkout</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-600/20 transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Address
        </button>
      </div>

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`bg-white rounded-2xl border p-5 space-y-3 transition ${
              addr.isDefault
                ? 'border-brand-600 shadow-md shadow-brand-600/10'
                : 'border-slate-200/80 hover:border-slate-300 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs bg-slate-100 px-2.5 py-1 rounded-lg">
                {addr.label}
              </span>
              {addr.isDefault ? (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Default Address
                </span>
              ) : (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-[11px] font-semibold text-brand-600 hover:text-brand-700"
                >
                  Set as Default
                </button>
              )}
            </div>

            <div className="text-xs text-slate-600 leading-relaxed space-y-0.5">
              <p className="font-semibold text-slate-900">{addr.line1}</p>
              {addr.line2 && <p>{addr.line2}</p>}
              <p>{addr.city}, {addr.state} - {addr.pincode}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end gap-2 text-xs">
              <button
                onClick={() => handleDeleteAddress(addr.id)}
                className="p-1.5 text-slate-400 hover:text-red-600 transition rounded-lg hover:bg-red-50"
                title="Delete address"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Add New Delivery Address</h3>

            <form onSubmit={handleCreateAddress} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Address Label</label>
                <input
                  type="text"
                  required
                  value={newForm.label}
                  onChange={(e) => setNewForm({ ...newForm, label: e.target.value })}
                  placeholder="e.g. Home, Office, Parents"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Address Line 1</label>
                <input
                  type="text"
                  required
                  value={newForm.line1}
                  onChange={(e) => setNewForm({ ...newForm, line1: e.target.value })}
                  placeholder="Flat, House no., Building"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  value={newForm.line2}
                  onChange={(e) => setNewForm({ ...newForm, line2: e.target.value })}
                  placeholder="Street, Landmark"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newForm.city}
                    onChange={(e) => setNewForm({ ...newForm, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={newForm.state}
                    onChange={(e) => setNewForm({ ...newForm, state: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pincode</label>
                <input
                  type="text"
                  required
                  value={newForm.pincode}
                  onChange={(e) => setNewForm({ ...newForm, pincode: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newForm.isDefault}
                  onChange={(e) => setNewForm({ ...newForm, isDefault: e.target.checked })}
                  className="rounded border-slate-300 text-brand-600"
                />
                <span>Set as default shipping address</span>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 text-white font-bold rounded-xl shadow-md"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
