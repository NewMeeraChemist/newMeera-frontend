import React from 'react';
import { ShieldCheck, Truck, Banknote, Award } from 'lucide-react';

export function TrustBadges() {
  const badges = [
    {
      icon: ShieldCheck,
      title: '100% Genuine Products',
      description: 'Direct from authorized pharmaceutical manufacturers',
    },
    {
      icon: Truck,
      title: 'Free Express Shipping',
      description: 'On all healthcare orders above ₹500 across India',
    },
    {
      icon: Banknote,
      title: 'Cash on Delivery (COD)',
      description: 'Pay comfortably upon receiving your package',
    },
    {
      icon: Award,
      title: 'Licensed Pharmacists',
      description: 'Expert prescription review & safety guidance',
    },
  ];

  return (
    <section className="py-8 bg-white border-y border-slate-200/80 my-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {badges.map((badge, idx) => {
          const IconComponent = badge.icon;
          return (
            <div key={idx} className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                <IconComponent className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{badge.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{badge.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
