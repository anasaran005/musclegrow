'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SideBox } from '@/types';
import { Plus } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

interface CurvedSideCardProps {
  side: SideBox;
}

export function CurvedSideCard({ side }: CurvedSideCardProps) {
  const CARD_BG = '#ffffff';

  return (
    <div className="rounded-[32px] p-4 sm:p-5 flex flex-col justify-between group relative overflow-hidden transition-all duration-300 bg-white border border-gray-200/90 hover:border-gray-300 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)]">
      <div>
        {/* Top Image Container with 21st.dev Style Inverted Curved Corner Cutout */}
        <div className="relative aspect-[16/11] w-full rounded-[24px] overflow-hidden bg-gray-100">
          <Image
            src={side.image}
            alt={side.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

          {/* Top-Right Badge */}
          <div className="absolute top-3.5 right-3.5 z-20 bg-black/65 backdrop-blur-md text-white text-xs font-extrabold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-md">
            <span className="text-lime-brand font-black">+{side.protein}g Protein</span>
            <span className="text-white/40">•</span>
            <span className="text-white font-bold">{formatCurrency(side.price)}</span>
          </div>

          {/* Signature Inverted Curved Cutout (Bottom-Right Scoop Nook) in Pure White */}
          <div
            className="absolute bottom-0 right-0 z-20 w-[68px] h-[68px] rounded-tl-[24px] flex items-center justify-center pointer-events-auto"
            style={{ backgroundColor: CARD_BG }}
          >
            {/* Top concave curved connector */}
            <svg
              className="absolute right-0 pointer-events-none"
              style={{ bottom: '67px', width: '22px', height: '22px', color: CARD_BG }}
              viewBox="0 0 22 22"
              fill="currentColor"
            >
              <path d="M22 0 C22 12.15 12.15 22 0 22 H22 V0 Z" />
            </svg>

            {/* Left concave curved connector */}
            <svg
              className="absolute bottom-0 pointer-events-none"
              style={{ right: '67px', width: '22px', height: '22px', color: CARD_BG }}
              viewBox="0 0 22 22"
              fill="currentColor"
            >
              <path d="M0 22 C12.15 22 22 12.15 22 0 V22 H0 Z" />
            </svg>

            {/* Circular Add Action Button */}
            <Link
              href={`/build-plan?addSide=${side.id}`}
              className="w-11 h-11 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-primary hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 shadow-md group/btn"
              aria-label={`Add ${side.name} to plan`}
            >
              <Plus className="w-5 h-5 group-hover/btn:rotate-90 transition-transform stroke-[2.5]" />
            </Link>
          </div>
        </div>

        {/* Content Section */}
        <div className="pt-4">
          <h3 className="font-heading font-black text-lg sm:text-xl text-gray-900 group-hover:text-primary transition-colors tracking-tight line-clamp-1">
            {side.name}
          </h3>

          <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
            {side.description}
          </p>

          {/* Tag Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3.5">
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md">
              +{side.protein}G PROTEIN
            </span>
            <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md">
              {side.calories} KCAL
            </span>
            <span
              className={cn(
                "text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md border",
                side.isVeg
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-rose-50 text-rose-700 border-rose-200"
              )}
            >
              {side.isVeg ? 'VEG' : 'NON-VEG'}
            </span>
            <span className="bg-gray-100 text-gray-700 border border-gray-200 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md">
              {side.tags[0] || 'EXTRA SIDE'}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer: Price & Direct Add Action */}
      <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">
            Side Box Price
          </span>
          <span className="font-heading font-black text-lg sm:text-xl text-gray-900">
            {formatCurrency(side.price)}
          </span>
        </div>

        <Link
          href={`/build-plan?addSide=${side.id}`}
          className="bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md hover:scale-105 transition-all tap-active flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add To Plan</span>
        </Link>
      </div>
    </div>
  );
}
