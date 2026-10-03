import React from 'react';
import Link from 'next/link';
import { BRAND } from '@/config/brand';
import { Target, ChefHat, Bike, Scale, RefreshCw, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Calculate & Choose Your Plan",
      desc: "Use our built-in Mifflin-St Jeor calculator to get your clinical calorie and protein targets. Pick 1 meal/day (Lunch or Dinner) or 2 meals/day.",
      detail: "Set your dietary preferences: 100% Pure Veg, Eggetarian, or Non-Veg. Multi-select allergies to exclude.",
    },
    {
      num: "02",
      title: "Customize or Auto-Plan Meals",
      desc: "Let our smart engine generate your weekly schedule based on high-satiety millets and lean proteins, or pick each day yourself from the 24-dish menu.",
      detail: "Swap any meal with 1 tap. You can lock specific days or skip meals whenever you have social dining plans.",
    },
    {
      num: "03",
      title: "Central Kitchen Cooking & Digital Weighing",
      desc: "Every morning in RS Puram, our chefs cook using cold-pressed sesame oil, fresh chicken breast, farm paneer, and heritage grains. Portions are weighed on digital scales.",
      detail: "Heat-sealed in spill-proof, BPA-free microwave-safe trays. Labels display calories, protein, carbs, and fat.",
    },
    {
      num: "04",
      title: "Hot Delivery & Zero-Fuss Reheating",
      desc: "Delivered in insulated bags between 12:00-1:30 PM (Lunch) and 7:00-8:30 PM (Dinner) across 12 Coimbatore pincodes.",
      detail: "Microwave for 60-90 seconds or warm on a tiffin steamer. Enjoy fresh, measured home-style nutrition!",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <section className="bg-white border-b border-gray-200 py-12 md:py-16 text-center px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-3 py-1 rounded-full">
            Our Process
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-gray-900 mt-3">
            How {BRAND.name} Works
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            From raw ingredient weighing to hot doorstep delivery. Here is how we ensure every gram counts.
          </p>
        </div>
      </section>

      {/* 4 Detailed Steps */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 space-y-6">
        {steps.map((st) => (
          <div
            key={st.num}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start gap-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary text-lime-brand flex items-center justify-center font-heading font-black text-2xl shrink-0 shadow-md">
              {st.num}
            </div>

            <div className="flex-1">
              <h3 className="font-heading font-black text-xl text-gray-900">
                {st.title}
              </h3>
              <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                {st.desc}
              </p>
              <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-600">
                💡 <span className="font-semibold">{st.detail}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Cutoff & Swap Rules Card */}
        <div className="bg-primary rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-2 text-lime-brand">
            <RefreshCw className="w-5 h-5" />
            <h3 className="font-heading font-black text-lg">
              Important Cutoff & Pause Rules
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
            To ensure zero food waste and same-morning farm procurement:
          </p>
          <ul className="mt-3 space-y-2 text-xs text-gray-200 list-disc list-inside">
            <li><strong>Meal Swaps:</strong> Submit before 9:00 PM previous night for lunch/dinner.</li>
            <li><strong>Pause / Skip Days:</strong> Pause up to 30 days anytime with 1 tap in the app.</li>
            <li><strong>Sunday Kitchen Rest:</strong> We deliver Monday through Saturday (6 days a week). Sundays are dedicated to kitchen sanitization and equipment maintenance.</li>
          </ul>

          <div className="mt-6 pt-4 border-t border-white/15">
            <Link
              href="/build-plan"
              className="inline-flex items-center gap-2 bg-cta hover:bg-cta-hover text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md tap-active"
            >
              <span>Build Your Custom Plan Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
