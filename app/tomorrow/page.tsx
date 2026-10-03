'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Clock,
  Flame,
  Dumbbell,
  Wheat,
  Droplet,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Plus,
  Minus,
  Sparkles,
  Info,
  ChevronRight,
  Leaf,
  Drumstick,
} from 'lucide-react';
import {
  getMenuForDate,
  getNextBookableDays,
  getEarliestBookableDate,
  PRICING,
  DietType,
  DailyMenuResult,
} from '@/lib/menu-engine';
import { useAppStore } from '@/store/useAppStore';
import sidesData from '@/data/sides.json';
import addonsData from '@/data/addons.json';
import { SideBox, AddonDrink } from '@/types';
import { cn, formatCurrency } from '@/lib/utils';

export default function TomorrowMenuPage() {
  const router = useRouter();
  const { setTrialOrder } = useAppStore();

  // Days strip
  const bookableDays = useMemo(() => getNextBookableDays(6), []);
  const earliest = useMemo(() => getEarliestBookableDate(), []);

  // Selected date
  const [selectedDateStr, setSelectedDateStr] = useState<string>(earliest.dateStr);
  const [diet, setDiet] = useState<DietType>('non-veg');
  const [mealsPerDay, setMealsPerDay] = useState<1 | 2>(1);

  // Extras state
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>([]);

  // Delivery slots
  const [lunchSlot, setLunchSlot] = useState('12:00 PM - 1:30 PM');
  const [dinnerSlot, setDinnerSlot] = useState('7:00 PM - 8:30 PM');

  // Countdown timer to 9:00 PM cutoff tonight
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      // Target is today 9:00 PM
      const target = new Date();
      target.setHours(21, 0, 0, 0);

      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds, isExpired: false });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch rotating box calculation for the selected date
  const menu: DailyMenuResult = useMemo(() => {
    return getMenuForDate(selectedDateStr, diet);
  }, [selectedDateStr, diet]);

  // Selected day info
  const selectedDayInfo = useMemo(() => {
    return bookableDays.find((d) => d.dateStr === selectedDateStr) || bookableDays[0];
  }, [bookableDays, selectedDateStr]);

  const sides = sidesData as SideBox[];
  const addons = addonsData as AddonDrink[];

  // Price calculations
  const baseMealPrice = PRICING.trial[diet]; // 299 NV or 279 Veg
  const secondMealPrice = baseMealPrice - PRICING.secondMealDiscount; // ₹10 off second meal
  const boxTotal = mealsPerDay === 1 ? baseMealPrice : baseMealPrice + secondMealPrice;

  const sidesTotal = selectedSides.reduce((sum, id) => {
    const s = sides.find((item) => item.id === id);
    return sum + (s ? s.price : 0);
  }, 0);

  const drinksTotal = selectedDrinks.reduce((sum, id) => {
    const d = addons.find((item) => item.id === id);
    return sum + (d ? d.price : 0);
  }, 0);

  const grandTotal = boxTotal + sidesTotal + drinksTotal;

  // Toggle helpers for extras
  const toggleSide = (id: string) => {
    setSelectedSides((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleDrink = (id: string) => {
    setSelectedDrinks((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Proceed to Checkout
  const handleProceedToPrepay = () => {
    setTrialOrder({
      dateStr: selectedDateStr,
      dayName: `${selectedDayInfo.dayOfWeek}, ${selectedDayInfo.formatted}`,
      diet,
      mealsPerDay,
      selectedSides,
      selectedDrinks,
      lunchSlot,
      dinnerSlot,
      price: grandTotal,
    });

    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#FBFDF8] text-[#124233] pb-32">
      {/* 1. Header with Cutoff Alert & Timer */}
      <section className="bg-gradient-to-b from-[#E8F1D4] via-[#F2F7E4] to-[#FBFDF8] pt-8 pb-10 border-b border-[#124233]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              
              <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[#124233] tracking-tight">
                Tomorrow’s Kitchen Menu
              </h1>
              <p className="text-sm sm:text-base text-[#124233]/80 font-medium max-w-2xl mt-2 leading-relaxed">
                One balanced 5-item box cooked fresh every morning in cold-pressed oils. Digitally weighed to the gram with zero food waste.
              </p>
            </div>

            {/* Cutoff Countdown Badge */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#124233]/15 shadow-lg shadow-[#124233]/5 shrink-0 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#124233] text-white flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  9:00 PM Night-Before Cutoff
                </p>
                {timeLeft.isExpired ? (
                  <p className="text-sm font-bold text-amber-700 mt-0.5">
                    Tonight’s cutoff locked • Showing earliest open slot
                  </p>
                ) : (
                  <div className="flex items-center gap-1.5 mt-0.5 font-mono font-black text-xl text-[#124233]">
                    <span className="bg-[#F2F7E4] px-2 py-0.5 rounded-lg border border-[#124233]/10">
                      {String(timeLeft.hours).padStart(2, '0')}h
                    </span>
                    <span>:</span>
                    <span className="bg-[#F2F7E4] px-2 py-0.5 rounded-lg border border-[#124233]/10">
                      {String(timeLeft.minutes).padStart(2, '0')}m
                    </span>
                    <span>:</span>
                    <span className="bg-[#F2F7E4] px-2 py-0.5 rounded-lg border border-[#124233]/10">
                      {String(timeLeft.seconds).padStart(2, '0')}s
                    </span>
                    <span className="text-[11px] font-sans font-bold text-[#899545] ml-1">left</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2. Date Strip: Next 6 Upcoming Bookable Days */}
          <div className="mt-8 pt-6 border-t border-[#124233]/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Choose Upcoming Delivery Day (Mon–Sat)
              </span>
              <span className="text-xs font-medium text-emerald-800">
                Sundays Closed for Deep Kitchen Sanitisation
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {bookableDays.map((bDay) => {
                const isSelected = selectedDateStr === bDay.dateStr;
                return (
                  <button
                    key={bDay.dateStr}
                    type="button"
                    onClick={() => setSelectedDateStr(bDay.dateStr)}
                    className={cn(
                      "p-3 rounded-2xl border text-left transition-all duration-200 tap-active relative overflow-hidden flex flex-col justify-between",
                      isSelected
                        ? "bg-[#124233] text-white border-[#124233] shadow-md shadow-[#124233]/20 -translate-y-0.5"
                        : "bg-white text-[#124233] border-black/5 hover:border-[#124233]/30 hover:bg-[#F8FAF2]"
                    )}
                  >
                    {bDay.isEarliest && (
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-1 w-fit",
                        isSelected ? "bg-[#899545] text-white" : "bg-emerald-100 text-emerald-800"
                      )}>
                        Earliest Open
                      </span>
                    )}
                    <div>
                      <span className="font-heading font-black text-sm block">
                        {bDay.dayOfWeek}
                      </span>
                      <span className={cn("text-xs font-semibold block mt-0.5", isSelected ? "text-white/80" : "text-gray-500")}>
                        {bDay.formatted}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Stage: Controls + Box Breakdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Toggle Bar: Veg/Non-Veg & Qty */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-black/5 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
          {/* Left: Veg / Non-Veg Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Diet:</span>
            <div className="inline-flex p-1 bg-[#F5F8EC] rounded-2xl border border-[#124233]/10">
              <button
                type="button"
                onClick={() => setDiet('non-veg')}
                className={cn(
                  "flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all tap-active",
                  diet === 'non-veg'
                    ? "bg-[#124233] text-white shadow-xs"
                    : "text-[#124233]/70 hover:text-[#124233]"
                )}
              >
                <Drumstick className="w-4 h-4 text-[#E2ECBA]" />
                <span>Non-Veg (Chicken/Fish)</span>
              </button>

              <button
                type="button"
                onClick={() => setDiet('veg')}
                className={cn(
                  "flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all tap-active",
                  diet === 'veg'
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "text-[#124233]/70 hover:text-[#124233]"
                )}
              >
                <Leaf className="w-4 h-4 text-emerald-200" />
                <span>Vegetarian (Paneer/Soya/Tofu)</span>
              </button>
            </div>
          </div>

          {/* Right: 1 Meal vs 2 Meals Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Quantity:</span>
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
                  -₹10 Off
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 4. Active Box Visual Presentation */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 5-Item Box Breakdown */}
          <div className="lg:col-span-8 space-y-6">
            {/* Box Header & Macro Banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-black/5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#899545] uppercase tracking-wider">
                      {selectedDayInfo.dayName} Box • {diet === 'non-veg' ? 'Non-Veg Protein' : 'Vegetarian Protein'}
                    </span>
                    {menu.lunch.hasPeanut && (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        Contains Peanuts
                      </span>
                    )}
                  </div>
                  <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#124233] mt-1">
                    {menu.lunch.items.main.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    5 digitally measured compartments in certified eco-friendly microwave-safe packaging.
                  </p>
                </div>

                {/* Single Box Price Tag */}
                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Trial Box Price</span>
                  <span className="font-heading font-black text-2xl sm:text-3xl text-[#124233]">
                    ₹{baseMealPrice}
                  </span>
                  <span className="text-[11px] text-gray-500 block">Free delivery</span>
                </div>
              </div>

              {/* Macro Bar (Digitally Weighed) */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#F5F8EC] border border-[#124233]/10">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Calories</span>
                  <span className="font-heading font-black text-xl text-[#124233] mt-0.5 block">
                    {menu.lunch.totals.calories} kcal
                  </span>
                  <span className="text-[10px] text-gray-400">Target portion</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#E8F1D4]/60 border border-[#899545]/30">
                  <span className="text-[10px] uppercase font-extrabold text-[#899545] block">Clean Protein</span>
                  <span className="font-heading font-black text-xl text-[#124233] mt-0.5 block">
                    {menu.lunch.totals.protein}g
                  </span>
                  <span className="text-[10px] text-[#899545] font-semibold">High Bioavailability</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F5F8EC] border border-[#124233]/10">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Complex Carbs</span>
                  <span className="font-heading font-black text-xl text-[#124233] mt-0.5 block">
                    {menu.lunch.totals.carbs}g
                  </span>
                  <span className="text-[10px] text-gray-400">Low Glycemic</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F5F8EC] border border-[#124233]/10">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Healthy Fats</span>
                  <span className="font-heading font-black text-xl text-[#124233] mt-0.5 block">
                    {menu.lunch.totals.fat}g
                  </span>
                  <span className="text-[10px] text-gray-400">Cold-Pressed Oils</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F5F8EC] border border-[#124233]/10 col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Net Weight</span>
                  <span className="font-heading font-black text-xl text-[#124233] mt-0.5 block">
                    {menu.lunch.totals.weightG}g
                  </span>
                  <span className="text-[10px] text-gray-400">Digital Scaled</span>
                </div>
              </div>

              {/* Lab verification note */}
              <p className="text-[11px] text-gray-400 italic mt-4 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>{menu.labVerifiedNote}</span>
              </p>
            </div>

            {/* 5-Item Compartment Breakdown Cards */}
            <div className="space-y-3">
              <h3 className="font-heading font-black text-lg text-[#124233] flex items-center justify-between">
                <span>Inside Your 5-Compartment Box</span>
                <span className="text-xs font-semibold text-gray-400">Fresh morning preparation</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {menu.lunch.itemArray.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-3xl bg-white border border-black/5 shadow-xs flex items-start gap-3.5 group hover:shadow-md transition-all duration-200"
                  >
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-gray-100 border border-black/5">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md capitalize">
                          {item.category.replace('-', ' ')}
                        </span>
                        <span className="text-xs font-mono font-bold text-gray-500">
                          {item.grams}g
                        </span>
                      </div>

                      <h4 className="font-heading font-bold text-sm text-[#124233] truncate mt-1">
                        {item.name}
                      </h4>

                      <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5 leading-snug">
                        {item.description}
                      </p>

                      <div className="mt-2 flex items-center gap-2.5 text-[10px] font-mono font-semibold text-gray-600">
                        <span className="text-emerald-700 font-bold">{item.protein}g P</span>
                        <span>•</span>
                        <span>{item.calories} kcal</span>
                        <span>•</span>
                        <span>{item.carbs}g C</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* If 2 Meals per day is selected, show the DINNER BOX VARIATION */}
            {mealsPerDay === 2 && (
              <div className="mt-8 pt-6 border-t border-[#124233]/10 space-y-4">
                <div className="p-5 rounded-3xl bg-[#EDF5D3]/60 border border-[#899545]/30">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-[#124233] text-white px-2.5 py-0.5 rounded-full">
                          2nd Meal • Dinner Rotation
                        </span>
                        <span className="text-xs font-bold text-[#899545]">
                          7:00 PM – 8:30 PM Delivery
                        </span>
                      </div>
                      <h3 className="font-heading font-black text-xl text-[#124233] mt-2">
                        Dinner Box: Same Protein Main + Rotated Sides
                      </h3>
                      <p className="text-xs text-[#124233]/80 mt-1 max-w-xl">
                        To keep eating exciting with zero palate fatigue, our kitchen delivers the same fresh cooked {menu.lunch.items.main.name} paired with rotated salad (+2 slots), legume (+3 slots), and carb (+3 slots)!
                      </p>
                    </div>
                    <span className="font-heading font-black text-xl text-[#124233]">
                      ₹{secondMealPrice}
                    </span>
                  </div>

                  {/* Dinner Compartment Badges */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-3 bg-white rounded-2xl border border-[#124233]/10">
                      <span className="text-[9px] uppercase font-bold text-gray-400 block">Dinner Salad (Shifted +2)</span>
                      <span className="font-bold text-[#124233] block mt-0.5 truncate">{menu.dinner.items.salad.name}</span>
                      <span className="text-[10px] text-emerald-700 font-mono">{menu.dinner.items.salad.protein}g protein</span>
                    </div>

                    <div className="p-3 bg-white rounded-2xl border border-[#124233]/10">
                      <span className="text-[9px] uppercase font-bold text-gray-400 block">Dinner Legume (Shifted +3)</span>
                      <span className="font-bold text-[#124233] block mt-0.5 truncate">{menu.dinner.items.legume.name}</span>
                      <span className="text-[10px] text-emerald-700 font-mono">{menu.dinner.items.legume.protein}g protein</span>
                    </div>

                    <div className="p-3 bg-white rounded-2xl border border-[#124233]/10">
                      <span className="text-[9px] uppercase font-bold text-gray-400 block">Dinner Carb (Shifted +3)</span>
                      <span className="font-bold text-[#124233] block mt-0.5 truncate">{menu.dinner.items.carb.name}</span>
                      <span className="text-[10px] text-emerald-700 font-mono">{menu.dinner.items.carb.protein}g protein</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#124233]/10 flex items-center justify-between text-xs font-semibold text-gray-600">
                    <span>Combined Daily Protein: {menu.lunch.totals.protein + menu.dinner.totals.protein}g</span>
                    <span>Total Daily Calories: {menu.lunch.totals.calories + menu.dinner.totals.calories} kcal</span>
                  </div>
                </div>
              </div>
            )}

            {/* Extras Section: Sides & Cold-Pressed Juices */}
            <div className="mt-10 pt-6 border-t border-[#124233]/10 space-y-6">
              <div>
                <h3 className="font-heading font-black text-xl text-[#124233]">
                  Add Extras (Optional Add-ons)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Enhance your daily macros with extra seared protein portions and fresh cold-pressed drinks.
                </p>
              </div>

              {/* High Protein Sides */}
              <div className="space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#899545]">
                  High-Protein Extra Sides
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sides.slice(0, 4).map((side) => {
                    const isAdded = selectedSides.includes(side.id);
                    return (
                      <div
                        key={side.id}
                        className={cn(
                          "p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 bg-white",
                          isAdded ? "border-[#124233] ring-1 ring-[#124233] bg-[#F5F8EC]/40" : "border-black/5 hover:border-gray-200"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                            <Image src={side.image} alt={side.name} fill sizes="48px" className="object-cover" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-heading font-bold text-xs text-[#124233] truncate">{side.name}</h4>
                            <p className="text-[10px] text-gray-500">{side.protein}g protein • {side.calories} kcal</p>
                            <span className="font-mono font-bold text-xs text-[#124233] mt-0.5 block">₹{side.price}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleSide(side.id)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-xs font-bold transition-all tap-active shrink-0",
                            isAdded
                              ? "bg-[#124233] text-white"
                              : "bg-[#F5F8EC] text-[#124233] hover:bg-[#EAF1DC]"
                          )}
                        >
                          {isAdded ? 'Added ✓' : '+ Add'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cold-Pressed Juices */}
              <div className="space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#899545]">
                  Cold-Pressed Antioxidant Juices (Zero Added Sugar)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {addons.slice(0, 4).map((drink) => {
                    const isAdded = selectedDrinks.includes(drink.id);
                    return (
                      <div
                        key={drink.id}
                        className={cn(
                          "p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 bg-white",
                          isAdded ? "border-[#124233] ring-1 ring-[#124233] bg-[#F5F8EC]/40" : "border-black/5 hover:border-gray-200"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                            <Image src={drink.image} alt={drink.name} fill sizes="48px" className="object-cover" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-heading font-bold text-xs text-[#124233] truncate">{drink.name}</h4>
                            <p className="text-[10px] text-gray-500">{drink.volume} • {drink.sugar}</p>
                            <span className="font-mono font-bold text-xs text-[#124233] mt-0.5 block">₹{drink.price}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleDrink(drink.id)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-xs font-bold transition-all tap-active shrink-0",
                            isAdded
                              ? "bg-[#124233] text-white"
                              : "bg-[#F5F8EC] text-[#124233] hover:bg-[#EAF1DC]"
                          )}
                        >
                          {isAdded ? 'Added ✓' : '+ Add'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Prepay CTA (Sticky) */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-xl shadow-[#124233]/5 space-y-5">
              <div className="pb-4 border-b border-gray-100">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Order Summary</span>
                <h3 className="font-heading font-black text-xl text-[#124233] mt-0.5">
                  {selectedDayInfo.dayOfWeek}, {selectedDayInfo.formatted}
                </h3>
                <p className="text-xs text-gray-500">
                  Prepay-only single day trial • Kitchen locked at 9:00 PM
                </p>
              </div>

              {/* Delivery Slots Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-700 block">
                  Lunch Delivery Slot (Doorstep)
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['12:00 PM - 1:30 PM', '1:00 PM - 2:00 PM'].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setLunchSlot(slot)}
                      className={cn(
                        "p-2.5 rounded-xl border text-center font-bold transition-all tap-active",
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
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Dinner Delivery Slot (Hot Homestyle)
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {['7:00 PM - 8:30 PM', '8:00 PM - 9:30 PM'].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setDinnerSlot(slot)}
                          className={cn(
                            "p-2.5 rounded-xl border text-center font-bold transition-all tap-active",
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

              {/* Bill Breakdown */}
              <div className="space-y-2 pt-2 text-xs border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>1x Lunch Box ({diet === 'non-veg' ? 'Non-Veg' : 'Veg'})</span>
                  <span className="font-mono font-bold">₹{baseMealPrice}</span>
                </div>

                {mealsPerDay === 2 && (
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-1">
                      <span>1x Dinner Box</span>
                      <span className="text-[10px] text-[#899545] font-bold">(-₹10 discount)</span>
                    </span>
                    <span className="font-mono font-bold">₹{secondMealPrice}</span>
                  </div>
                )}

                {selectedSides.length > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Extras ({selectedSides.length} sides)</span>
                    <span className="font-mono font-bold">+₹{sidesTotal}</span>
                  </div>
                )}

                {selectedDrinks.length > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Juices ({selectedDrinks.length} bottles)</span>
                    <span className="font-mono font-bold">+₹{drinksTotal}</span>
                  </div>
                )}

                <div className="flex justify-between text-emerald-800 font-semibold">
                  <span>Coimbatore Doorstep Delivery</span>
                  <span>FREE</span>
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs uppercase font-extrabold text-gray-400 block">Total Due (Prepay)</span>
                    <span className="text-[10px] text-gray-400">Taxes & packaging included</span>
                  </div>
                  <span className="font-heading font-black text-3xl text-[#124233]">
                    ₹{grandTotal}
                  </span>
                </div>
              </div>

              {/* Action Button: Prepay-only */}
              <button
                type="button"
                onClick={handleProceedToPrepay}
                className="w-full bg-[#124233] hover:bg-[#0E3529] text-white py-4 px-6 rounded-2xl font-heading font-bold text-sm tracking-wide shadow-lg shadow-[#124233]/25 flex items-center justify-center gap-2 tap-active transition-all group"
              >
                <span>Prepay &amp; Book {selectedDayInfo.dayOfWeek} Box</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="text-[11px] text-gray-400 text-center space-y-1">
                <p>🔒 100% Prepayment Required (Zero COD for batch freshness)</p>
                <p>Delivery across RS Puram, Peelamedu, Gandhipuram &amp; 9 more zones</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
