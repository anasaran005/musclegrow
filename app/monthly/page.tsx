'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  X,
  RotateCcw,
  CheckCircle2,
  Clock,
  Layers,
  Drumstick,
  Leaf,
  CreditCard,
  QrCode,
  Flame,
  Info,
} from 'lucide-react';
import {
  getMonthlyOperatingDays,
  getMenuForDate,
  PRICING,
  DailyMenuResult,
  DietType,
} from '@/lib/menu-engine';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

export default function MonthlyPlanPage() {
  const router = useRouter();
  const { setMonthlyOrder } = useAppStore();

  const monthlyDays = useMemo(() => getMonthlyOperatingDays(), []);

  // Controls
  const [mealsPerDay, setMealsPerDay] = useState<1 | 2>(1);
  const [dietVariation, setDietVariation] = useState<'non-veg' | 'veg' | 'mixed'>('non-veg');
  const [paymentMode, setPaymentMode] = useState<'prepaid' | 'autopay'>('autopay');
  const [skippedDays, setSkippedDays] = useState<string[]>([]);

  // Delivery slots
  const [lunchSlot, setLunchSlot] = useState('12:00 PM - 1:30 PM');
  const [dinnerSlot, setDinnerSlot] = useState('7:00 PM - 8:30 PM');

  // Modal inspection state
  const [inspectedDay, setInspectedDay] = useState<{
    dateStr: string;
    dayOfWeek: string;
    dayName: string;
    formatted: string;
    diet: DietType;
    menu: DailyMenuResult;
  } | null>(null);

  // AutoPay Cashfree Mock Modal
  const [isCashfreeModalOpen, setIsCashfreeModalOpen] = useState(false);
  const [cashfreeStep, setCashfreeStep] = useState<'details' | 'authenticating' | 'mandate_active'>('details');

  const getDayDiet = (dayOfWeek: string): DietType => {
    if (dietVariation === 'non-veg') return 'non-veg';
    if (dietVariation === 'veg') return 'veg';
    return dayOfWeek === 'Wed' || dayOfWeek === 'Fri' ? 'veg' : 'non-veg';
  };

  // Build menu for all 24 operating days
  const calendarDays = useMemo(() => {
    return monthlyDays.map((d) => {
      const diet = getDayDiet(d.dayOfWeek);
      const menu = getMenuForDate(d.dateStr, diet);
      const isSkipped = skippedDays.includes(d.dateStr);
      return {
        ...d,
        diet,
        menu,
        isSkipped,
      };
    });
  }, [monthlyDays, dietVariation, skippedDays]);

  // Color coding helper based on main dish name
  const getMainColorTheme = (mainName: string, isVeg: boolean) => {
    if (mainName.includes('Fish')) {
      return {
        bg: 'bg-sky-50',
        border: 'border-sky-200',
        badge: 'bg-sky-100 text-sky-800 border-sky-300',
        dot: 'bg-sky-500',
      };
    }
    if (isVeg) {
      if (mainName.includes('Paneer')) {
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          badge: 'bg-amber-100 text-amber-900 border-amber-300',
          dot: 'bg-amber-500',
        };
      }
      if (mainName.includes('Tofu')) {
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          badge: 'bg-purple-100 text-purple-900 border-purple-300',
          dot: 'bg-purple-500',
        };
      }
      return {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        dot: 'bg-emerald-500',
      };
    }
    // Chicken varieties
    return {
      bg: 'bg-[#F8FAF2]',
      border: 'border-[#124233]/15',
      badge: 'bg-[#E8F1D4] text-[#124233] border-[#899545]/40',
      dot: 'bg-[#899545]',
    };
  };

  // Toggle skip day
  const toggleSkipDay = (dateStr: string) => {
    setSkippedDays((prev) =>
      prev.includes(dateStr) ? prev.filter((d) => d !== dateStr) : [...prev, dateStr]
    );
  };

  // Automatically skip all peanut days helper
  const handleSkipAllPeanutDays = () => {
    const peanutDayDates = calendarDays
      .filter((d) => d.menu.lunch.hasPeanut)
      .map((d) => d.dateStr);

    setSkippedDays((prev) => Array.from(new Set([...prev, ...peanutDayDates])));
  };

  // Price calculations
  // Monthly pricing: ₹269 NV / ₹249 V. Second meal -₹10.
  const activeDays = calendarDays.filter((d) => !d.isSkipped);

  const totalPrice = useMemo(() => {
    let sum = 0;
    activeDays.forEach((d) => {
      const base = PRICING.monthly[d.diet];
      sum += base;
      if (mealsPerDay === 2) {
        sum += (base - PRICING.secondMealDiscount);
      }
    });
    return sum;
  }, [activeDays, mealsPerDay]);

  const weeklyAutoPayAmount = Math.round(totalPrice / 4);

  const handleProceed = () => {
    setMonthlyOrder({
      startMonthDate: monthlyDays[0].dateStr,
      dietVariation,
      mealsPerDay,
      skippedDays,
      paymentMode,
      lunchSlot,
      dinnerSlot,
      price: totalPrice,
    });

    if (paymentMode === 'autopay') {
      setIsCashfreeModalOpen(true);
    } else {
      router.push('/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFDF8] text-[#124233] pb-32">
      {/* 1. Header */}
      <section className="bg-gradient-to-b from-[#E8F1D4] via-[#F2F7E4] to-[#FBFDF8] pt-8 pb-10 border-b border-[#124233]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[#124233] tracking-tight">
                Monthly Lifestyle Plan
              </h1>
              <p className="text-sm sm:text-base text-[#124233]/80 font-medium max-w-2xl mt-2 leading-relaxed">
                Color-coded calendar of rotating chicken styles, coastal fish, and rich vegetarian mains. Tap any day to view its 5-item box. Peanut days include free 1-click skips.
              </p>
            </div>

            {/* Quick Action: Skip Peanut Days */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-[#124233]/15 shadow-md flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🥜</span>
                <div>
                  <span className="text-xs font-bold text-gray-900 block">Peanut Allergy?</span>
                  <span className="text-[11px] text-gray-500">Free skip available on all peanut sundal days</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSkipAllPeanutDays}
                className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition-colors shrink-0"
              >
                Skip Peanut Days
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Controls & Color Legend */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-black/5 shadow-sm space-y-5">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
            {/* Diet Plan Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Diet Plan:</span>
              <div className="inline-flex flex-wrap p-1 bg-[#F5F8EC] rounded-2xl border border-[#124233]/10">
                <button
                  type="button"
                  onClick={() => setDietVariation('non-veg')}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all tap-active",
                    dietVariation === 'non-veg'
                      ? "bg-[#124233] text-white shadow-xs"
                      : "text-[#124233]/70 hover:text-[#124233]"
                  )}
                >
                  <Drumstick className="w-3.5 h-3.5 text-[#E2ECBA]" />
                  <span>Non-Veg (24 NV)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDietVariation('veg')}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all tap-active",
                    dietVariation === 'veg'
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "text-[#124233]/70 hover:text-[#124233]"
                  )}
                >
                  <Leaf className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Vegetarian (24 V)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDietVariation('mixed')}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all tap-active",
                    dietVariation === 'mixed'
                      ? "bg-[#899545] text-white shadow-xs"
                      : "text-[#124233]/70 hover:text-[#124233]"
                  )}
                >
                  <Layers className="w-3.5 h-3.5 text-white" />
                  <span>Mixed (16 NV + 8 V)</span>
                </button>
              </div>
            </div>

            {/* Meals Per Day Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Meals:</span>
              <div className="inline-flex p-1 bg-[#F5F8EC] rounded-2xl border border-[#124233]/10">
                <button
                  type="button"
                  onClick={() => setMealsPerDay(1)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all tap-active",
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
                    "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all tap-active flex items-center gap-1.5",
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

          {/* Color Legend */}
          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-4 text-xs font-medium text-gray-600">
            <span className="text-[10px] uppercase font-bold text-gray-400">Color Legend:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#899545]" />
              <span>5 Rotating Chicken Styles</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-sky-500" />
              <span>Coastal Fish (Wednesdays)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Soya Chunks Sukka</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Smoked Paneer Tikka</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-500" />
              <span>Organic Firm Tofu</span>
            </div>
          </div>
        </div>

        {/* 3. The 24-Day Calendar Grid + Sticky Checkout Panel */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Calendar Grid (24 operating days, Mon-Sat) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-black/5 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-black text-xl text-[#124233]">
                    24-Day Operating Calendar
                  </h3>
                  <p className="text-xs text-gray-500">
                    4 weeks of Mon–Sat meals • Tap any cell to view 5-item box details
                  </p>
                </div>
                <span className="text-xs font-bold text-[#899545] bg-[#F5F8EC] px-3 py-1 rounded-full">
                  {activeDays.length} Days Active
                </span>
              </div>

              {/* Calendar Grid Headers */}
              <div className="grid grid-cols-6 gap-2 text-center text-xs font-black uppercase tracking-wider text-gray-400 pb-2 border-b border-gray-100">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* Grid Cells (4 rows of 6 days) */}
              <div className="grid grid-cols-6 gap-2 sm:gap-3">
                {calendarDays.map((cDay, idx) => {
                  const lunch = cDay.menu.lunch;
                  const theme = getMainColorTheme(lunch.items.main.name, cDay.diet === 'veg');
                  const isSkipped = cDay.isSkipped;

                  return (
                    <div
                      key={cDay.dateStr}
                      onClick={() => setInspectedDay(cDay)}
                      className={cn(
                        "relative p-2.5 sm:p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between aspect-square group",
                        isSkipped
                          ? "bg-gray-100/70 border-gray-200 opacity-50"
                          : `${theme.bg} ${theme.border} hover:shadow-md hover:-translate-y-0.5`
                      )}
                    >
                      {/* Top Bar: Date & Status */}
                      <div className="flex items-start justify-between">
                        <span className="font-heading font-black text-xs sm:text-sm text-[#124233]">
                          {cDay.formatted.split(' ')[1]}
                        </span>
                        <div className="flex items-center gap-1">
                          {lunch.hasPeanut && (
                            <span className="text-[10px]" title="Contains Peanuts">
                              🥜
                            </span>
                          )}
                          <span className={cn("w-2 h-2 rounded-full", isSkipped ? "bg-gray-400" : theme.dot)} />
                        </div>
                      </div>

                      {/* Main Protein Tag */}
                      <div className="my-auto">
                        <span className={cn(
                          "text-[9px] sm:text-[10px] font-bold block truncate leading-tight",
                          isSkipped ? "text-gray-400 line-through" : "text-[#124233]"
                        )}>
                          {isSkipped ? "Skipped" : lunch.items.main.name.split(' ')[0]}
                        </span>
                        {!isSkipped && (
                          <span className="text-[9px] font-mono text-gray-500 block truncate">
                            {lunch.totals.protein}g P
                          </span>
                        )}
                      </div>

                      {/* Bottom indicator */}
                      <div className="text-[8px] font-black uppercase tracking-wider text-gray-400 flex items-center justify-between">
                        <span>W{cDay.weekIndex + 1}</span>
                        <span className="group-hover:text-[#124233] transition-colors">Inspect &rarr;</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span>* Sundays are closed kitchen days for deep sanitisation.</span>
                <span>Lab verification pending for macros.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Checkout Sticky Panel */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-xl shadow-[#124233]/5 space-y-5">
              <div className="pb-4 border-b border-gray-100">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Monthly Subscription</span>
                <h3 className="font-heading font-black text-xl text-[#124233] mt-0.5">
                  24 Days Transformation
                </h3>
                <p className="text-xs text-gray-500">
                  Starts {monthlyDays[0].dayName}, {monthlyDays[0].formatted}
                </p>
              </div>

              {/* Payment Mode Selector: Prepaid vs UPI AutoPay */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-700 block">Billing Method</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('autopay')}
                    className={cn(
                      "p-3 rounded-2xl border text-left font-bold transition-all tap-active flex flex-col justify-between",
                      paymentMode === 'autopay'
                        ? "bg-[#124233] text-white border-[#124233] shadow-xs"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <QrCode className="w-3.5 h-3.5 text-[#E2ECBA]" />
                      <span className="text-[11px]">UPI AutoPay</span>
                    </div>
                    <span className={cn("text-[10px] font-normal", paymentMode === 'autopay' ? "text-white/80" : "text-gray-400")}>
                      ₹{weeklyAutoPayAmount} / week auto-debit
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMode('prepaid')}
                    className={cn(
                      "p-3 rounded-2xl border text-left font-bold transition-all tap-active flex flex-col justify-between",
                      paymentMode === 'prepaid'
                        ? "bg-[#124233] text-white border-[#124233] shadow-xs"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Prepaid Full</span>
                    </div>
                    <span className={cn("text-[10px] font-normal", paymentMode === 'prepaid' ? "text-white/80" : "text-gray-400")}>
                      One-time payment
                    </span>
                  </button>
                </div>
              </div>

              {/* Delivery Slots Selection */}
              <div className="space-y-3 text-xs">
                <label className="font-bold text-gray-700 block">Lunch Delivery Slot</label>
                <div className="grid grid-cols-2 gap-2">
                  {['12:00 PM - 1:30 PM', '1:00 PM - 2:00 PM'].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setLunchSlot(slot)}
                      className={cn(
                        "p-2 rounded-xl border text-center font-bold transition-all",
                        lunchSlot === slot
                          ? "bg-[#124233] text-white border-[#124233]"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      )}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                {mealsPerDay === 2 && (
                  <div className="pt-2">
                    <label className="font-bold text-gray-700 block mb-1">Dinner Delivery Slot</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['7:00 PM - 8:30 PM', '8:00 PM - 9:30 PM'].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setDinnerSlot(slot)}
                          className={cn(
                            "p-2 rounded-xl border text-center font-bold transition-all",
                            dinnerSlot === slot
                              ? "bg-[#124233] text-white border-[#124233]"
                              : "bg-gray-50 text-gray-700 border-gray-200"
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
                  <span>Operating Days Billed</span>
                  <span className="font-bold text-[#124233]">{activeDays.length} / 24 Days</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Monthly Rate / Meal</span>
                  <span className="font-mono font-bold">
                    {dietVariation === 'non-veg' ? '₹269 NV' : dietVariation === 'veg' ? '₹249 V' : '₹269 / ₹249'}
                  </span>
                </div>

                {mealsPerDay === 2 && (
                  <div className="flex justify-between text-[#899545] font-semibold">
                    <span>2nd Meal Discount</span>
                    <span>-₹10 / Dinner</span>
                  </div>
                )}

                {skippedDays.length > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Skipped Days Adjustment ({skippedDays.length} days)</span>
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
                    <span className="text-[10px] text-gray-400">
                      {paymentMode === 'autopay' ? `Billed ₹${weeklyAutoPayAmount}/week` : 'Full 24 days prepaid'}
                    </span>
                  </div>
                  <span className="font-heading font-black text-3xl text-[#124233]">
                    ₹{totalPrice}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleProceed}
                disabled={activeDays.length === 0}
                className="w-full bg-[#124233] hover:bg-[#0E3529] disabled:bg-gray-300 text-white py-4 px-6 rounded-2xl font-heading font-bold text-sm tracking-wide shadow-lg shadow-[#124233]/25 flex items-center justify-center gap-2 tap-active transition-all group"
              >
                <span>{paymentMode === 'autopay' ? 'Setup UPI AutoPay Mandate' : 'Prepay Monthly Plan'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="text-[11px] text-gray-400 text-center space-y-1">
                <p>✓ UPI AutoPay with Cashfree • Zero lock-in, pause anytime</p>
                <p>✓ Automated credit adjustments on all skipped days</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Day Inspection Modal (Opens on day tap) */}
      {inspectedDay && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-black/10 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-black text-xl text-[#124233]">
                    {inspectedDay.dayName}, {inspectedDay.formatted}
                  </span>
                  <span className={cn(
                    "text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase",
                    inspectedDay.diet === 'non-veg' ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-900"
                  )}>
                    {inspectedDay.diet === 'non-veg' ? 'Non-Veg' : 'Veg'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  5-item rotating protein box breakdown
                </p>
              </div>

              <button
                type="button"
                onClick={() => setInspectedDay(null)}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Peanut Warning Banner (if applicable) */}
            {inspectedDay.menu.lunch.hasPeanut && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🥜</span>
                  <div>
                    <span className="font-bold text-amber-900 block">Peanut Allergen Notice</span>
                    <span className="text-[11px] text-amber-800">This box contains Steamed Peanut Sundal.</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleSkipDay(inspectedDay.dateStr)}
                  className="px-3 py-1.5 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold text-xs"
                >
                  {skippedDays.includes(inspectedDay.dateStr) ? "Restored" : "Free Skip Day"}
                </button>
              </div>
            )}

            {/* Lunch Box Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-bold text-sm text-[#124233]">
                  Lunch Box (12:00 PM – 1:30 PM)
                </h4>
                <div className="text-xs font-mono text-[#899545] font-bold">
                  {inspectedDay.menu.lunch.totals.protein}g Protein • {inspectedDay.menu.lunch.totals.calories} kcal
                </div>
              </div>

              <div className="space-y-2">
                {inspectedDay.menu.lunch.itemArray.map((it) => (
                  <div key={it.id} className="p-3 rounded-2xl bg-[#F5F8EC] border border-[#124233]/10 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-gray-200">
                        <Image src={it.image} alt={it.name} fill sizes="40px" className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] uppercase font-bold text-gray-400 block">{it.category}</span>
                        <span className="font-bold text-[#124233] block truncate">{it.name}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 font-mono text-[11px]">
                      <span className="font-bold text-emerald-800">{it.protein}g P</span>
                      <span className="text-gray-400 block">{it.grams}g</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dinner Box Breakdown (if 2 meals) */}
            {mealsPerDay === 2 && (
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-sm text-[#899545]">
                    Dinner Box Variation (7:00 PM – 8:30 PM)
                  </h4>
                  <div className="text-xs font-mono text-[#899545] font-bold">
                    {inspectedDay.menu.dinner.totals.protein}g Protein • {inspectedDay.menu.dinner.totals.calories} kcal
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#EDF5D3]/60 border border-[#899545]/20 text-xs space-y-1">
                  <p className="font-bold text-[#124233]">
                    Main: {inspectedDay.menu.dinner.items.main.name}
                  </p>
                  <p className="text-gray-600">
                    Rotated Salad: <span className="font-semibold text-[#124233]">{inspectedDay.menu.dinner.items.salad.name}</span>
                  </p>
                  <p className="text-gray-600">
                    Rotated Legume: <span className="font-semibold text-[#124233]">{inspectedDay.menu.dinner.items.legume.name}</span>
                  </p>
                  <p className="text-gray-600">
                    Rotated Carb: <span className="font-semibold text-[#124233]">{inspectedDay.menu.dinner.items.carb.name}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Skip Toggle Button inside modal */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  toggleSkipDay(inspectedDay.dateStr);
                }}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all tap-active",
                  skippedDays.includes(inspectedDay.dateStr)
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-50 text-red-700 hover:bg-red-100"
                )}
              >
                {skippedDays.includes(inspectedDay.dateStr) ? "Restore this Day" : "Skip this Day (Auto-Refund)"}
              </button>

              <button
                type="button"
                onClick={() => setInspectedDay(null)}
                className="px-5 py-2 rounded-xl bg-[#124233] text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Cashfree UPI AutoPay Mock Modal */}
      {isCashfreeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full border border-black/10 shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-150">
            {/* Cashfree Mock Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="font-heading font-black text-sm text-gray-900 tracking-wide">
                  Cashfree Payments • UPI AutoPay
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCashfreeModalOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {cashfreeStep === 'details' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Merchant:</span>
                    <span className="font-bold text-gray-900">Gramwise Central Kitchen</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">AutoPay Mandate Limit:</span>
                    <span className="font-bold text-gray-900">Up to ₹{weeklyAutoPayAmount}/week</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Frequency:</span>
                    <span className="font-bold text-gray-900">Weekly (Every Monday)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">First Debit:</span>
                    <span className="font-bold text-emerald-700">₹{weeklyAutoPayAmount} (Today)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 block">
                    Enter UPI ID (GPay / PhonePe / Paytm)
                  </label>
                  <input
                    type="text"
                    defaultValue="user@okaxis"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCashfreeStep('authenticating');
                    setTimeout(() => {
                      setCashfreeStep('mandate_active');
                      setTimeout(() => {
                        setIsCashfreeModalOpen(false);
                        router.push('/checkout/success');
                      }, 1200);
                    }, 1400);
                  }}
                  className="w-full bg-[#124233] hover:bg-[#0E3529] text-white py-3.5 px-4 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 tap-active"
                >
                  <span>Authorize UPI AutoPay Mandate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {cashfreeStep === 'authenticating' && (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 border-4 border-[#124233] border-t-transparent rounded-full animate-spin mx-auto" />
                <h4 className="font-heading font-black text-base text-gray-900">
                  Authorizing Mandate via Cashfree...
                </h4>
                <p className="text-xs text-gray-500">
                  Please approve the mandate notification on your UPI app.
                </p>
              </div>
            )}

            {cashfreeStep === 'mandate_active' && (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-heading font-black text-lg text-gray-900">
                  AutoPay Mandate Successfully Set Up!
                </h4>
                <p className="text-xs text-gray-500">
                  Redirecting to your active subscription dashboard...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
