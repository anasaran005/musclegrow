'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box } from '@/types';
import { DailyMenuResult, DietType } from '@/lib/menu-engine';
import { ArrowUpRight, ArrowRight, ChevronDown } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

export interface CurvedBoxCardProps {
  menu?: DailyMenuResult;
  dayInfo?: {
    date: Date;
    dateStr: string;
    dayOfWeek: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
    dayName: string;
    formatted: string;
  };
  diet?: DietType;
  isToday?: boolean;
  box?: Box; // Backwards-compatibility fallback
}

export function CurvedBoxCard({
  menu,
  dayInfo,
  diet = 'non-veg',
  isToday = false,
  box,
}: CurvedBoxCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const CARD_BG = '#ffffff';

  // 1. If dynamic menu is provided (5-item rotation engine)
  if (menu) {
    const meal = menu.lunch;
    const mainItem = meal.items.main;
    const dayOfWeekAbbr = dayInfo ? dayInfo.dayOfWeek : menu.dayOfWeek;
    const price = diet === 'veg' ? 279 : 299;
    const weeklyPrice = diet === 'veg' ? 259 : 279;
    const orderUrl = `/tomorrow?date=${dayInfo?.dateStr || menu.date}&diet=${diet}`;

    return (
      <div
        className={cn(
          "rounded-[32px] p-4 sm:p-5 flex flex-col justify-between group relative overflow-hidden transition-all duration-300",
          "bg-white border",
          isToday
            ? "border-primary ring-2 ring-primary/20 shadow-[0_10px_30px_rgba(20,83,45,0.12)] md:-translate-y-1"
            : "border-gray-200/90 hover:border-gray-300 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)]"
        )}
      >
        <div>
          {/* Top Image Container with 21st.dev Style Inverted Curved Corner Cutout */}
          <div className="relative aspect-[16/11] w-full rounded-[24px] overflow-hidden bg-gray-100">
            <Image
              src={mainItem.image}
              alt={mainItem.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />

            {/* Subtle gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />

            {/* Signature Inverted Curved Cutout (Bottom-Right Scoop Nook) in Pure White */}
            <div
              className="absolute bottom-0 right-0 z-20 w-[72px] h-[72px] rounded-tl-[24px] flex items-center justify-center pointer-events-auto"
              style={{ backgroundColor: CARD_BG }}
            >
              {/* Top concave curved connector */}
              <svg
                className="absolute right-0 pointer-events-none"
                style={{ bottom: '71px', width: '24px', height: '24px', color: CARD_BG }}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M24 0 C24 13.2548 13.2548 24 0 24 H24 V0 Z" />
              </svg>

              {/* Left concave curved connector */}
              <svg
                className="absolute bottom-0 pointer-events-none"
                style={{ right: '71px', width: '24px', height: '24px', color: CARD_BG }}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M0 24 C13.2548 24 24 13.2548 24 0 V24 H0 Z" />
              </svg>

              {/* Circular Arrow Button */}
              <Link
                href={orderUrl}
                className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-primary hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 shadow-md group/btn"
                aria-label={`View ${mainItem.name} breakdown`}
              >
                <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform stroke-[2.5]" />
              </Link>
            </div>
          </div>

          {/* Content Section */}
          <div className="pt-4">
            {/* Title with Indian FSSAI symbol: Green Dot for Veg, Red Triangle for Non-Veg */}
            <div className="flex items-start gap-2.5">
              {diet === 'veg' ? (
                /* FSSAI Green Dot inside square */
                <span
                  className="w-4 h-4 mt-1 rounded-[4px] border-[1.5px] border-emerald-600 bg-white flex items-center justify-center shrink-0 shadow-2xs"
                  title="Vegetarian"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                </span>
              ) : (
                /* FSSAI Red Triangle inside square */
                <span
                  className="w-4 h-4 mt-1 rounded-[4px] border-[1.5px] border-red-700 bg-white flex items-center justify-center shrink-0 shadow-2xs"
                  title="Non-Vegetarian"
                >
                  <span className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[6px] border-b-red-700" />
                </span>
              )}

              <Link href={orderUrl} className="block group/title flex-1 min-w-0">
                <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 group-hover/title:text-primary transition-colors tracking-tight line-clamp-1">
                  {mainItem.name}
                </h3>
              </Link>
            </div>

            <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
              {mainItem.description}
            </p>

            {/* Measured Nutrition Macro Boxes: KCAL, PROTEIN, FAT, CARBS (Fixed rounded decimals) */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mt-3.5 p-2 rounded-2xl bg-gray-50 border border-gray-100 text-center">
              {/* KCAL */}
              <div className="p-1.5 bg-white rounded-xl shadow-2xs border border-gray-100/80 flex flex-col items-center justify-center">
                <span className="text-[9px] font-black uppercase text-amber-700 tracking-wider block">KCAL</span>
                <span className="font-heading font-black text-xs text-gray-900 mt-0.5 leading-none">
                  ~{Math.round(meal.totals.calories)}
                </span>
              </div>

              {/* PROTEIN */}
              <div className="p-1.5 bg-white rounded-xl shadow-2xs border border-emerald-200/80 ring-1 ring-emerald-500/10 flex flex-col items-center justify-center">
                <span className="text-[9px] font-black uppercase text-emerald-700 tracking-wider block">PROTEIN</span>
                <span className="font-heading font-black text-xs text-emerald-700 mt-0.5 leading-none">
                  ~{Math.round(meal.totals.protein)}g
                </span>
              </div>

              {/* FAT */}
              <div className="p-1.5 bg-white rounded-xl shadow-2xs border border-purple-200/80 ring-1 ring-purple-500/10 flex flex-col items-center justify-center">
                <span className="text-[9px] font-black uppercase text-purple-700 tracking-wider block">FAT</span>
                <span className="font-heading font-black text-xs text-gray-900 mt-0.5 leading-none">
                  {Math.round(meal.totals.fat)}g
                </span>
              </div>

              {/* CARBS */}
              <div className="p-1.5 bg-white rounded-xl shadow-2xs border border-orange-200/80 ring-1 ring-orange-500/10 flex flex-col items-center justify-center">
                <span className="text-[9px] font-black uppercase text-orange-700 tracking-wider block">CARBS</span>
                <span className="font-heading font-black text-xs text-gray-900 mt-0.5 leading-none">
                  {Math.round(meal.totals.carbs)}g
                </span>
              </div>
            </div>

            {/* Collapsible 5-Item Signature Box Breakdown */}
            {showDetails && (
              <div className="mt-3 p-3 rounded-2xl bg-gray-50/90 border border-gray-100 space-y-1.5 text-xs animate-in fade-in duration-200">
                <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">
                  5 Items Digitally Weighed Inside
                </p>

                {/* 1. Main */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800 flex items-center gap-1.5 truncate pr-2">
                    <span className="text-sm shrink-0">
                      {diet === 'non-veg' ? (dayOfWeekAbbr === 'Wed' ? '🐟' : '🍗') : '🧀'}
                    </span>
                    <span className="truncate">{mainItem.name}</span>
                  </span>
                  <span className="shrink-0 text-[10px] font-extrabold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                    {mainItem.grams}g
                  </span>
                </div>

                {/* 2. Protein Booster */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700 flex items-center gap-1.5 truncate pr-2">
                    <span className="text-sm shrink-0">{diet === 'non-veg' ? '🥚' : '🌱'}</span>
                    <span className="truncate">{meal.items.proteinSide.name}</span>
                  </span>
                  <span className="shrink-0 text-[10px] font-semibold text-gray-500 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                    {meal.items.proteinSide.grams}g
                  </span>
                </div>

                {/* 3. Rotational Salad */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700 flex items-center gap-1.5 truncate pr-2">
                    <span className="text-sm shrink-0">🥗</span>
                    <span className="truncate">{meal.items.salad.name}</span>
                  </span>
                  <span className="shrink-0 text-[10px] font-semibold text-gray-500 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                    {meal.items.salad.grams}g
                  </span>
                </div>

                {/* 4. Rotational Legume */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700 flex items-center gap-1.5 truncate pr-2">
                    <span className="text-sm shrink-0">🫘</span>
                    <span className="truncate">{meal.items.legume.name}</span>
                  </span>
                  <span className="shrink-0 text-[10px] font-semibold text-gray-500 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                    {meal.items.legume.grams}g
                  </span>
                </div>

                {/* 5. Rotational Carb */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700 flex items-center gap-1.5 truncate pr-2">
                    <span className="text-sm shrink-0">🌾</span>
                    <span className="truncate">{meal.items.carb.name}</span>
                  </span>
                  <span className="shrink-0 text-[10px] font-semibold text-gray-500 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                    {meal.items.carb.grams}g
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card Footer: Price & Direct Choose Action */}
        <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">
              Daily Box Price
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-heading font-black text-xl sm:text-2xl text-gray-900">
                ₹{price}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold">
                (₹{weeklyPrice} in plan)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="py-2 px-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all tap-active flex items-center gap-1"
            >
              <span>{showDetails ? 'Hide' : 'Details'}</span>
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", showDetails && "rotate-180")} />
            </button>
            <Link
              href={orderUrl}
              className="bg-cta hover:bg-cta-hover text-white text-xs font-bold py-2 px-3 rounded-xl shadow-cta/25 hover:shadow-md transition-all tap-active flex items-center gap-1"
            >
              <span>Order</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Legacy fallback if box is passed
  if (!box) return null;

  return (
    <div
      className={cn(
        "rounded-[32px] p-4 sm:p-5 flex flex-col justify-between group relative overflow-hidden transition-all duration-300",
        "bg-white border",
        isToday
          ? "border-primary ring-2 ring-primary/20 shadow-[0_10px_30px_rgba(20,83,45,0.12)] md:-translate-y-1"
          : "border-gray-200/90 hover:border-gray-300 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)]"
      )}
    >
      <div>
        <div className="relative aspect-[16/11] w-full rounded-[24px] overflow-hidden bg-gray-100">
          <Image
            src={box.image}
            alt={box.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

          <div
            className="absolute bottom-0 right-0 z-20 w-[72px] h-[72px] rounded-tl-[24px] flex items-center justify-center pointer-events-auto"
            style={{ backgroundColor: CARD_BG }}
          >
            <svg
              className="absolute right-0 pointer-events-none"
              style={{ bottom: '71px', width: '24px', height: '24px', color: CARD_BG }}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M24 0 C24 13.2548 13.2548 24 0 24 H24 V0 Z" />
            </svg>
            <svg
              className="absolute bottom-0 pointer-events-none"
              style={{ right: '71px', width: '24px', height: '24px', color: CARD_BG }}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M0 24 C13.2548 24 24 13.2548 24 0 V24 H0 Z" />
            </svg>

            <Link
              href="/tomorrow"
              className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-primary hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 shadow-md group/btn"
              aria-label={`View ${box.name} breakdown`}
            >
              <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform stroke-[2.5]" />
            </Link>
          </div>
        </div>

        <div className="pt-4">
          <Link href="/tomorrow" className="block group/title">
            <h3 className="font-heading font-black text-xl sm:text-2xl text-gray-900 group-hover/title:text-primary transition-colors tracking-tight line-clamp-1">
              {box.name}
            </h3>
          </Link>

          <p className="text-xs sm:text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
            {box.description}
          </p>

          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mt-4 p-2 sm:p-2.5 rounded-2xl bg-gray-50 border border-gray-100 text-center">
            <div className="p-1.5 sm:p-2 bg-white rounded-xl shadow-2xs border border-gray-100/80 flex flex-col items-center justify-center">
              <span className="text-[9px] font-black uppercase text-amber-700 tracking-wider block">KCAL</span>
              <span className="font-heading font-black text-xs sm:text-sm text-gray-900 mt-0.5 leading-none">
                ~{Math.round(box.totals.calories)}
              </span>
            </div>
            <div className="p-1.5 sm:p-2 bg-white rounded-xl shadow-2xs border border-emerald-200/80 ring-1 ring-emerald-500/10 flex flex-col items-center justify-center">
              <span className="text-[9px] font-black uppercase text-emerald-700 tracking-wider block">PROTEIN</span>
              <span className="font-heading font-black text-xs sm:text-sm text-emerald-700 mt-0.5 leading-none">
                ~{Math.round(box.totals.protein)}g
              </span>
            </div>
            <div className="p-1.5 sm:p-2 bg-white rounded-xl shadow-2xs border border-purple-200/80 ring-1 ring-purple-500/10 flex flex-col items-center justify-center">
              <span className="text-[9px] font-black uppercase text-purple-700 tracking-wider block">FAT</span>
              <span className="font-heading font-black text-xs sm:text-sm text-gray-900 mt-0.5 leading-none">
                {Math.round(box.totals.fat)}g
              </span>
            </div>
            <div className="p-1.5 sm:p-2 bg-white rounded-xl shadow-2xs border border-orange-200/80 ring-1 ring-orange-500/10 flex flex-col items-center justify-center">
              <span className="text-[9px] font-black uppercase text-orange-700 tracking-wider block">CARBS</span>
              <span className="font-heading font-black text-xs sm:text-sm text-gray-900 mt-0.5 leading-none">
                {Math.round(box.totals.carbs)}g
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">
            Daily Box Price
          </span>
          <span className="font-heading font-black text-xl sm:text-2xl text-gray-900">
            {formatCurrency(box.price)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/tomorrow"
            className="py-2.5 px-3.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all tap-active"
          >
            Details
          </Link>
          <Link
            href="/tomorrow"
            className="bg-cta hover:bg-cta-hover text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-cta/25 hover:shadow-md hover:scale-105 transition-all tap-active flex items-center gap-1.5"
          >
            <span>Order Trial</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
