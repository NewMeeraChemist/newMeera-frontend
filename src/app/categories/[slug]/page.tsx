import React, { Suspense } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { api } from '../../../lib/api';
import { ProductCard } from '../../../components/product/ProductCard';
import { FilterSidebar } from '../../../components/product/FilterSidebar';

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: Record<string, string>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = await api.getCategoryBySlug(params.slug);
  const productsData = await api.getProducts({ ...searchParams, category: params.slug });
  const [categories, brands, concerns] = await Promise.all([
    api.getCategories(),
    api.getBrands(),
    api.getConcerns(),
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{category.name}</h1>
        <p className="text-xs text-slate-500 mt-1">
          Explore healthcare products under category &ldquo;{category.name}&rdquo; ({productsData.products.length} items found)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Suspense fallback={<div className="bg-white rounded-2xl p-6 border border-slate-200 text-xs text-slate-400">Loading filters...</div>}>
            <FilterSidebar categories={categories} brands={brands} concerns={concerns} />
          </Suspense>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {productsData.products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <p className="text-slate-500 text-sm">No products found in this category.</p>
              <Link href="/products" className="text-xs font-bold text-brand-600 hover:text-brand-700">
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {productsData.products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
