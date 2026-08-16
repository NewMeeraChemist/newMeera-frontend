'use client';

import React, { useState } from 'react';
import { ShoppingCart, Check, Plus, Minus } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '../../../store/useCartStore';

interface ProductDetailActionsProps {
  product: Product;
}

export default function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center gap-4">
        {/* Quantity Controls */}
        <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center text-sm font-bold text-slate-900">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(product.stockQty, q + 1))}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Add to Cart CTA */}
        <button
          onClick={handleAddToCart}
          disabled={product.stockQty <= 0}
          className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-md ${
            added
              ? 'bg-emerald-600 text-white shadow-emerald-600/20'
              : product.stockQty <= 0
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/20 active:scale-95'
          }`}
        >
          {added ? (
            <>
              <Check className="w-5 h-5" /> Added to Cart
            </>
          ) : product.stockQty <= 0 ? (
            'Out of Stock'
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" /> Add to Shopping Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
