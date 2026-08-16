import React from 'react';
import Link from 'next/link';
import { api } from '../../lib/api';
import { ProductCard } from '../../components/product/ProductCard';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const queryTerm = searchParams.q || '';
  const productsData = await api.getProducts({ search: queryTerm });
  const { products } = productsData;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Search Results for: &ldquo;{queryTerm}&rdquo;
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Found {products.length} matching health & medicine products
        </p>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <p className="text-slate-500 text-sm">No products found matching &ldquo;{queryTerm}&rdquo;.</p>
          <Link href="/products" className="inline-block px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-brand-700">
            Explore All Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
