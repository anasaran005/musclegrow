'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import {
  ShieldCheck,
  PauseCircle,
  PlayCircle,
  Calendar,
  CreditCard,
  AlertCircle,
  ChevronRight,
  Clock,
  Sparkles,
  X,
  Check,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

export default function SubscriptionPage() {
  const { subscription, pauseSubscription, resumeSubscription, cancelSubscription } = useAppStore();

  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [pauseDays, setPauseDays] = useState(7);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleConfirmPause = () => {
    pauseSubscription(pauseDays);
    setIsPauseModalOpen(false);
    showToast(`Subscription paused for ${pauseDays} days.`);
  };

  const handleConfirmResume = () => {
    resumeSubscription();
    showToast("Subscription resumed! Deliveries will continue tomorrow.");
  };

  const handleConfirmCancel = () => {
    if (!cancelReason) return;
    cancelSubscription(cancelReason);
    setIsCancelModalOpen(false);
    showToast("Subscription cancelled. Unused balance credited.");
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <section className="bg-white border-b border-gray-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-heading font-black text-2xl text-gray-900">
              Manage Subscription
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Control your billing frequency, deliveries, pauses, and plan tiers.
            </p>
          </div>
          {subscription?.status === 'active' ? (
            <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              ● Active
            </span>
          ) : (
            <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              ● Paused
            </span>
          )}
        </div>
      </section>

      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-4 z-50 bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
          <Check className="w-4 h-4 text-lime-brand stroke-[3]" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Main Plan Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-primary tracking-wider bg-primary-light px-2.5 py-0.5 rounded-md">
                Current Plan
              </span>
              <h2 className="font-heading font-black text-2xl text-gray-900 mt-1">
                {subscription?.planName || "Active Plan (2 meals/day)"}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Delivered Monday - Saturday across Coimbatore.
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-gray-400">Next Auto-Renewal</span>
              <p className="font-heading font-black text-xl text-gray-900">
                {subscription?.nextBillingDate || "Sunday, 12 Oct"}
              </p>
              <p className="text-xs font-bold text-emerald-700">
                {formatCurrency(subscription?.pricePerCycle || 3240)} via UPI AutoPay
              </p>
            </div>
          </div>

          {/* Details Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs">
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
              <span className="text-gray-400 font-semibold block mb-1">Lunch Delivery Slot</span>
              <span className="font-bold text-gray-800 text-sm">12:00 PM - 1:30 PM</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
              <span className="text-gray-400 font-semibold block mb-1">Dinner Delivery Slot</span>
              <span className="font-bold text-gray-800 text-sm">7:00 PM - 8:30 PM</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
              <span className="text-gray-400 font-semibold block mb-1">Delivery Address</span>
              <span className="font-bold text-gray-800 text-sm truncate block">RS Puram, Coimbatore</span>
            </div>
          </div>

          {/* Pause / Resume Actions */}
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
            {subscription?.status === 'paused' ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-amber-700 font-bold bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                  Paused until {subscription.pausedUntil || 'next week'}
                </span>
                <button
                  onClick={handleConfirmResume}
                  className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2 rounded-xl tap-active"
                >
                  Resume Now
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsPauseModalOpen(true)}
                className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold px-4 py-2.5 rounded-xl tap-active flex items-center gap-1.5"
              >
                <PauseCircle className="w-4 h-4" />
                <span>Pause Subscription</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <Link
                href="/plans"
                className="text-xs font-bold text-primary hover:underline px-3 py-2"
              >
                Change Plan Tier
              </Link>
              <button
                onClick={() => setIsCancelModalOpen(true)}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 px-3 py-2"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>

        {/* Benefits & Guarantees */}
        <div className="bg-primary-light/40 border border-primary/20 rounded-3xl p-6 flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-0.5" />
          <div className="text-xs text-primary-dark">
            <h4 className="font-heading font-bold text-sm text-gray-900 mb-1">
              Zero Lock-In Guarantee
            </h4>
            <p className="leading-relaxed">
              Going out of station from Coimbatore? You can pause your plan for up to 30 days without any fee. Unused days are credited automatically to your MuscleGrow wallet.
            </p>
          </div>
        </div>
      </div>

      {/* Pause Modal */}
      {isPauseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="font-heading font-black text-lg text-gray-900">
                Pause Your Subscription
              </h3>
              <button onClick={() => setIsPauseModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <p className="text-xs text-gray-500 my-4 leading-relaxed">
              Select how many days you would like to pause. Your deliveries will resume automatically and your billing date will be postponed.
            </p>

            <div className="grid grid-cols-3 gap-2.5 mb-6">
              {[3, 7, 14].map((days) => (
                <button
                  key={days}
                  onClick={() => setPauseDays(days)}
                  className={cn(
                    "py-3 rounded-2xl border text-xs font-bold transition-all",
                    pauseDays === days
                      ? "bg-primary text-white border-primary"
                      : "bg-gray-50 text-gray-700 border-gray-200"
                  )}
                >
                  {days} Days
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirmPause}
              className="w-full bg-primary text-white font-bold text-sm py-3 rounded-xl shadow-md tap-active"
            >
              Confirm {pauseDays}-Day Pause
            </button>
          </div>
        </div>
      )}

      {/* Cancel Questionnaire Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="font-heading font-black text-lg text-gray-900">
                Cancel Subscription
              </h3>
              <button onClick={() => setIsCancelModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <p className="text-xs text-gray-500 my-4">
              We are sorry to see you go! Please let us know why you are cancelling so we can improve our kitchen:
            </p>

            <div className="space-y-2 mb-6">
              {[
                'Travelling or relocating from Coimbatore',
                'Too much food / Portions too big',
                'Need different macro ratios',
                'Budget or temporary pause needed',
                'Cooking at home again',
              ].map((reason) => (
                <button
                  key={reason}
                  onClick={() => setCancelReason(reason)}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border text-xs font-medium transition-all",
                    cancelReason === reason
                      ? "border-primary bg-primary-light/30 text-primary font-bold"
                      : "border-gray-200 hover:bg-gray-50 text-gray-700"
                  )}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="w-1/2 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                Keep My Plan
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={!cancelReason}
                className="w-1/2 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold shadow-md"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
