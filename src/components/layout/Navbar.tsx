'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, Search } from 'lucide-react';

export function Navbar() {
  const router = useRouter();
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchInput(false);
    }
  };

  const navLinks = [
    { label: 'Brands', href: '/products', hasDropdown: true },
    { label: 'Skin', href: '/products?category=skincare', hasDropdown: true },
    { label: 'Hair', href: '/products?category=haircare', hasDropdown: true },
    { label: 'Supplements', href: '/categories/wellness-supplements', hasDropdown: true },
    { label: 'Pediatric', href: '/products?category=pediatric' },
    { label: 'Shop All', href: '/products' },
    { label: 'LUXE', href: '/products?category=luxe', badge: 'NEW' },
  ];

  return (
    <nav className="bg-white border-b border-slate-200/80 sticky top-0 z-40 text-sm font-semibold text-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-13">
        {/* Navigation Menu Items */}
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-none py-2 text-xs md:text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-[#6b21a8] transition whitespace-nowrap flex items-center gap-1 py-1"
            >
              <span>{link.label}</span>
              {link.hasDropdown && <ChevronDown className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />}
              {link.badge && (
                <span className="bg-[#6b21a8] text-white rounded px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ml-0.5">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Search Toggle Icon on Far Right */}
        <div className="relative shrink-0 ml-4">
          {showSearchInput ? (
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-1">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search New Meera Chemist..."
                className="w-48 md:w-64 pl-3 pr-8 py-1.5 bg-slate-50 border border-purple-300 rounded-full text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600/30"
              />
              <button
                type="button"
                onClick={() => setShowSearchInput(false)}
                className="text-xs text-slate-400 hover:text-slate-600 px-1"
              >
                ✕
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowSearchInput(true)}
              className="p-2 text-slate-700 hover:text-[#6b21a8] transition rounded-full hover:bg-slate-50"
              title="Search products"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
