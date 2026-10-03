import React from 'react';
import { BRAND } from '@/config/brand';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background py-14 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-gray-900 pb-4 border-b border-gray-100">
          Refund & Cancellation Policy
        </h1>
        <p className="text-gray-500 text-xs">Last updated: October 2026 • {BRAND.legalName}</p>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-gray-900">1. Pause & Unused Meal Credits</h2>
          <p>
            Subscribers can pause their subscription anytime with 1 tap in the app before the 9:00 PM cutoff. Any paused or skipped days are automatically rolled forward or credited to your account balance for future billing cycles.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-gray-900">2. Early Subscription Cancellation</h2>
          <p>
            If you relocate from Coimbatore or wish to terminate your plan early, your remaining unserved days will be refunded to your original payment method (or bank account) after deducting meals already cooked and delivered at the pro-rata subscription rate.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-gray-900">3. Quality or Spill Complaints</h2>
          <p>
            In the rare event of transit damage, packaging seal failure, or dish dissatisfaction, please notify our WhatsApp concierge (+91 98765 43210) with a photo within 2 hours of delivery. We will promptly issue an instant replacement or 100% meal refund.
          </p>
        </section>
      </div>
    </div>
  );
}
