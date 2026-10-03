import React from 'react';
import { BRAND } from '@/config/brand';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-14 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-gray-900 pb-4 border-b border-gray-100">
          Terms of Service
        </h1>
        <p className="text-gray-500 text-xs">Last updated: October 2026 • {BRAND.legalName}</p>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-gray-900">1. Subscription & Deliveries</h2>
          <p>
            {BRAND.name} provides weekly and monthly prepared meal subscriptions delivered exclusively across designated pincodes within Coimbatore, Tamil Nadu. Deliveries take place Monday through Saturday between 12:00 PM - 1:30 PM (Lunch) and 7:00 PM - 8:30 PM (Dinner).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-gray-900">2. Meal Cutoff & Swaps</h2>
          <p>
            Subscribers may modify, swap, or pause upcoming meals up until 9:00 PM of the evening prior to the scheduled delivery date. Changes requested after this cutoff cannot be accommodated due to fresh raw ingredient procurement and early morning kitchen prep.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-gray-900">3. Nutritional Disclosure & Medical Disclaimer</h2>
          <p>
            All calories, protein, carbohydrates, and fat numbers presented on our labels and platform are carefully calculated estimations derived from raw ingredient weighing and standard nutritional databases (NIN / USDA). While we strive for extreme precision (typically within ±5-8% natural agricultural variation), meals are not intended to diagnose, treat, or cure any medical disease.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-gray-900">4. Food Allergies</h2>
          <p>
            While our menu platform strictly filters dishes based on your indicated allergies, our central kitchen in RS Puram handles multiple ingredients including dairy, nuts, mustard, and eggs. Customers with life-threatening anaphylactic sensitivities must exercise personal discretion.
          </p>
        </section>
      </div>
    </div>
  );
}
