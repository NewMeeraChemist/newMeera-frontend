'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Star, FileText, Check, ShieldCheck } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '../../store/useCartStore';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = React.useState(false);

  const discountPercentage = Math.round(
    ((product.mrp - product.salePrice) / product.mrp) * 100
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      <div>
        {/* New Meera Chemist Tag Badges */}
        <div className="flex items-center justify-between gap-1 mb-2.5">
          {discountPercentage > 0 ? (
            <span className="bg-purple-100/80 text-purple-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-purple-200 shadow-sm">
              {discountPercentage}% OFF
            </span>
          ) : (
            <span className="bg-emerald-50 text-emerald-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Doctor&apos;s Choice
            </span>
          )}

          {product.requiresPrescription && (
            <span className="bg-amber-50 text-amber-800 font-bold text-[10px] px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
              <FileText className="w-3 h-3 text-amber-600" /> Rx
            </span>
          )}
        </div>

        {/* Product Image Cutout */}
        <Link href={`/products/${product.slug}`} className="block relative w-full h-44 mb-3 overflow-hidden rounded-xl bg-slate-50 border border-slate-100">
          <Image
            src={product.thumbnailUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-3 group-hover:scale-105 transition duration-300"
          />
        </Link>

        {/* Product Title */}
        <Link href={`/products/${product.slug}`} className="block group-hover:text-[#6b21a8] transition">
          <h3 className="text-xs font-bold text-slate-900 line-clamp-2 mb-1.5 leading-snug tracking-tight">
            {product.name}
          </h3>
        </Link>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 text-amber-400 text-xs mb-3">
          <div className="flex items-center gap-0.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <Star className="w-3.5 h-3.5 fill-amber-400/30 text-amber-400" />
          </div>
          <span className="text-slate-700 font-extrabold text-[11px] ml-0.5">4.8</span>
          <span className="text-slate-400 text-[10px]">(24)</span>
        </div>
      </div>

      {/* Price & Add to Cart Button */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold text-slate-900">
              ₹{product.salePrice}
            </span>
            {product.mrp > product.salePrice && (
              <span className="text-xs text-slate-400 line-through font-medium">
                ₹{product.mrp}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 block font-medium">Incl. all taxes</span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stockQty <= 0}
          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all duration-200 shadow-sm ${added
              ? 'bg-emerald-600 text-white shadow-emerald-600/20'
              : product.stockQty <= 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-[#6b21a8] hover:bg-[#581c87] text-white active:scale-95 shadow-purple-600/20'
            }`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" /> Added
            </>
          ) : product.stockQty <= 0 ? (
            'Out of Stock'
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" /> Add
            </>
          )}
        </button>
      </div>
    </div>
  );
}
