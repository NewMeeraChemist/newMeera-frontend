'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, RotateCcw } from 'lucide-react';
import { Category, Brand, HealthConcern } from '@/types';

interface FilterSidebarProps {
  categories: Category[];
  brands: Brand[];
  concerns: HealthConcern[];
}

export function FilterSidebar({ categories, brands, concerns }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get('category') || '';
  const selectedBrand = searchParams.get('brand') || '';
  const selectedConcern = searchParams.get('concern') || '';
  const selectedRx = searchParams.get('requiresPrescription') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  const handleReset = () => {
    router.push('/products');
  };

  return (
    <aside className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-6 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-600" /> Filters
        </h3>
        <button
          onClick={handleReset}
          className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Categories Filter */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Categories</h4>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => updateFilter('category', '')}
            className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium transition ${
              !selectedCategory ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter('category', cat.slug)}
              className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition ${
                selectedCategory === cat.slug ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Health Concerns Filter */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Shop by Concern</h4>
        <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
          {concerns.map((con) => (
            <label key={con.id} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer hover:text-slate-900 py-1">
              <input
                type="checkbox"
                checked={selectedConcern === con.slug}
                onChange={(e) => updateFilter('concern', e.target.checked ? con.slug : '')}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <span>{con.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands Filter */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Brands</h4>
        <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
          {brands.map((b) => (
            <button
              key={b.id}
              onClick={() => updateFilter('brand', selectedBrand === b.slug ? '' : b.slug)}
              className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition ${
                selectedBrand === b.slug ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* Prescription Filter */}
      <div className="pt-3 border-t border-slate-100 space-y-2">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Prescription</h4>
        <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedRx === 'true'}
            onChange={(e) => updateFilter('requiresPrescription', e.target.checked ? 'true' : '')}
            className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          <span>Requires Prescription Only</span>
        </label>
      </div>

      {/* Price Range Filter */}
      <div className="pt-3 border-t border-slate-100 space-y-2">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Price Range (₹)</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
          <span className="text-slate-400 text-xs">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
        </div>
      </div>
    </aside>
  );
}
