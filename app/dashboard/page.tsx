'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { ProgressRing } from '@/components/ui/ProgressRing';
import {
  Flame,
  Dumbbell,
  Clock,
  MapPin,
  CalendarCheck,
  Bike,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const { user, getDailyTotals, getPlanMealCount, getDailyBox, dayConfigs } = useAppStore();

  const todayTotals = getDailyTotals('Mon');
  const targetCalories = user.calculatedTargets?.calories || 2200;
  const targetProtein = user.calculatedTargets?.protein || 140;

  const todayBox = getDailyBox('Mon');
  const todayConfig = dayConfigs['Mon'];

  const proteinPct = Math.min(100, Math.round((todayTotals.protein / targetProtein) * 100));
  const calsPct = Math.min(100, Math.round((todayTotals.calories / targetCalories) * 100));

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Top Welcome Header */}
      <section className="bg-white border-b border-gray-200 pt-6 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-heading font-black text-xl text-primary">
              MA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-black text-2xl text-gray-900">
                  Vanakkam, {user.fullName || 'Mohammed'}!
                </h1>
                <span className="text-[10px] font-extrabold bg-lime-brand/30 text-primary-dark px-2 py-0.5 rounded-full uppercase">
                  Active Subscriber
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Goal: <span className="font-bold text-gray-700 capitalize">{user.goal.replace('-', ' ')}</span> • RS Puram, Coimbatore
              </p>
            </div>
          </div>

          {/* 14-Day Streak Pill */}
          <div className="flex items-center gap-3 bg-orange-50 border border-orange-200/80 p-3 rounded-2xl self-start sm:self-auto">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-heading font-black text-base shadow-sm">
              🔥
            </div>
            <div>
              <p className="font-heading font-black text-sm text-orange-950">
                14-Day Streak!
              </p>
              <p className="text-[11px] text-orange-700 font-medium">
                14 consecutive measured days logged
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Today's Delivery Card & Meals */}
          <div className="lg:col-span-8 space-y-6">
            {/* Live Next Delivery Tracker Card */}
            <div className="bg-gradient-to-r from-primary-dark via-primary to-[#0e4b25] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-lime-brand animate-ping" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-lime-brand">
                    Next Delivery Today
                  </span>
                </div>
                <Link
                  href="/orders/ord-101"
                  className="text-xs font-bold text-lime-brand hover:underline flex items-center gap-1"
                >
                  <span>Track live</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-300">Estimated Arrival:</p>
                  <p className="font-heading font-black text-2xl sm:text-3xl text-white">
                    12:45 PM <span className="text-xs font-normal text-lime-brand">(Lunch Window)</span>
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-300 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-lime-brand" />
                    <span>Flat 4B, East Sambandam Road, RS Puram</span>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-lime-brand text-primary-dark flex items-center justify-center font-bold">
                    <Bike className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-300">Rider Partner:</p>
                    <p className="text-xs font-bold text-white">Murugan S. (+91 94432...)</p>
                    <p className="text-[10px] text-lime-brand font-medium">Out for delivery</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Scheduled Box */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading font-black text-xl text-gray-900">
                    Today’s Box (Monday)
                  </h2>
                  <p className="text-xs text-gray-500">
                    ~{todayTotals.calories} kcal • ~{todayTotals.protein}g protein scheduled
                  </p>
                </div>

                <Link
                  href="/my-plan"
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Manage weekly planner</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border">
                    <Image
                      src={todayBox.image}
                      alt={todayBox.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-base text-gray-900">
                        {todayBox.name}
                      </span>
                      <span className="text-[10px] font-bold bg-primary text-lime-brand px-2 py-0.5 rounded uppercase">
                        {todayBox.day}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {todayBox.items.map((i) => i.name).join(' • ')}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs">
                      <span className="font-bold text-emerald-700">~{todayTotals.protein}g protein</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">~{todayTotals.calories} kcal</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Link
                    href={`/box/${todayBox.slug}`}
                    className="text-xs font-bold bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100"
                  >
                    View Breakdown
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Macro Progress Rings & Weekly Schedule */}
          <div className="lg:col-span-4 space-y-6">
            {/* Daily Macro Completion Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-card">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="font-heading font-black text-lg text-gray-900">
                    Daily Macro Rings
                  </h3>
                  <p className="text-xs text-gray-500">Mifflin-St Jeor target comparison</p>
                </div>
                <Link href="/progress" className="text-xs font-bold text-primary hover:underline">
                  Log weight →
                </Link>
              </div>

              {/* Progress Rings */}
              <div className="py-6 flex items-center justify-center gap-6 bg-gray-50/60 rounded-2xl my-4 border border-gray-100">
                <ProgressRing
                  progress={proteinPct}
                  size={105}
                  strokeWidth={9}
                  color="#16A34A"
                  label="Protein"
                  value={`${todayTotals.protein}g`}
                  subValue={`of ${targetProtein}g`}
                />
                <ProgressRing
                  progress={calsPct}
                  size={105}
                  strokeWidth={9}
                  color="#EA580C"
                  label="Calories"
                  value={`${todayTotals.calories}`}
                  subValue={`of ${targetCalories}`}
                />
              </div>

              {/* Macro Details */}
              <div className="space-y-2 text-xs font-semibold">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 flex justify-between">
                  <span>Carbs from meals:</span>
                  <span className="font-bold">{todayTotals.carbs}g</span>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 flex justify-between">
                  <span>Healthy Fat from meals:</span>
                  <span className="font-bold">{todayTotals.fat}g</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-3">
              <h4 className="font-heading font-bold text-sm text-gray-900 uppercase tracking-wider text-gray-500">
                Quick Subscription Actions
              </h4>

              <Link
                href="/my-plan"
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors tap-active"
              >
                <div className="flex items-center gap-2.5">
                  <CalendarCheck className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-gray-800">Weekly Box Customizer</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>

              <Link
                href="/subscription"
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors tap-active"
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-gray-800">Pause or Skip Days</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>

              <Link
                href="/orders"
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors tap-active"
              >
                <div className="flex items-center gap-2.5">
                  <Bike className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-gray-800">Past Orders & Invoices</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
