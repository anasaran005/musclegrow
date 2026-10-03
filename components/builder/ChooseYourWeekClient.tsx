'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, DayOfWeek, SideBox, AddonDrink, ScheduleItem, PlanTier, GoalType } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { calculateMacros } from '@/lib/macro-calculator';
import { recommendSidesForTargets } from '@/lib/api/planner';
import {
  Sparkles,
  Target,
  Calendar,
  Check,
  Plus,
  ArrowRight,
  ShieldCheck,
  Leaf,
  Info,
  Flame,
  Dumbbell,
  Clock,
  Layers,
  Trash2,
  Sliders,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

interface ChooseYourWeekClientProps {
  boxes: Box[];
  schedule: ScheduleItem[];
  sides: SideBox[];
  addons: AddonDrink[];
  plans: PlanTier[];
}

const ALL_DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function ChooseYourWeekClient({
  boxes,
  schedule,
  sides,
  addons,
  plans,
}: ChooseYourWeekClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialDayParam = searchParams.get('day') as DayOfWeek | null;

  const {
    user,
    setUser,
    mealsPerDay,
    setMealsPerDay,
    selectedDays,
    toggleDay,
    setSelectedDays,
    dayConfigs,
    setDayConfig,
    toggleDayEggFree,
    toggleDaySkipLegume,
    toggleDayDoubleMain,
    toggleSideForDay,
    toggleDrinkForDay,
    hasWeeklyJuiceBundle,
    setWeeklyJuiceBundle,
    hasWeeklySideBundle,
    setWeeklySideBundle,
    billingCycle,
    setBillingCycle,
    getPlanMealCount,
    getPlanTotalWeeklyPrice,
    getSingleDaySurcharge,
    getDailyTotals,
  } = useAppStore();

  const [activeDayTab, setActiveDayTab] = useState<DayOfWeek>(
    initialDayParam && ALL_DAYS.includes(initialDayParam) ? initialDayParam : selectedDays[0] || 'Mon'
  );

  // Profile Macro Target Calculator
  const [goal, setGoal] = useState<GoalType>(user.goal || 'muscle-gain');
  const [weightKg, setWeightKg] = useState<number>(user.weightKg || 72);
  const [heightCm, setHeightCm] = useState<number>(user.heightCm || 175);
  const [age, setAge] = useState<number>(user.age || 26);
  const [activityLevel, setActivityLevel] = useState(user.activityLevel || 'moderately-active');
  const [showMacroSettings, setShowMacroSettings] = useState(false);

  // Calculate targets with Mifflin-St Jeor
  const userMacroTargets = useMemo(() => {
    return calculateMacros({
      gender: user.gender || 'male',
      age,
      weightKg,
      heightCm,
      activityLevel,
      goal,
    });
  }, [age, weightKg, heightCm, activityLevel, goal, user.gender]);

  // Recommendation engine from lib/api/planner
  const recommendationAnalysis = useMemo(() => {
    return recommendSidesForTargets({
      targetCalories: userMacroTargets.targetCalories,
      targetProtein: userMacroTargets.proteinG,
      mealsPerDay,
      selectedDays,
      isVeg: user.dietType === 'veg',
      activeConfigs: dayConfigs,
    });
  }, [userMacroTargets, mealsPerDay, selectedDays, user.dietType, dayConfigs]);

  const activeBox = boxes.find((b) => b.day === activeDayTab) || boxes[0];
  const activeConfig = dayConfigs[activeDayTab] || {
    day: activeDayTab,
    boxId: activeBox.id,
    boxCount: mealsPerDay,
    isEggFree: false,
    skipLegume: false,
    doubleMain: false,
    selectedSides: [],
    selectedDrinks: [],
  };

  const activeDayMacros = getDailyTotals(activeDayTab);
  const totalMealCount = getPlanMealCount();
  const totalPrice = getPlanTotalWeeklyPrice();
  const singleDaySurcharge = getSingleDaySurcharge();

  // Recommendations for the active day
  const currentDayRec = recommendationAnalysis.dayRecommendations.find((r) => r.day === activeDayTab);

  return (
    <div className="min-h-screen bg-background pb-36">
      {/* Header */}
      <section className="bg-gradient-to-b from-white to-background border-b border-gray-200 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-3.5 py-1 rounded-full">
            Choose Your Week • Fixed Daily Rotation
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-gray-900 mt-2">
            Build Your Weekly Nutrition
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm max-w-xl mx-auto mt-2">
            Pick your delivery days, choose 1 or 2 boxes per day, toggle egg-free or box options, and add sides to hit your exact calorie and protein goals.
          </p>

          {/* Quick Config Row */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs">
            {/* Meals Per Day Toggle */}
            <div className="bg-white border border-gray-200 rounded-2xl p-1 shadow-xs flex items-center">
              <span className="text-gray-500 font-bold px-3">Boxes / Day:</span>
              <button
                onClick={() => setMealsPerDay(1)}
                className={cn(
                  "px-4 py-1.5 rounded-xl font-bold transition-all tap-active",
                  mealsPerDay === 1
                    ? "bg-primary text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                1 Box (Lunch OR Dinner)
              </button>
              <button
                onClick={() => setMealsPerDay(2)}
                className={cn(
                  "px-4 py-1.5 rounded-xl font-bold transition-all tap-active",
                  mealsPerDay === 2
                    ? "bg-primary text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                2 Boxes (Lunch + Dinner)
              </button>
            </div>

            {/* Target Calculator Pill */}
            <button
              onClick={() => setShowMacroSettings(!showMacroSettings)}
              className="bg-white border border-gray-200 hover:border-primary text-gray-700 font-bold px-4 py-2 rounded-2xl shadow-xs flex items-center gap-2 tap-active transition-all"
            >
              <Target className="w-4 h-4 text-primary" />
              <span>Target: {userMacroTargets.proteinG}g P • {userMacroTargets.targetCalories} kcal</span>
              <Sliders className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>

          {/* Expandable Macro Adjuster Drawer */}
          {showMacroSettings && (
            <div className="mt-4 p-5 bg-white rounded-3xl border border-gray-200 shadow-md max-w-2xl mx-auto text-left animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="font-heading font-black text-sm text-gray-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span>Mifflin-St Jeor Macro Engine</span>
                </span>
                <span className="text-[11px] text-gray-500">Live Calibration</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
                <div>
                  <label className="text-gray-500 font-bold block mb-1">Goal</label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value as GoalType)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 font-bold text-gray-800"
                  >
                    <option value="muscle-gain">Muscle Gain</option>
                    <option value="fat-loss">Fat Loss</option>
                    <option value="stay-fit">Stay Fit</option>
                    <option value="elderly-care">Gentle Vitality</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-500 font-bold block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 font-bold text-gray-800"
                  />
                </div>
                <div>
                  <label className="text-gray-500 font-bold block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 font-bold text-gray-800"
                  />
                </div>
                <div>
                  <label className="text-gray-500 font-bold block mb-1">Activity</label>
                  <select
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 font-bold text-gray-800 text-[11px]"
                  >
                    <option value="sedentary">Sedentary</option>
                    <option value="lightly-active">Lightly Active</option>
                    <option value="moderately-active">Moderately Active</option>
                    <option value="very-active">Very Active</option>
                  </select>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 mt-3">
                {userMacroTargets.explanation}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Main Builder Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* Days Picker Strip */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-gray-100 gap-2">
            <div>
              <h2 className="font-heading font-black text-sm text-gray-900">
                1. Select Which Days You Want Food Delivered
              </h2>
              <p className="text-[11px] text-gray-500">
                Fixed rotation: each day has a single batch-cooked box. Sunday is kitchen off.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])}
                className="text-[11px] font-bold text-primary hover:underline"
              >
                Select All 6 Days
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
            {ALL_DAYS.map((day) => {
              const isSelected = selectedDays.includes(day);
              const isTab = activeDayTab === day;
              const sched = schedule.find((s) => s.day === day);

              return (
                <div
                  key={day}
                  onClick={() => {
                    if (!isSelected) toggleDay(day);
                    setActiveDayTab(day);
                  }}
                  className={cn(
                    "cursor-pointer p-3 rounded-2xl border-2 transition-all flex flex-col justify-between tap-active",
                    isSelected
                      ? isTab
                        ? "border-primary bg-primary-light/20 ring-2 ring-primary/20 shadow-xs"
                        : "border-primary/50 bg-white"
                      : "border-gray-200 bg-gray-50/50 opacity-60 hover:opacity-100"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-black text-sm text-gray-900">{day}</span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleDay(day);
                      }}
                      className="accent-primary w-4 h-4 cursor-pointer"
                    />
                  </div>
                  <div className="mt-2 text-xs">
                    <p className="font-bold text-gray-800 text-[11px] truncate">{sched?.boxName}</p>
                    <span className="text-[10px] font-semibold text-emerald-700">{sched?.protein}g P</span>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedDays.length === 1 && (
            <p className="text-xs text-amber-800 bg-amber-50 rounded-xl p-2.5 mt-3 flex items-center gap-2 font-medium">
              <Info className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Single-day orders include a nominal +₹30 kitchen prep fee. Select 6 days to save 9%.</span>
            </p>
          )}
        </div>

        {/* Two-Column Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Active Day Box Configuration (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl relative overflow-hidden bg-gray-100 shrink-0 border">
                    <Image
                      src={activeBox.image}
                      alt={activeBox.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-primary text-lime-brand font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                        {activeDayTab} Box
                      </span>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        activeBox.isVeg ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      )}>
                        {activeBox.isVeg ? 'Veg' : 'Non-Veg'}
                      </span>
                    </div>
                    <h3 className="font-heading font-black text-xl text-gray-900 mt-0.5">
                      {activeBox.name}
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-heading font-black text-2xl text-gray-900 block">
                    {formatCurrency(activeBox.price * activeConfig.boxCount + (activeConfig.doubleMain ? 80 * activeConfig.boxCount : 0))}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {activeConfig.boxCount} box{activeConfig.boxCount > 1 ? 'es' : ''} on {activeDayTab}
                  </span>
                </div>
              </div>

              {/* Day's Box Items Strip */}
              <div className="mt-4 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-2">5 Compartment Breakdown</span>
                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
                  {activeBox.items.map((it, idx) => (
                    <div key={idx} className="bg-white p-1.5 rounded-xl border border-gray-100">
                      <span className="font-bold text-gray-800 block truncate">{it.name}</span>
                      <span className="text-gray-400 block">{it.grams}g</span>
                      <span className="font-extrabold text-emerald-700 block">{it.protein}g P</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box Level Swap Options */}
              <div className="mt-5 space-y-3">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Box Customizations ({activeDayTab})
                </span>

                {/* Egg-Free Toggle */}
                <div
                  onClick={() => toggleDayEggFree(activeDayTab)}
                  className={cn(
                    "cursor-pointer p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between tap-active",
                    activeConfig.isEggFree
                      ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Leaf className={cn("w-5 h-5", activeConfig.isEggFree ? "text-emerald-700" : "text-gray-400")} />
                    <div>
                      <h4 className="font-heading font-bold text-xs text-gray-900">
                        Egg-Free Version (Swap 2 Eggs for Extra Legume Portion)
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {activeBox.eggFreeVersion.description} • No extra cost
                      </p>
                    </div>
                  </div>
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                    activeConfig.isEggFree ? "border-emerald-600 bg-emerald-600 text-white" : "border-gray-300"
                  )}>
                    {activeConfig.isEggFree && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                {/* Skip Legume Option */}
                <div
                  onClick={() => toggleDaySkipLegume(activeDayTab)}
                  className={cn(
                    "cursor-pointer p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between tap-active",
                    activeConfig.skipLegume
                      ? "border-primary bg-primary-light/20 ring-2 ring-primary/20"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div>
                    <h4 className="font-heading font-bold text-xs text-gray-900">
                      Skip Legume Portion
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Omits sundal/channa for users with legume sensitivities or ultra-low GI needs.
                    </p>
                  </div>
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                    activeConfig.skipLegume ? "border-primary bg-primary text-white" : "border-gray-300"
                  )}>
                    {activeConfig.skipLegume && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                {/* Double Main Portion Option (+₹80) */}
                <div
                  onClick={() => toggleDayDoubleMain(activeDayTab)}
                  className={cn(
                    "cursor-pointer p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between tap-active",
                    activeConfig.doubleMain
                      ? "border-primary bg-primary-light/20 ring-2 ring-primary/20"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-bold text-xs text-gray-900">
                        Double Main Protein Portion
                      </h4>
                      <span className="text-[10px] font-bold bg-lime-brand text-primary-dark px-1.5 py-0.2 rounded-md">
                        +₹80 • +24g Protein
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Doubles the raw weighed portion of {activeBox.items[0]?.name}.
                    </p>
                  </div>
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                    activeConfig.doubleMain ? "border-primary bg-primary text-white" : "border-gray-300"
                  )}>
                    {activeConfig.doubleMain && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              </div>

              {/* Add Sides For This Day */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Add Sides to {activeDayTab} Delivery
                  </span>
                  <span className="text-[11px] text-primary font-semibold">
                    {activeConfig.selectedSides.length} added
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {sides.map((side) => {
                    const isSelected = activeConfig.selectedSides.includes(side.id);
                    return (
                      <div
                        key={side.id}
                        onClick={() => toggleSideForDay(activeDayTab, side.id)}
                        className={cn(
                          "cursor-pointer p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 tap-active",
                          isSelected
                            ? "border-primary bg-primary-light/20 font-bold"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        )}
                      >
                        <div className="text-xs">
                          <span className="font-bold text-gray-900 block truncate">{side.name}</span>
                          <span className="text-[10px] text-emerald-700 font-semibold">
                            +{side.protein}g P • {side.calories} kcal
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-extrabold text-gray-900">{formatCurrency(side.price)}</span>
                          <div className={cn(
                            "w-5 h-5 rounded-lg border flex items-center justify-center",
                            isSelected ? "bg-primary text-white border-primary" : "border-gray-300 text-gray-400"
                          )}>
                            {isSelected ? <Check className="w-3 h-3 stroke-[3]" /> : <Plus className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add Drinks For This Day */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Add Cold-Pressed Juices (250 ml, No Sugar)
                  </span>
                  <span className="text-[11px] text-primary font-semibold">
                    {activeConfig.selectedDrinks.length} added
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {addons.map((drink) => {
                    const isSelected = activeConfig.selectedDrinks.includes(drink.id);
                    return (
                      <div
                        key={drink.id}
                        onClick={() => toggleDrinkForDay(activeDayTab, drink.id)}
                        className={cn(
                          "cursor-pointer p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 tap-active",
                          isSelected
                            ? "border-primary bg-primary-light/20 font-bold"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        )}
                      >
                        <div className="text-xs">
                          <span className="font-bold text-gray-900 block truncate">{drink.name}</span>
                          <span className="text-[10px] text-amber-800 font-medium block">
                            {drink.sugar}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-extrabold text-gray-900">{formatCurrency(drink.price)}</span>
                          <div className={cn(
                            "w-5 h-5 rounded-lg border flex items-center justify-center",
                            isSelected ? "bg-primary text-white border-primary" : "border-gray-300 text-gray-400"
                          )}>
                            {isSelected ? <Check className="w-3 h-3 stroke-[3]" /> : <Plus className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Weekly Macros, Recommendations & Price Bill (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            {/* Live Macro Gauge vs Target */}
            <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-heading font-black text-sm text-gray-900">
                    Live Planned Macros vs Target
                  </h3>
                  <p className="text-[10px] text-gray-400">
                    Calculated daily average across your {selectedDays.length} selected days
                  </p>
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase px-2 py-0.5 rounded-full",
                  recommendationAnalysis.overallStatus === 'perfect'
                    ? "bg-emerald-100 text-emerald-800"
                    : recommendationAnalysis.overallStatus === 'low-protein'
                    ? "bg-amber-100 text-amber-800"
                    : "bg-blue-100 text-blue-800"
                )}>
                  {recommendationAnalysis.overallStatus}
                </span>
              </div>

              {/* Protein Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-gray-700">Planned Protein</span>
                  <span className="font-heading font-black text-emerald-700">
                    ~{recommendationAnalysis.averageDailyProtein}g / {userMacroTargets.proteinG}g target
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      recommendationAnalysis.averageDailyProtein >= userMacroTargets.proteinG
                        ? "bg-emerald-600"
                        : "bg-emerald-500"
                    )}
                    style={{
                      width: `${Math.min(100, Math.round((recommendationAnalysis.averageDailyProtein / (userMacroTargets.proteinG || 1)) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Calories Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-gray-700">Planned Calories</span>
                  <span className="font-heading font-black text-gray-900">
                    ~{recommendationAnalysis.averageDailyCalories} / {userMacroTargets.targetCalories} kcal
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{
                      width: `${Math.min(100, Math.round((recommendationAnalysis.averageDailyCalories / (userMacroTargets.targetCalories || 1)) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              <p className="text-[11px] text-gray-600 bg-gray-50 rounded-xl p-2.5 leading-relaxed">
                {recommendationAnalysis.summaryMessage}
              </p>
            </div>

            {/* Smart Recommendation Card for Active Day */}
            {currentDayRec?.recommendedSide && (
              <div className="bg-primary-light/40 border border-primary/30 rounded-3xl p-4 shadow-xs space-y-2">
                <div className="flex items-center gap-1.5 text-primary font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>Recommendation for {activeDayTab}</span>
                </div>
                <p className="text-xs text-primary-dark font-medium leading-relaxed">
                  {currentDayRec.recommendationReason}
                </p>
                <button
                  onClick={() => toggleSideForDay(activeDayTab, currentDayRec.recommendedSide!.id)}
                  className="w-full mt-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2 rounded-xl tap-active flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add {currentDayRec.recommendedSide.name} (+{formatCurrency(currentDayRec.recommendedSide.price)})</span>
                </button>
              </div>
            )}

            {/* Order Bill Summary */}
            <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-lg space-y-4">
              <h3 className="font-heading font-black text-base text-gray-900 pb-2 border-b border-gray-100">
                Total Week Summary
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Days Selected:</span>
                  <span className="font-bold text-gray-900">{selectedDays.join(', ')} ({selectedDays.length} days)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Boxes:</span>
                  <span className="font-bold text-gray-900">{totalMealCount} boxes</span>
                </div>

                {singleDaySurcharge > 0 && (
                  <div className="flex justify-between text-amber-700">
                    <span>Single-day kitchen surcharge:</span>
                    <span className="font-bold">+{formatCurrency(singleDaySurcharge)}</span>
                  </div>
                )}

                {selectedDays.length >= 6 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>6-Day Subscription Savings:</span>
                    <span>-9% included</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-500">
                  <span>Coimbatore Doorstep Delivery:</span>
                  <span className="font-bold text-emerald-700 uppercase">Free</span>
                </div>
              </div>

              {/* Bundles Add-on Checkboxes */}
              <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
                <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hasWeeklyJuiceBundle}
                      onChange={(e) => setWeeklyJuiceBundle(e.target.checked)}
                      className="accent-primary"
                    />
                    <span className="font-bold text-gray-800">Daily Cold-Pressed Juice Bundle</span>
                  </div>
                  <span className="font-bold text-primary">+₹299/wk</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hasWeeklySideBundle}
                      onChange={(e) => setWeeklySideBundle(e.target.checked)}
                      className="accent-primary"
                    />
                    <span className="font-bold text-gray-800">Daily Protein Side Bundle</span>
                  </div>
                  <span className="font-bold text-primary">+₹999/wk</span>
                </label>
              </div>

              {/* Total Payable & CTA */}
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">Total Payable</span>
                    <span className="text-[10px] text-gray-400">Cutoff 9 PM previous evening</span>
                  </div>
                  <span className="font-heading font-black text-2xl text-primary">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-cta hover:bg-cta-hover text-white font-black text-sm py-3.5 px-4 rounded-2xl shadow-xl shadow-cta/25 hover:shadow-2xl transition-all tap-active flex items-center justify-center gap-2 text-center"
                >
                  <span>Proceed to Delivery & Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
