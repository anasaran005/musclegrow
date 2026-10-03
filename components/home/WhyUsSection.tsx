import React from 'react';
import Image from 'next/image';
import { Scale, HeartHandshake, ShieldCheck, Flame, Clock, Stethoscope } from 'lucide-react';

export function WhyUsSection() {
  const points = [
    {
      icon: Scale,
      title: 'Real Measured Macros',
      description: 'We do not guess nutrition. Raw ingredients are measured on digital commercial scales, ensuring protein and calorie counts you can rely on.',
    },
    {
      icon: HeartHandshake,
      title: 'Kongu Home-Style Flavours',
      description: 'Zero bland boiled food. We cook using hand-pounded shallots, black pepper, moringa leaves, and cold-pressed sesame oil. Tastes like home.',
    },
    {
      icon: Stethoscope,
      title: 'Pharmacist-Designed Formulations',
      description: 'Founded with clinical pharmaceutical backing. Every recipe is balanced for low glycemic index, gentle digestion, and cardiovascular protection.',
    },
    {
      icon: Clock,
      title: 'Punctual Coimbatore Delivery',
      description: 'Hot delivery to offices and homes in RS Puram, Race Course, Peelamedu, Gandhipuram, Saravanampatti, and surrounding suburbs.',
    },
  ];

  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Founder Note & Clinical Philosophy */}
          <div className="lg:col-span-5 bg-gradient-to-br from-primary-dark via-primary to-[#063318] text-white p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Scale className="w-32 h-32" />
            </div>

            <div className="flex items-center gap-2 text-lime-brand text-xs font-bold uppercase tracking-wider mb-4">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Founder & Clinical Note</span>
            </div>

            <h3 className="font-heading font-black text-2xl sm:text-3xl text-white leading-snug">
              "Diet food fails when you can't stick to it for 6 months."
            </h3>

            <p className="text-sm text-gray-200 mt-4 leading-relaxed">
              As a healthcare professional in Coimbatore, I saw hundreds of people struggle with diabetes, fatty liver, and gym plateaus. People tried crash diets, bland boiled broccoli, or restaurant food masquerading as healthy.
            </p>

            <p className="text-sm text-gray-200 mt-3 leading-relaxed">
              We started MuscleGrow to give Coimbatore honest food: the comfort of rasam, millets, Chettinad spices, and country chicken, but with every gram of protein and calorie measured on the label.
            </p>

            <div className="pt-6 mt-6 border-t border-white/15 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-lime-brand flex items-center justify-center font-heading font-black text-lg text-lime-brand">
                DR
              </div>
              <div>
                <p className="font-heading font-bold text-base text-white">Dr. Vigneshwaran K.</p>
                <p className="text-xs text-lime-brand font-medium">Pharm.D • Founder & Clinical Nutritionist</p>
                <p className="text-[11px] text-gray-400">Coimbatore Central Kitchen</p>
              </div>
            </div>
          </div>

          {/* Right: 4 Pillar Points */}
          <div className="lg:col-span-7 space-y-6">
            <div className="mb-6">
              <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                Why Choose Us
              </span>
              <h2 className="font-heading font-black text-3xl sm:text-4xl text-gray-900 mt-2">
                Nutrition you can see, taste you can enjoy
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {points.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.title} className="p-5 rounded-2xl bg-background border border-gray-100 hover:border-primary/30 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-primary text-lime-brand flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-heading font-bold text-base text-gray-900">
                      {p.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
