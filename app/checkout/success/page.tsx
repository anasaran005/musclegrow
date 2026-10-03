'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { useAppStore } from '@/store/useAppStore';
import { BRAND } from '@/config/brand';
import { CheckCircle2, Sparkles, MapPin, Bike, CalendarCheck, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function CheckoutSuccessPage() {
  const { user, getPlanMealCount, getPlanTotalWeeklyPrice, deliverySlotLunch, deliverySlotDinner, mealsPerDay } = useAppStore();

  useEffect(() => {
    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#14532D', '#A3E635', '#F97316', '#16A34A'],
      });
    } catch (e) {
      // Fallback gracefully
    }
  }, []);

  const mealCount = getPlanMealCount() || 12;
  const totalPrice = getPlanTotalWeeklyPrice() || 3240;

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* Celebration Badge */}
        <div className="w-20 h-20 rounded-3xl bg-primary text-lime-brand flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20 animate-bounce-subtle">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-3 py-1 rounded-full">
          Subscription Active!
        </span>

        <h1 className="font-heading font-black text-3xl sm:text-4xl text-gray-900 mt-3">
          Welcome to the {BRAND.name} Family!
        </h1>

        <p className="text-sm text-gray-600 max-w-md mx-auto mt-2 leading-relaxed">
          Your meal plan has been registered in our Coimbatore central kitchen. Every gram of protein and calorie will be measured precisely.
        </p>

        {/* Order Details Card */}
        <div className="mt-8 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl text-left space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400">Order Reference</span>
              <p className="font-heading font-black text-base text-gray-900">GW-8921-CBE</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-gray-400">Payment Status</span>
              <p className="font-heading font-bold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                ✓ Paid via Cashfree
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-400 font-semibold block">Weekly Meals</span>
              <span className="font-bold text-gray-900 text-sm">{mealCount} Meals</span>
            </div>
            <div>
              <span className="text-gray-400 font-semibold block">Total Billed</span>
              <span className="font-heading font-black text-gray-900 text-sm">{formatCurrency(totalPrice)}</span>
            </div>
            <div>
              <span className="text-gray-400 font-semibold block">Lunch Slot</span>
              <span className="font-bold text-gray-900">{deliverySlotLunch}</span>
            </div>
            {mealsPerDay === 2 && (
              <div>
                <span className="text-gray-400 font-semibold block">Dinner Slot</span>
                <span className="font-bold text-gray-900">{deliverySlotDinner}</span>
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3 text-xs text-gray-600">
            <Bike className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-gray-900">First delivery begins tomorrow!</p>
              <p className="text-[11px] mt-0.5">
                Our kitchen dispatches between 12:00 PM - 1:30 PM. You'll receive real-time WhatsApp updates with your rider partner contact details.
              </p>
            </div>
          </div>
        </div>

        {/* Next Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white font-bold text-sm px-7 py-3.5 rounded-2xl shadow-md tap-active flex items-center justify-center gap-2"
          >
            <span>Go to Subscriber Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/my-plan"
            className="w-full sm:w-auto bg-white border border-gray-200 text-gray-800 font-bold text-sm px-6 py-3.5 rounded-2xl hover:bg-gray-50 tap-active"
          >
            Review Weekly Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
