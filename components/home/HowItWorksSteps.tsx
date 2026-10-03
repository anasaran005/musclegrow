import React from 'react';
import Link from 'next/link';
import { BRAND } from '@/config/brand';
import { Target, ChefHat, Bike, ArrowRight } from 'lucide-react';

export function HowItWorksSteps() {
  const steps = [
    {
      step: '01',
      icon: Target,
      title: 'Tell us your goal',
      description: 'Pick Fat Loss, Muscle Gain, or Stay Fit. Set your meals per day (Lunch, Dinner, or both) and list any allergies.',
      highlight: 'Takes 60 seconds',
    },
    {
      step: '02',
      icon: ChefHat,
      title: 'We cook & weigh every gram',
      description: 'Our central kitchen in Coimbatore prepares your food daily using cold-pressed oils, fresh poultry/paneer, and millets. Every portion is digitally weighed.',
      highlight: 'Zero food wastage',
    },
    {
      step: '03',
      icon: Bike,
      title: 'Delivered fresh to your door',
      description: 'Piping hot insulated deliveries reach your desk or home in RS Puram, Peelamedu, Race Course and across Coimbatore right on time.',
      highlight: 'Free daily delivery',
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
            Simple 3-Step Routine
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-gray-900 mt-2">
            How {BRAND.name} Works
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            No grocery runs. No cooking. No guesswork on nutrition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-white rounded-3xl p-7 border border-gray-200/90 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between relative group"
              >
                {/* Step badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-heading font-black text-xl group-hover:bg-primary group-hover:text-lime-brand transition-colors">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="font-heading font-black text-3xl text-gray-200 group-hover:text-primary-light transition-colors">
                    {item.step}
                  </span>
                </div>

                <div>
                  <h3 className="font-heading font-extrabold text-xl text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-primary bg-primary-light/60 px-2.5 py-1 rounded-md">
                    {item.highlight}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-hover underline underline-offset-4"
          >
            <span>Read full details on cutoffs, meal swaps, and hygiene</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
