'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Flame,
  Dumbbell,
  Check,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Info,
  Clock,
  Sparkles,
  Ban,
  RotateCcw,
  Drumstick,
  Leaf,
  Layers,
} from 'lucide-react';
import {
  getNextWeekOperatingDays,
  getMenuForDate,
  PRICING,
  DailyMenuResult,
  DietType,
} from '@/lib/menu-engine';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

export default function WeeklyPlanPage() {
  const router = useRouter();
  const { setWeeklyOrder } = useAppStore();

  const nextWeekDays = useMemo(() => getNextWeekOperatingDays(), []);

  // Controls
  const [mealsPerDay, setMealsPerDay] = useState<1 | 2>(1);
  const [dietVariation, setDietVariation] = useState<'non-veg' | 'veg' | 'mixed'>('non-veg');
  const [skippedDays, setSkippedDays] = useState<string[]>([]); // list of dateStr

  // Delivery slots
  const [lunchSlot, setLunchSlot] = useState('12:00 PM - 1:30 PM');
  const [dinnerSlot, setDinnerSlot] = useState('7:00 PM - 8:30 PM');

  // Toggle skip a day
  const toggleSkipDay = (dateStr: string) => {
    setSkippedDays((prev) =>
      prev.includes(dateStr) ? prev.filter((d) => d !== dateStr) : [...prev, dateStr]
    );
  };

  // Determine diet for each day based on dietVariation
  // Mixed = 4 NV + 2 Veg. Mon, Tue, Thu, Sat = Non-Veg; Wed, Fri = Veg.
  const getDayDiet = (dayOfWeek: string): DietType => {
    if (dietVariation === 'non-veg') return 'non-veg';
    if (dietVariation === 'veg') return 'veg';
    // Mixed: Mon, Tue, Thu, Sat -> Non-Veg (4); Wed, Fri -> Veg (2)
    return dayOfWeek === 'Wed' || dayOfWeek === 'Fri' ? 'veg' : 'non-veg';
  };

  // Generate menu results for the 6 operating days
  const weeklyMenus: Array<{
    date: Date;
    dateStr: string;
    dayOfWeek: string;
    dayName: string;
    formatted: string;
    diet: DietType;
    menu: DailyMenuResult;
    isSkipped: boolean;
  }> = useMemo(() => {
    return nextWeekDays.map((d) => {
      const diet = getDayDiet(d.dayOfWeek);
      const menu = getMenuForDate(d.dateStr, diet);
      return {
        ...d,
        diet,
        menu,
        isSkipped: skippedDays.includes(d.dateStr),
      };
    });
  }, [nextWeekDays, dietVariation, skippedDays]);

  // Compute pricing
  // Weekly pricing: 279 NV / 259 V. Second meal -10.
  const activeDays = weeklyMenus.filter((d) => !d.isSkipped);

  const totalPrice = useMemo(() => {
    let sum = 0;
    activeDays.forEach((d) => {
      const base = PRICING.weekly[d.diet];
      sum += base;
      if (mealsPerDay === 2) {
        sum += (base - PRICING.secondMealDiscount);
      }
    });
    return sum;
  }, [activeDays, mealsPerDay]);

  // Macro Averages
  const activeMenus = activeDays.map((d) => d.menu);
  const avgProtein = activeMenus.length > 0
    ? Math.round(
        activeMenus.reduce(
          (sum, m) =>
            sum + m.lunch.totals.protein + (mealsPerDay === 2 ? m.dinner.totals.protein : 0),
          0
        ) / activeMenus.length
      )
    : 0;

  const avgCalories = activeMenus.length > 0
    ? Math.round(
        activeMenus.reduce(
          (sum, m) =>
            sum + m.lunch.totals.calories + (mealsPerDay === 2 ? m.dinner.totals.calories : 0),
          0
        ) / activeMenus.length
      )
    : 0;

  const totalWeeklyProtein = activeMenus.reduce(
    (sum, m) =>
      sum + m.lunch.totals.protein + (mealsPerDay === 2 ? m.dinner.totals.protein : 0),
    0
  );

  const handleSubscribe = () => {
    setWeeklyOrder({
      weekStartDate: nextWeekDays[0].dateStr,
      dietVariation,
      mealsPerDay,
      skippedDays,
      selectedSides: [],
      selectedDrinks: [],
      lunchSlot,
      dinnerSlot,
      price: totalPrice,
    });
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#FBFDF8] text-[#124233] pb-32">
      {/* 1. Header */}
      <section className="bg-gradient-to-b from-[#E8F1D4] via-[#F2F7E4] to-[#FBFDF8] pt-8 pb-10 border-b border-[#124233]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[#124233] tracking-tight">
                Next Week’s Planned Foods
              </h1>
              <p className="text-sm sm:text-base text-[#124233]/80 font-medium max-w-2xl mt-2 leading-relaxed">
                6 days of non-repeating rotating meats, salads, legumes, and carbs. Skip any busy day with one tap and your bill automatically adjusts.
              </p>
            </div>

            {/* Weekly Macro KPI Strip */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-[#124233]/15 shadow-lg shadow-[#124233]/5 shrink-0 grid grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Avg Daily Protein</span>
                <span className="font-heading font-black text-xl sm:text-2xl text-[#124233] mt-0.5 block">
                  {avgProtein}g
                </span>
                <span className="text-[10px] text-[#899545] font-semibold">Every Day</span>
              </div>

              <div className="border-x border-gray-100 px-3">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Avg Calories</span>
                <span className="font-heading font-black text-xl sm:text-2xl text-[#124233] mt-0.5 block">
                  {avgCalories}
                </span>
                <span className="text-[10px] text-gray-400">Nutrient Dense</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Weekly Protein</span>
                <span className="font-heading font-black text-xl sm:text-2xl text-emerald-800 mt-0.5 block">
                  {totalWeeklyProtein}g
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold">Total Delivered</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Controls: Diet Variation & Meals Per Day */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-black/5 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
          {/* Diet Variation Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Diet Plan:</span>
            <div className="inline-flex flex-wrap p-1 bg-[#F5F8EC] rounded-2xl border border-[#124233]/10">
              <button
                type="button"
                onClick={() => setDietVariation('non-veg')}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all tap-active",
                  dietVariation === 'non-veg'
                    ? "bg-[#124233] text-white shadow-xs"
                    : "text-[#124233]/70 hover:text-[#124233]"
                )}
              >
                <Drumstick className="w-3.5 h-3.5 text-[#E2ECBA]" />
                <span>Non-Veg (6 NV)</span>
              </button>

              <button
                type="button"
                onClick={() => setDietVariation('veg')}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all tap-active",
                  dietVariation === 'veg'
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "text-[#124233]/70 hover:text-[#124233]"
                )}
              >
                <Leaf className="w-3.5 h-3.5 text-emerald-200" />
                <span>Vegetarian (6 V)</span>
              </button>

              <button
                type="button"
                onClick={() => setDietVariation('mixed')}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all tap-active",
                  dietVariation === 'mixed'
                    ? "bg-[#899545] text-white shadow-xs"
                    : "text-[#124233]/70 hover:text-[#124233]"
                )}
              >
                <Layers className="w-3.5 h-3.5 text-white" />
                <span>Mixed (4 NV + 2 V)</span>
              </button>
            </div>
          </div>

          {/* Meals Per Day Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Meals / Day:</span>
            <div className="inline-flex p-1 bg-[#F5F8EC] rounded-2xl border border-[#124233]/10">
              <button
                type="button"
                onClick={() => setMealsPerDay(1)}
                className={cn(
                  "px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all tap-active",
                  mealsPerDay === 1
                    ? "bg-[#124233] text-white shadow-xs"
                    : "text-[#124233]/70 hover:text-[#124233]"
                )}
              >
                1 Meal (Lunch)
              </button>

              <button
                type="button"
                onClick={() => setMealsPerDay(2)}
                className={cn(
                  "px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all tap-active flex items-center gap-1.5",
                  mealsPerDay === 2
                    ? "bg-[#124233] text-white shadow-xs"
                    : "text-[#124233]/70 hover:text-[#124233]"
                )}
              >
                <span>2 Meals (Lunch + Dinner)</span>
                <span className="text-[10px] font-black bg-[#899545] text-white px-2 py-0.5 rounded-full uppercase">
                  -₹10 2nd Meal
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. The 6-Day Mon-Sat Cards Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Day Cards Column */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h2 className="font-heading font-black text-xl text-[#124233]">
                Mon–Sat Box Schedule
              </h2>
              <span className="text-xs text-gray-500">
                Tap &ldquo;Skip Day&rdquo; to opt out with zero hassle
              </span>
            </div>

            <div className="space-y-4">
              {weeklyMenus.map((dayItem) => {
                const { menu, isSkipped } = dayItem;
                const lunch = menu.lunch;
                const dinner = menu.dinner;

                return (
                  <div
                    key={dayItem.dateStr}
                    className={cn(
                      "rounded-3xl border transition-all duration-200 overflow-hidden",
                      isSkipped
                        ? "bg-gray-50/80 border-gray-200 opacity-60"
                        : "bg-white border-black/5 shadow-sm hover:shadow-md"
                    )}
                  >
                    {/* Day Top Bar */}
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-heading font-black shrink-0",
                          isSkipped
                            ? "bg-gray-200 text-gray-500"
                            : "bg-[#124233] text-white"
                        )}>
                          <span className="text-sm leading-none">{dayItem.dayOfWeek}</span>
                          <span className="text-[10px] text-gray-300 font-mono mt-0.5">
                            {dayItem.formatted.split(' ')[1]}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-black text-base text-[#124233]">
                              {dayItem.dayName}
                            </span>
                            <span className={cn(
                              "text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase",
                              dayItem.diet === 'non-veg'
                                ? "bg-amber-100 text-amber-900"
                                : "bg-emerald-100 text-emerald-900"
                            )}>
                              {dayItem.diet === 'non-veg' ? 'Non-Veg' : 'Vegetarian'}
                            </span>
                            {lunch.hasPeanut && (
                              <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                                🥜 Peanut Alert
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {isSkipped ? "Day Skipped • Not billed" : lunch.items.main.name}
                          </p>
                        </div>
                      </div>

                      {/* Day Action & Macros */}
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        {!isSkipped && (
                          <div className="text-left sm:text-right text-xs font-mono">
                            <span className="font-bold text-[#899545]">
                              {lunch.totals.protein + (mealsPerDay === 2 ? dinner.totals.protein : 0)}g Protein
                            </span>
                            <span className="text-gray-400 block text-[11px]">
                              {lunch.totals.calories + (mealsPerDay === 2 ? dinner.totals.calories : 0)} kcal
                            </span>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => toggleSkipDay(dayItem.dateStr)}
                          className={cn(
                            "px-3.5 py-2 rounded-xl text-xs font-bold transition-all tap-active flex items-center gap-1.5",
                            isSkipped
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-700"
                          )}
                        >
                          {isSkipped ? (
                            <>
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Restore Day</span>
                            </>
                          ) : (
                            <>
                              <Ban className="w-3.5 h-3.5" />
                              <span>Skip Day</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Day Box Compartment Contents (if not skipped) */}
                    {!isSkipped && (
                      <div className="p-4 sm:p-5 space-y-4">
                        {/* Lunch Box */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">
                              Lunch Box (12:00 PM – 1:30 PM)
                            </span>
                            <span className="text-[11px] font-mono text-gray-400">
                              {lunch.totals.weightG}g digital weighed
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                            <div className="p-2.5 rounded-2xl bg-[#F5F8EC] border border-[#124233]/10">
                              <span className="text-[9px] font-bold text-gray-400 uppercase block">Main</span>
                              <span className="font-bold text-[#124233] block truncate mt-0.5">{lunch.items.main.name}</span>
                              <span className="text-[10px] text-[#899545] font-mono">{lunch.items.main.protein}g P</span>
                            </div>

                            <div className="p-2.5 rounded-2xl bg-[#F5F8EC] border border-[#124233]/10">
                              <span className="text-[9px] font-bold text-gray-400 uppercase block">Protein Side</span>
                              <span className="font-bold text-[#124233] block truncate mt-0.5">{lunch.items.proteinSide.name}</span>
                              <span className="text-[10px] text-[#899545] font-mono">{lunch.items.proteinSide.protein}g P</span>
                            </div>

                            <div className="p-2.5 rounded-2xl bg-[#F5F8EC] border border-[#124233]/10">
                              <span className="text-[9px] font-bold text-gray-400 uppercase block">Salad</span>
                              <span className="font-bold text-[#124233] block truncate mt-0.5">{lunch.items.salad.name}</span>
                              <span className="text-[10px] text-gray-500 font-mono">{lunch.items.salad.protein}g P</span>
                            </div>

                            <div className="p-2.5 rounded-2xl bg-[#F5F8EC] border border-[#124233]/10">
                              <span className="text-[9px] font-bold text-gray-400 uppercase block">Legume</span>
                              <span className="font-bold text-[#124233] block truncate mt-0.5">{lunch.items.legume.name}</span>
                              <span className="text-[10px] text-gray-500 font-mono">{lunch.items.legume.protein}g P</span>
                            </div>

                            <div className="p-2.5 rounded-2xl bg-[#F5F8EC] border border-[#124233]/10 col-span-2 sm:col-span-1">
                              <span className="text-[9px] font-bold text-gray-400 uppercase block">Carb</span>
                              <span className="font-bold text-[#124233] block truncate mt-0.5">{lunch.items.carb.name}</span>
                              <span className="text-[10px] text-gray-500 font-mono">{lunch.items.carb.protein}g P</span>
                            </div>
                          </div>
                        </div>

                        {/* Dinner Box (if 2 meals selected) */}
                        {mealsPerDay === 2 && (
                          <div className="pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-black uppercase tracking-wider text-[#899545]">
                                Dinner Box Variation (7:00 PM – 8:30 PM)
                              </span>
                              <span className="text-[11px] font-mono text-gray-400">
                                Rotated Sides (+2 / +3 slots)
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                              <div className="p-2 rounded-2xl bg-[#F5F8EC] border border-[#124233]/10">
                                <span className="text-[9px] font-bold text-gray-400 uppercase block">Main</span>
                                <span className="font-bold text-[#124233] block truncate mt-0.5">{dinner.items.main.name}</span>
                              </div>

                              <div className="p-2 rounded-2xl bg-[#F5F8EC] border border-[#124233]/10">
                                <span className="text-[9px] font-bold text-gray-400 uppercase block">Protein Side</span>
                                <span className="font-bold text-[#124233] block truncate mt-0.5">{dinner.items.proteinSide.name}</span>
                              </div>

                              <div className="p-2 rounded-2xl bg-[#EDF5D3] border border-[#899545]/20">
                                <span className="text-[9px] font-bold text-[#899545] uppercase block">Salad (+2)</span>
                                <span className="font-bold text-[#124233] block truncate mt-0.5">{dinner.items.salad.name}</span>
                              </div>

                              <div className="p-2 rounded-2xl bg-[#EDF5D3] border border-[#899545]/20">
                                <span className="text-[9px] font-bold text-[#899545] uppercase block">Legume (+3)</span>
                                <span className="font-bold text-[#124233] block truncate mt-0.5">{dinner.items.legume.name}</span>
                              </div>

                              <div className="p-2 rounded-2xl bg-[#EDF5D3] border border-[#899545]/20 col-span-2 sm:col-span-1">
                                <span className="text-[9px] font-bold text-[#899545] uppercase block">Carb (+3)</span>
                                <span className="font-bold text-[#124233] block truncate mt-0.5">{dinner.items.carb.name}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-gray-400 italic text-center pt-2">
              All macros are digitally calculated estimates from USDA &amp; NIN standard tables. Digital kitchen weighed. Lab verification pending.
            </p>
          </div>

          {/* Right Column: Pricing & Subscription Sticky Panel */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-xl shadow-[#124233]/5 space-y-5">
              <div className="pb-4 border-b border-gray-100">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Weekly Plan Summary</span>
                <h3 className="font-heading font-black text-xl text-[#124233] mt-0.5">
                  6-Day Routine
                </h3>
                <p className="text-xs text-gray-500">
                  Starts next {nextWeekDays[0].dayName}, {nextWeekDays[0].formatted}
                </p>
              </div>

              {/* Delivery Slots Selection */}
              <div className="space-y-3 text-xs">
                <label className="font-bold text-gray-700 block">
                  Lunch Delivery Window
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['12:00 PM - 1:30 PM', '1:00 PM - 2:00 PM'].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setLunchSlot(slot)}
                      className={cn(
                        "p-2 rounded-xl border text-center font-bold transition-all tap-active",
                        lunchSlot === slot
                          ? "bg-[#124233] text-white border-[#124233]"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
                      )}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                {mealsPerDay === 2 && (
                  <div className="pt-2">
                    <label className="font-bold text-gray-700 block mb-1">
                      Dinner Delivery Window
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['7:00 PM - 8:30 PM', '8:00 PM - 9:30 PM'].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setDinnerSlot(slot)}
                          className={cn(
                            "p-2 rounded-xl border text-center font-bold transition-all tap-active",
                            dinnerSlot === slot
                              ? "bg-[#124233] text-white border-[#124233]"
                              : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-2 pt-2 text-xs border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Selected Operating Days</span>
                  <span className="font-bold text-[#124233]">{activeDays.length} / 6 Days</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Meals Per Day</span>
                  <span className="font-bold text-[#124233]">{mealsPerDay} {mealsPerDay === 1 ? 'Meal (Lunch)' : 'Meals (Lunch + Dinner)'}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Base Rate / Meal</span>
                  <span className="font-mono font-bold">
                    {dietVariation === 'non-veg' ? '₹279 NV' : dietVariation === 'veg' ? '₹259 V' : '₹279 NV / ₹259 V'}
                  </span>
                </div>

                {mealsPerDay === 2 && (
                  <div className="flex justify-between text-[#899545] font-semibold">
                    <span>Second Meal Discount</span>
                    <span>-₹10 / Dinner</span>
                  </div>
                )}

                {skippedDays.length > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Skipped Days Adjustment ({skippedDays.length} skipped)</span>
                    <span>Auto-Deducted</span>
                  </div>
                )}

                <div className="flex justify-between text-emerald-800 font-semibold">
                  <span>Coimbatore Doorstep Delivery</span>
                  <span>FREE</span>
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs uppercase font-extrabold text-gray-400 block">Total Due</span>
                    <span className="text-[10px] text-gray-400">All taxes &amp; delivery included</span>
                  </div>
                  <span className="font-heading font-black text-3xl text-[#124233]">
                    ₹{totalPrice}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleSubscribe}
                disabled={activeDays.length === 0}
                className="w-full bg-[#124233] hover:bg-[#0E3529] disabled:bg-gray-300 text-white py-4 px-6 rounded-2xl font-heading font-bold text-sm tracking-wide shadow-lg shadow-[#124233]/25 flex items-center justify-center gap-2 tap-active transition-all group"
              >
                <span>Subscribe to Weekly Routine</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="text-[11px] text-gray-400 text-center space-y-1">
                <p>✓ No locked contracts • Pause or skip anytime before 9 PM</p>
                <p>✓ Digital kitchen scales ensure exact macro delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
