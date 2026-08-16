import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShieldCheck, FileText, Truck, AlertCircle, ArrowLeft } from 'lucide-react';
import { api } from '../../../lib/api';
import { ProductCard } from '../../../components/product/ProductCard';
import ProductDetailActions from './ProductDetailActions';

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const detailData = await api.getProductBySlug(params.slug);
  const { product, images, reviews, ratingSummary, relatedProducts } = detailData;

  const discountPercentage = Math.round(
    ((product.mrp - product.salePrice) / product.mrp) * 100
  );

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <Link href="/products" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition">
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Link>

      {/* Main Product Card Detail */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative w-full h-80 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden">
            <Image
              src={images[0]?.imageUrl || product.thumbnailUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80'}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-4"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img) => (
                <div key={img.id} className="relative w-16 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                  <Image src={img.imageUrl} alt="Product view" fill className="object-contain p-1" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Title, Price & Actions */}
        <div className="space-y-5">
          {product.requiresPrescription && (
            <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200">
              <FileText className="w-4 h-4 text-amber-600" /> Prescription Required for Checkout
            </div>
          )}

          <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(ratingSummary.averageRating) ? 'fill-amber-400' : 'text-slate-200'}`} />
              ))}
            </div>
            <span className="font-bold text-slate-900">{ratingSummary.averageRating}</span>
            <span className="text-slate-400">({ratingSummary.totalReviews} customer reviews)</span>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-slate-900">₹{product.salePrice}</span>
            {product.mrp > product.salePrice && (
              <>
                <span className="text-base text-slate-400 line-through">₹{product.mrp}</span>
                <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-0.5 rounded-full">
                  Save {discountPercentage}%
                </span>
              </>
            )}
          </div>

          {/* Stock Status */}
          <div className="text-xs flex items-center gap-2">
            <span className="font-semibold text-slate-700">Availability:</span>
            {product.stockQty > 0 ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> In Stock ({product.stockQty} available)
              </span>
            ) : (
              <span className="text-red-500 font-bold flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> Currently Out of Stock
              </span>
            )}
          </div>

          {/* Client Interactive Add to Cart & Quantity Selector Component */}
          <ProductDetailActions product={product} />

          {/* Features / Shipping Guarantee */}
          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-600" />
              <span>Standard 24-48 Hour Home Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <span>100% Genuine Pharmacy Sourced</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Usage */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Product Overview & Uses</h2>
        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {product.description || 'No detailed description provided for this product.'}
        </p>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900">Customer Ratings & Reviews</h2>
          <div className="text-xs font-semibold text-brand-600">
            {ratingSummary.totalReviews} Total Reviews
          </div>
        </div>

        {reviews.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No reviews written for this product yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-amber-400' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <span className="text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-slate-700">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Related Health Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
