import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Sparkles, Filter } from 'lucide-react';

export function FreeFromRow() {
  const chips = [
    { label: 'High Protein (35g+)', query: 'tag=High+Protein', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { label: 'Gelatin-Free', query: 'free=Gelatin-free', color: 'bg-lime-50 text-lime-900 border-lime-200' },
    { label: 'Dairy-Free', query: 'free=Dairy-free', color: 'bg-sky-50 text-sky-800 border-sky-200' },
    { label: 'Nut-Free', query: 'free=Nut-free', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { label: 'Gluten-Free', query: 'free=Gluten-free', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
    { label: 'Egg-Free', query: 'free=Egg-free', color: 'bg-purple-50 text-purple-800 border-purple-200' },
    { label: '100% Pure Veg', query: 'type=veg', color: 'bg-green-50 text-green-800 border-green-200' },
    { label: 'Non-Veg Clean Cuts', query: 'type=non-veg', color: 'bg-rose-50 text-rose-800 border-rose-200' },
  ];

  return (
    <section className="py-8 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-3">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
          <h3 className="font-heading font-bold text-sm sm:text-base text-gray-900">
            Filtered for your dietary safety and cultural choices:
          </h3>
        </div>

        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2 pt-1">
          {chips.map((chip) => (
            <Link
              key={chip.label}
              href={`/menu?${chip.query}`}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-transform hover:scale-105 active:scale-95 shadow-sm tap-active ${chip.color}`}
            >
              <span>{chip.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
