import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, ShieldCheck, FileText, Sparkles, Phone, Video, CheckCircle2, Ticket, Pill } from 'lucide-react';
import { api } from '../lib/api';
import { ProductCard } from '../components/product/ProductCard';

export const revalidate = 5;

export default async function HomePage() {
  const [productsData, categories, brands, concerns] = await Promise.all([
    api.getProducts({ pageSize: '8' }),
    api.getCategories(),
    api.getBrands(),
    api.getConcerns(),
  ]);

  const featuredProducts = productsData.products;

  // New Meera Chemist Exact 8 Shop by Category Items (from User Screenshot 2)
  const shopByCategories = [
    {
      name: 'Facewash',
      slug: 'facewash',
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&auto=format&fit=crop&q=80',
      bgColor: 'bg-emerald-50/50',
    },
    {
      name: 'Serum',
      slug: 'serum',
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&auto=format&fit=crop&q=80',
      bgColor: 'bg-purple-50/50',
    },
    {
      name: 'Moisturiser',
      slug: 'moisturiser',
      imageUrl: 'https://images.unsplash.com/photo-1608248597261-e4d344716186?w=300&auto=format&fit=crop&q=80',
      bgColor: 'bg-blue-50/50',
    },
    {
      name: 'Sunscreen',
      slug: 'sunscreen',
      imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=300&auto=format&fit=crop&q=80',
      bgColor: 'bg-amber-50/50',
    },
    {
      name: 'Luxe',
      slug: 'luxe',
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=80',
      bgColor: 'bg-amber-100/40',
    },
    {
      name: 'Hair Care',
      slug: 'hair-care',
      imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300&auto=format&fit=crop&q=80',
      bgColor: 'bg-teal-50/50',
    },
    {
      name: 'Supplements',
      slug: 'supplements',
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80',
      bgColor: 'bg-indigo-50/50',
    },
    {
      name: 'Medical Devices',
      slug: 'medical-devices',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&auto=format&fit=crop&q=80',
      bgColor: 'bg-purple-100/60',
    },
  ];

  return (
    <div className="space-y-12 pb-16 font-sans">
      {/* New Meera Chemist Hero Banner (Exact match to User Screenshot 1) */}
      <section className="relative rounded-3xl bg-gradient-to-r from-[#f5e8ff] via-[#fce8f3] to-[#ebd4ff] p-8 md:p-14 overflow-hidden border border-purple-200/60 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline & CTA */}
          <div className="lg:col-span-6 space-y-6 z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#6b21a8] text-white flex items-center justify-center font-bold text-lg shadow-md shadow-purple-600/30">
                C
              </div>
              <span className="text-xl font-black text-[#4c1d95] tracking-tight font-serif">
                New Meera Chemist
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#4c1d95] tracking-tight leading-[1.1]">
              Be the first to try the New Meera Chemist.
            </h1>

            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#6b21a8] hover:bg-[#581c87] text-white font-extrabold text-sm rounded-full shadow-lg shadow-purple-700/25 hover:scale-105 transition-all duration-300 active:scale-95"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </div>
          </div>

          {/* Right Column: Pharmacy & Offer Badge (Exact Screenshot 1 layout) */}
          <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end gap-4">
            {/* Center Pharmacy Image Showcase */}
            <div className="relative w-64 md:w-80 h-72 md:h-96 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-white shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&auto=format&fit=crop&q=80"
                alt="New Meera Chemist Pharmacy"
                fill
                priority
                className="object-cover object-top"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md p-2.5 rounded-2xl border border-slate-100 text-center shadow-md">
                <span className="text-[10px] font-extrabold text-purple-900 uppercase tracking-wider block">
                  LICENSED ONLINE PHARMACY
                </span>
                <span className="text-xs font-bold text-slate-800">100% Genuine Medicines</span>
              </div>
            </div>

            {/* 40% OFF Stamp / Coupon Badge (Matching Screenshot 1) */}
            <div className="hidden sm:flex flex-col justify-between w-48 h-64 bg-white/90 backdrop-blur-md rounded-2xl p-4 border-2 border-dashed border-purple-300 shadow-xl relative z-10">
              <div>
                <span className="text-[10px] font-black text-purple-700 uppercase tracking-widest block mb-1">
                  LIMITED OFFER
                </span>
                <h2 className="text-xl font-black text-purple-950 leading-tight">
                  SHOP & GET UPTO <span className="text-purple-700 block text-2xl">40% OFF</span>
                </h2>
              </div>

              <div className="pt-3 border-t border-purple-100">
                <div className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">
                  BACKED BY SCIENCE,
                </div>
                <div className="text-[9px] font-extrabold text-purple-900 uppercase tracking-wider">
                  NOT HYPE
                </div>
                {/* Simulated Barcode */}
                <div className="h-6 w-full bg-slate-900/10 rounded mt-2 flex items-center justify-between px-1">
                  <div className="w-1 h-4 bg-slate-800"></div>
                  <div className="w-0.5 h-4 bg-slate-800"></div>
                  <div className="w-1.5 h-4 bg-slate-800"></div>
                  <div className="w-0.5 h-4 bg-slate-800"></div>
                  <div className="w-1 h-4 bg-slate-800"></div>
                  <div className="w-2 h-4 bg-slate-800"></div>
                  <div className="w-0.5 h-4 bg-slate-800"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category (Exact Match to User Screenshot 2) */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Shop by Category</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {shopByCategories.map((item) => (
            <Link
              key={item.name}
              href={`/products?category=${item.slug}`}
              className="group flex flex-col items-center text-center"
            >
              <div
                className={`w-full aspect-square rounded-2xl ${item.bgColor} border border-slate-200/60 flex items-center justify-center p-3 transition-all duration-300 group-hover:shadow-md group-hover:scale-105 relative overflow-hidden`}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={120}
                  height={120}
                  className="object-contain max-h-24 transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span className="text-xs font-bold text-slate-800 mt-2.5 group-hover:text-[#6b21a8] transition">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Sellers Section (Exact Match to User Screenshot 2) */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Top Sellers</h2>
          <Link
            href="/products"
            className="text-xs font-extrabold text-[#6b21a8] hover:text-[#581c87] flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Express Medicine Delivery Action Banner */}
      <section className="bg-gradient-to-r from-[#4c1d95] via-[#581c87] to-[#6b21a8] text-white rounded-3xl p-8 md:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-purple-200 text-xs font-bold border border-white/20">
            <Pill className="w-3.5 h-3.5 text-amber-300" />
            <span>Fast Express Delivery</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Genuine Medicines & Healthcare Essentials
          </h2>
          <p className="text-xs md:text-sm text-purple-200 max-w-xl">
            Order prescription medicines, wellness supplements, personal care & medical equipment delivered quickly and safely to your doorstep.
          </p>
        </div>

        <Link
          href="/products"
          className="px-7 py-4 bg-white hover:bg-purple-50 text-[#4c1d95] font-black text-xs rounded-full shadow-lg hover:scale-105 transition flex items-center gap-2 shrink-0"
        >
          <span>EXPLORE PRODUCTS</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Prescription Upload Banner */}
      <section className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-purple-700 font-extrabold text-xs">
            <FileText className="w-4 h-4" />
            <span>Licensed Digital Pharmacy</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">Have a Doctor&apos;s Prescription?</h3>
          <p className="text-xs text-slate-500 max-w-xl">
            Upload your prescription photo. Our registered pharmacists will verify your medicine dosage, apply discounts, and dispatch your order in temperature-controlled packaging.
          </p>
        </div>

        <Link
          href="/account/prescriptions"
          className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 shrink-0"
        >
          <FileText className="w-4 h-4 text-purple-400" />
          <span>Upload Prescription</span>
        </Link>
      </section>
    </div>
  );
}
