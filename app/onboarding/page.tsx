'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { calculateMacros } from '@/lib/macro-calculator';
import { GoalType } from '@/types';
import {
  Flame,
  Dumbbell,
  Target,
  ShieldCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MapPin,
  Clock,
  Utensils,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setUser } = useAppStore();

  const [step, setStep] = useState<number>(1);

  // Form State
  const [goal, setGoal] = useState<GoalType>(user.goal || 'muscle-gain');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(user.gender || 'male');
  const [weightKg, setWeightKg] = useState<number>(user.weightKg || 70);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(user.targetWeightKg || 73);
  const [heightCm, setHeightCm] = useState<number>(user.heightCm || 172);
  const [age, setAge] = useState<number>(user.age || 27);
  const [activityLevel, setActivityLevel] = useState(user.activityLevel || 'moderately-active');
  const [dietType, setDietType] = useState<'veg' | 'non-veg' | 'eggetarian'>(user.dietType || 'non-veg');
  const [allergies, setAllergies] = useState<string[]>(user.allergies || []);
  const [mealsPerDay, setMealsPerDay] = useState<1 | 2>(user.mealsPerDay || 2);
  const [pincode, setPincode] = useState<string>('641002');

  const progressPct = step * 20;

  const toggleAllergy = (a: string) => {
    if (allergies.includes(a)) {
      setAllergies(allergies.filter((x) => x !== a));
    } else {
      setAllergies([...allergies, a]);
    }
  };

  const handleFinish = () => {
    const calc = calculateMacros({
      gender,
      age,
      weightKg,
      heightCm,
      activityLevel,
      goal,
    });

    setUser({
      goal,
      gender,
      weightKg,
      targetWeightKg,
      heightCm,
      age,
      activityLevel,
      dietType,
      allergies,
      mealsPerDay,
      calculatedTargets: {
        calories: calc.targetCalories,
        protein: calc.proteinG,
        carbs: calc.carbsG,
        fat: calc.fatG,
      },
      isOnboarded: true,
    });

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-2">
            <span className="uppercase tracking-wider">Step {step} of 5</span>
            <span>{progressPct}% Completed</span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-xl">
          {/* STEP 1: Health Goal */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-2.5 py-1 rounded-md">
                  Nutrition Objective
                </span>
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-gray-900 mt-2">
                  What is your primary fitness goal?
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  We calibrate your daily calories and macro split based on your target.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    id: 'fat-loss',
                    title: 'Fat Loss & Cutting',
                    desc: 'Calorie deficit with high protein to shred fat and preserve muscle.',
                    icon: Flame,
                    color: 'text-orange-500 bg-orange-100',
                  },
                  {
                    id: 'muscle-gain',
                    title: 'Muscle Gain & Bulking',
                    desc: 'Calorie surplus with high protein for maximum hypertrophy.',
                    icon: Dumbbell,
                    color: 'text-emerald-600 bg-emerald-100',
                  },
                  {
                    id: 'stay-fit',
                    title: 'Stay Fit & High Energy',
                    desc: 'Clean balanced maintenance nutrition for busy working days.',
                    icon: Target,
                    color: 'text-blue-600 bg-blue-100',
                  },
                  {
                    id: 'elderly-care',
                    title: 'Elderly Parents Care',
                    desc: 'Soft, easily chewable, rock-salt measured meals for senior parents.',
                    icon: ShieldCheck,
                    color: 'text-rose-500 bg-rose-100',
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = goal === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setGoal(item.id as GoalType)}
                      className={cn(
                        "cursor-pointer p-4 rounded-2xl border-2 transition-all tap-active flex items-start gap-3.5",
                        isSelected
                          ? "border-primary bg-primary-light/20 ring-2 ring-primary/20 shadow-sm"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", item.color)}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-sm text-gray-900">{item.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Body Metrics */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-2.5 py-1 rounded-md">
                  Body Parameters
                </span>
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-gray-900 mt-2">
                  Tell us about your body
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Required to calculate your BMR and Total Daily Energy Expenditure (TDEE).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                    Gender
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['male', 'female', 'other'] as const).map((gen) => (
                      <button
                        key={gen}
                        type="button"
                        onClick={() => setGender(gen)}
                        className={cn(
                          "py-2.5 rounded-xl text-xs font-bold capitalize border transition-all",
                          gender === gen
                            ? "bg-primary text-white border-primary"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                        )}
                      >
                        {gen}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                    Current Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                    Target Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={targetWeightKg}
                    onChange={(e) => setTargetWeightKg(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                    Age (years)
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                    Physical Activity Level
                  </label>
                  <select
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 focus:outline-none focus:border-primary"
                  >
                    <option value="sedentary">Sedentary (desk job, mostly sitting)</option>
                    <option value="lightly-active">Lightly active (walking, workout 1-2 days)</option>
                    <option value="moderately-active">Moderately active (gym/sports 3-5 days)</option>
                    <option value="very-active">Very active (daily athletic training)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Diet Type */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-2.5 py-1 rounded-md">
                  Dietary Identity
                </span>
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-gray-900 mt-2">
                  What type of diet do you follow?
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Vegetarian dishes use paneer, dals, and millets. Non-veg dishes use farm poultry and wild fish.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {[
                  {
                    id: 'veg',
                    title: '100% Pure Vegetarian',
                    desc: 'Fresh paneer, sprouted kollu, tri-dal, soya, vegetables, and millets. Strictly zero meat or egg.',
                    badge: 'Veg Kitchen Area',
                  },
                  {
                    id: 'eggetarian',
                    title: 'Eggetarian (Veg + Eggs)',
                    desc: 'All vegetarian dishes plus boiled farm egg whites, pepper omelettes, and moringa egg scrambles.',
                    badge: 'High Lean Protein',
                  },
                  {
                    id: 'non-veg',
                    title: 'Non-Vegetarian',
                    desc: 'Kongu country chicken, Chettinad grilled cuts, sea bass, red snapper, plus all vegetarian specials.',
                    badge: 'Maximum Variety',
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setDietType(item.id as any)}
                    className={cn(
                      "cursor-pointer p-5 rounded-2xl border-2 transition-all tap-active flex items-center justify-between",
                      dietType === item.id
                        ? "border-primary bg-primary-light/20 ring-2 ring-primary/20 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading font-bold text-base text-gray-900">{item.title}</h4>
                        <span className="text-[10px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                    </div>

                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0",
                      dietType === item.id ? "border-primary bg-primary text-white" : "border-gray-300"
                    )}>
                      {dietType === item.id && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Allergies & Intolerances */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-2.5 py-1 rounded-md">
                  Allergen Protection
                </span>
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-gray-900 mt-2">
                  Do you have any food allergies?
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Select all that apply. Any dish containing these ingredients will never be scheduled.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  'Milk / Dairy',
                  'Tree Nuts',
                  'Peanuts',
                  'Gluten',
                  'Eggs',
                  'Soy',
                  'Mustard',
                  'Fish / Seafood',
                ].map((allergen) => {
                  const active = allergies.includes(allergen);
                  return (
                    <button
                      key={allergen}
                      type="button"
                      onClick={() => toggleAllergy(allergen)}
                      className={cn(
                        "p-3 rounded-2xl border text-xs font-bold transition-all tap-active flex items-center justify-between",
                        active
                          ? "bg-rose-50 border-rose-300 text-rose-700 ring-2 ring-rose-200"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <span>{allergen}</span>
                      {active ? (
                        <span className="text-rose-600 font-extrabold">✕</span>
                      ) : (
                        <span className="text-gray-300 font-normal">+</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {allergies.length === 0 && (
                <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 border border-emerald-200">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No allergies selected. You have access to all weekly protein boxes and sides on the menu!</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Meals per Day & Location */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-2.5 py-1 rounded-md">
                  Delivery Details
                </span>
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-gray-900 mt-2">
                  Choose your daily routine
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Delivered 6 days a week (Monday to Saturday) across Coimbatore.
                </p>
              </div>

              {/* Meals per day */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setMealsPerDay(1)}
                  className={cn(
                    "cursor-pointer p-4 rounded-2xl border-2 transition-all tap-active",
                    mealsPerDay === 1
                      ? "border-primary bg-primary-light/20 ring-2 ring-primary/20"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <span className="font-heading font-bold text-base text-gray-900">1 Meal / Day</span>
                  <p className="text-xs text-gray-500 mt-1">Lunch OR Dinner delivered hot to your location.</p>
                  <p className="text-xs font-bold text-primary mt-2">₹275 / meal on subscription</p>
                </div>

                <div
                  onClick={() => setMealsPerDay(2)}
                  className={cn(
                    "cursor-pointer p-4 rounded-2xl border-2 transition-all tap-active",
                    mealsPerDay === 2
                      ? "border-primary bg-primary-light/20 ring-2 ring-primary/20"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-base text-gray-900">2 Meals / Day</span>
                    <span className="text-[10px] font-bold bg-lime-brand text-primary-dark px-2 py-0.5 rounded-full">
                      Most Popular
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Both Lunch & Dinner delivered fresh in separate slots.</p>
                  <p className="text-xs font-bold text-emerald-700 mt-2">₹250 / meal on subscription</p>
                </div>
              </div>

              {/* Pincode */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                  Coimbatore Delivery Pincode
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <MapPin className="w-4 h-4 text-primary absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="e.g. 641002"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-900 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none"
                    />
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2.5 rounded-xl">
                    ✓ Deliverable
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 py-2 px-3 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md flex items-center gap-2 tap-active"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="bg-cta hover:bg-cta-hover text-white font-black text-sm px-7 py-3.5 rounded-2xl shadow-lg shadow-cta/25 hover:shadow-xl flex items-center gap-2 tap-active"
              >
                <Sparkles className="w-4 h-4" />
                <span>Save Profile & Open Dashboard</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
