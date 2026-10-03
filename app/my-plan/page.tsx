'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { DayOfWeek } from '@/types';
import boxesData from '@/data/boxes.json';
import sidesData from '@/data/sides.json';
import addonsData from '@/data/addons.json';
import { Box, SideBox, AddonDrink } from '@/types';
import {
  CalendarCheck,
  Lock,
  Unlock,
  Check,
  Plus,
  Leaf,
  Clock,
  ArrowRight,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

const ALL_DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function MyPlanPage() {
  const {
    selectedDays,
    dayConfigs,
    mealsPerDay,
    toggleDay,
    toggleDayEggFree,
    toggleDaySkipLegume,
    toggleDayDoubleMain,
    toggleSideForDay,
    toggleDrinkForDay,
    getDailyTotals,
    getPlanMealCount,
    getPlanTotalWeeklyPrice,
  } = useAppStore();

  const [toastMessage, setToastMessage] = useState('');

  const boxes = boxesData as Box[];
  const sides = sidesData as SideBox[];
  const addons = addonsData as AddonDrink[];

  const mealCount = getPlanMealCount();
  const weeklyPrice = getPlanTotalWeeklyPrice();

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <section className="bg-white border-b border-gray-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-primary" />
              <h1 className="font-heading font-black text-2xl text-gray-900">
                Weekly Box Schedule
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Fixed daily cook plan. Modify egg-free version, skip legume, or double main before the 9:00 PM cutoff.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-gray-400">Total Scheduled</span>
              <p className="font-heading font-black text-base text-gray-900">
                {mealCount} Boxes • {formatCurrency(weeklyPrice)}
              </p>
            </div>

            <Link
              href="/checkout"
              className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm tap-active"
            >
              Confirm / Checkout
            </Link>
          </div>
        </div>
      </section>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
          <Check className="w-4 h-4 text-lime-brand stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mon - Sat Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ALL_DAYS.map((day) => {
            const isSelected = selectedDays.includes(day);
            const box = boxes.find((b) => b.day === day) || boxes[0];
            const cfg = dayConfigs[day] || {
              day,
              boxId: box.id,
              boxCount: mealsPerDay,
              isEggFree: false,
              skipLegume: false,
              doubleMain: false,
              selectedSides: [],
              selectedDrinks: [],
            };
            const totals = getDailyTotals(day);

            return (
              <div
                key={day}
                className={cn(
                  "bg-white rounded-3xl p-5 border transition-all duration-200 shadow-card flex flex-col justify-between",
                  !isSelected ? "opacity-60 bg-gray-50 border-gray-200" : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div>
                  {/* Day Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-black text-lg text-gray-900">{day}</span>
                        <span className={cn(
                          "text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase",
                          box.isVeg ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                        )}>
                          {box.isVeg ? 'Veg' : 'Non-Veg'}
                        </span>
                      </div>
                      {isSelected && (
                        <p className="text-[11px] font-bold text-emerald-700">
                          {totals.protein}g Protein • {totals.calories} kcal
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => toggleDay(day)}
                      className="text-[11px] font-bold text-gray-500 hover:text-gray-900 px-2.5 py-1 rounded-lg hover:bg-gray-100 border border-gray-200"
                    >
                      {isSelected ? "Skip Day" : "Include"}
                    </button>
                  </div>

                  {!isSelected ? (
                    <div className="py-12 text-center text-xs text-gray-400 italic">
                      This day is skipped. No box cooked or billed.
                    </div>
                  ) : (
                    <div className="space-y-4 mt-4">
                      {/* Box Card Info */}
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border">
                          <Image
                            src={box.image}
                            alt={box.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-heading font-bold text-sm text-gray-900 truncate">
                            {box.name}
                          </h4>
                          <p className="text-[11px] text-gray-500 truncate">
                            {box.items[0]?.name}
                          </p>
                          <span className="text-[10px] font-semibold text-primary">
                            {cfg.boxCount} box{cfg.boxCount > 1 ? 'es' : ''} • {formatCurrency(box.price * cfg.boxCount)}
                          </span>
                        </div>
                      </div>

                      {/* Box-level customization toggles */}
                      <div className="space-y-1.5 text-xs pt-2 border-t border-gray-100">
                        {/* Egg-free toggle */}
                        <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl bg-gray-50 hover:bg-gray-100/80">
                          <span className="text-[11px] font-bold text-gray-800">Egg-Free Version (+Legumes)</span>
                          <input
                            type="checkbox"
                            checked={cfg.isEggFree}
                            onChange={() => {
                              toggleDayEggFree(day);
                              triggerToast(`${day}: Egg-free version updated`);
                            }}
                            className="accent-primary"
                          />
                        </label>

                        {/* Skip legume toggle */}
                        <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl bg-gray-50 hover:bg-gray-100/80">
                          <span className="text-[11px] font-bold text-gray-800">Skip Legume Portion</span>
                          <input
                            type="checkbox"
                            checked={cfg.skipLegume}
                            onChange={() => {
                              toggleDaySkipLegume(day);
                              triggerToast(`${day}: Legume preference updated`);
                            }}
                            className="accent-primary"
                          />
                        </label>

                        {/* Double main toggle */}
                        <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl bg-gray-50 hover:bg-gray-100/80">
                          <span className="text-[11px] font-bold text-gray-800">Double Main (+₹80)</span>
                          <input
                            type="checkbox"
                            checked={cfg.doubleMain}
                            onChange={() => {
                              toggleDayDoubleMain(day);
                              triggerToast(`${day}: Double main protein updated`);
                            }}
                            className="accent-primary"
                          />
                        </label>
                      </div>

                      {/* Sides or drinks added */}
                      {cfg.selectedSides.length > 0 && (
                        <div className="text-[10px] text-gray-500 pt-1">
                          <strong>Sides:</strong> {cfg.selectedSides.map((sId) => sides.find((s) => s.id === sId)?.name).filter(Boolean).join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {isSelected && (
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                    <span>Cutoff: 9:00 PM previous night</span>
                    <Link href={`/box/${box.slug}`} className="font-bold text-primary hover:underline">
                      Box Details →
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
