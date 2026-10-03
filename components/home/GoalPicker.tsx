'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { GoalType } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { Flame, Dumbbell, Activity, HeartHandshake, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function GoalPicker() {
  const router = useRouter();
  const { setUser } = useAppStore();

  const goals: {
    type: GoalType;
    title: string;
    subtitle: string;
    targetProtein: string;
    caloriesRange: string;
    colorBg: string;
    borderColor: string;
    icon: React.ElementType;
    iconColor: string;
  }[] = [
    {
      type: 'fat-loss',
      title: 'Fat Loss',
      subtitle: 'Calorie-deficit meals with high protein to burn fat while sparing lean muscle.',
      targetProtein: '70g - 90g',
      caloriesRange: '1200 - 1500 kcal',
      colorBg: 'hover:bg-orange-50/60',
      borderColor: 'hover:border-orange-300',
      icon: Flame,
      iconColor: 'text-orange-500 bg-orange-100',
    },
    {
      type: 'muscle-gain',
      title: 'Muscle Gain',
      subtitle: 'High-protein surplus with clean carbs and amino acids for rapid strength building.',
      targetProtein: '90g - 130g+',
      caloriesRange: '1900 - 2400 kcal',
      colorBg: 'hover:bg-emerald-50/60',
      borderColor: 'hover:border-emerald-300',
      icon: Dumbbell,
      iconColor: 'text-emerald-600 bg-emerald-100',
    },
    {
      type: 'stay-fit',
      title: 'Stay Fit & Energetic',
      subtitle: 'Balanced home-style nutrition for busy professionals to conquer long workdays.',
      targetProtein: '50g - 70g',
      caloriesRange: '1500 - 1800 kcal',
      colorBg: 'hover:bg-blue-50/60',
      borderColor: 'hover:border-blue-300',
      icon: Activity,
      iconColor: 'text-blue-600 bg-blue-100',
    },
    {
      type: 'elderly-care',
      title: 'Elderly Parents Care',
      subtitle: 'Soft, easily chewable, rock-salt measured meals designed for diabetes and digestion.',
      targetProtein: '35g - 45g',
      caloriesRange: '1300 - 1600 kcal',
      colorBg: 'hover:bg-rose-50/60',
      borderColor: 'hover:border-rose-300',
      icon: HeartHandshake,
      iconColor: 'text-rose-500 bg-rose-100',
    },
  ];

  const handleSelectGoal = (goal: GoalType) => {
    setUser({ goal });
    router.push(`/build-plan?goal=${goal}`);
  };

  return (
    <section className="py-14 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-3 py-1 rounded-full">
            Step 1: Your Mission
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-gray-900 mt-2">
            What is your health goal?
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            Select your primary objective. Our engine will automatically tune your meal sizes and macro ratios.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {goals.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.type}
                onClick={() => handleSelectGoal(item.type)}
                className={cn(
                  "cursor-pointer bg-white rounded-2xl p-6 border border-gray-200/90 shadow-card transition-all duration-300 flex flex-col justify-between tap-active group",
                  item.colorBg,
                  item.borderColor
                )}
              >
                <div>
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", item.iconColor)}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-heading font-extrabold text-xl text-gray-900 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-gray-400 font-medium">Daily Protein:</span>
                    <span className="font-bold text-gray-800">{item.targetProtein}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-gray-400 font-medium">Daily Calories:</span>
                    <span className="font-bold text-gray-800">{item.caloriesRange}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                    <span>Pre-fill plan</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
