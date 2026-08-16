import React, { Suspense } from 'react';
import Link from 'next/link';
import { FilterSidebar } from '../../components/product/FilterSidebar';
import { ProductCard } from '../../components/product/ProductCard';
import { api } from '../../lib/api';

export const revalidate = 5;

interface ProductsPageProps {
  searchParams: {
    category?: string;
    brand?: string;
    concern?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    requiresPrescription?: string;
    sortBy?: string;
    page?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const [productsData, categories, brands, concerns] = await Promise.all([
    api.getProducts(searchParams as Record<string, string>),
    api.getCategories(),
    api.getBrands(),
    api.getConcerns(),
  ]);

  const { products, pagination } = productsData;

  return (
    <div className="space-y-6">
      {/* Header Breadcrumb & Title */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Product Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {products.length} of {pagination.total} healthcare & medicine items
          </p>
        </div>
      </div>

      {/* Main Grid with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-1">
          <Suspense fallback={<div className="bg-white rounded-2xl p-6 border border-slate-200 text-xs text-slate-400">Loading filters...</div>}>
            <FilterSidebar categories={categories} brands={brands} concerns={concerns} />
          </Suspense>
        </div>

        {/* Right Products List */}
        <div className="lg:col-span-3 space-y-6">
          {products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <p className="text-slate-500 text-sm">No products found matching your current filter criteria.</p>
              <Link href="/products" className="inline-block text-xs font-bold text-brand-600 hover:text-brand-700">
                Clear Filters & View All
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => {
                const isCurrent = p === pagination.page;
                const queryParams = new URLSearchParams(searchParams as Record<string, string>);
                queryParams.set('page', p.toString());
                return (
                  <Link
                    key={p}
                    href={`/products?${queryParams.toString()}`}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition ${
                      isCurrent
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
