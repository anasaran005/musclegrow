import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  DayOfWeek,
  MealSlot,
  UserProfile,
  PlanTier,
  Address,
  Coupon,
  Subscription,
  Box,
  SideBox,
  AddonDrink,
  DayBoxConfig,
  TrialOrderConfig,
  WeeklyOrderConfig,
  MonthlyOrderConfig,
} from '@/types';
import boxesData from '@/data/boxes.json';
import sidesData from '@/data/sides.json';
import addonsData from '@/data/addons.json';
import plansData from '@/data/plans.json';

const defaultProfile: UserProfile = {
  id: "user-1",
  phone: "9876543210",
  fullName: "Mohammed Anas",
  email: "anas@example.com",
  goal: "muscle-gain",
  gender: "male",
  age: 26,
  weightKg: 72,
  targetWeightKg: 75,
  heightCm: 175,
  activityLevel: "moderately-active",
  dietType: "non-veg",
  allergies: [],
  dislikedIngredients: [],
  mealsPerDay: 1,
  selectedDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  calculatedTargets: {
    calories: 2250,
    protein: 145,
    carbs: 260,
    fat: 65,
  },
  isOnboarded: true,
};

const defaultAddress: Address = {
  id: "addr-1",
  name: "Mohammed Anas",
  phone: "+91 98421 23456",
  tag: "Home",
  flatNumber: "Flat 4B, Green Acres",
  street: "East Sambandam Road",
  landmark: "Near Avila Convent",
  area: "RS Puram",
  pincode: "641002",
  city: "Coimbatore",
  isDefault: true,
};

const initialDayConfigs: Record<DayOfWeek, DayBoxConfig> = {
  Mon: { day: 'Mon', boxId: 'box-mon', boxCount: 1, isEggFree: false, skipLegume: false, doubleMain: false, selectedSides: [], selectedDrinks: [] },
  Tue: { day: 'Tue', boxId: 'box-tue', boxCount: 1, isEggFree: false, skipLegume: false, doubleMain: false, selectedSides: [], selectedDrinks: [] },
  Wed: { day: 'Wed', boxId: 'box-wed', boxCount: 1, isEggFree: false, skipLegume: false, doubleMain: false, selectedSides: [], selectedDrinks: [] },
  Thu: { day: 'Thu', boxId: 'box-thu', boxCount: 1, isEggFree: false, skipLegume: false, doubleMain: false, selectedSides: [], selectedDrinks: [] },
  Fri: { day: 'Fri', boxId: 'box-fri', boxCount: 1, isEggFree: false, skipLegume: false, doubleMain: false, selectedSides: [], selectedDrinks: [] },
  Sat: { day: 'Sat', boxId: 'box-sat', boxCount: 1, isEggFree: false, skipLegume: false, doubleMain: false, selectedSides: [], selectedDrinks: [] },
};

interface AppState {
  // Auth & Profile
  isLoggedIn: boolean;
  user: UserProfile;
  setUser: (profile: Partial<UserProfile>) => void;
  login: (phone: string) => void;
  logout: () => void;

  // New Box & Schedule Rotation State
  mealsPerDay: 1 | 2;
  setMealsPerDay: (count: 1 | 2) => void;
  selectedDays: DayOfWeek[];
  setSelectedDays: (days: DayOfWeek[]) => void;
  toggleDay: (day: DayOfWeek) => void;
  dayConfigs: Record<DayOfWeek, DayBoxConfig>;
  setDayConfig: (day: DayOfWeek, updates: Partial<DayBoxConfig>) => void;
  toggleDayEggFree: (day: DayOfWeek) => void;
  toggleDaySkipLegume: (day: DayOfWeek) => void;
  toggleDayDoubleMain: (day: DayOfWeek) => void;
  toggleSideForDay: (day: DayOfWeek, sideId: string) => void;
  toggleDrinkForDay: (day: DayOfWeek, drinkId: string) => void;
  setDayBoxCount: (day: DayOfWeek, count: 1 | 2) => void;

  // Bundles
  hasWeeklyJuiceBundle: boolean;
  setWeeklyJuiceBundle: (enabled: boolean) => void;
  hasWeeklySideBundle: boolean;
  setWeeklySideBundle: (enabled: boolean) => void;

  // Subscription Tier & Billing
  selectedTier: PlanTier;
  setSelectedTier: (tier: PlanTier) => void;
  billingCycle: 'weekly' | 'monthly';
  setBillingCycle: (cycle: 'weekly' | 'monthly') => void;
  paymentMode: 'prepaid' | 'autopay';
  setPaymentMode: (mode: 'prepaid' | 'autopay') => void;

  // Checkout & Delivery Details
  deliverySlotLunch: string;
  deliverySlotDinner: string;
  setDeliverySlotLunch: (slot: string) => void;
  setDeliverySlotDinner: (slot: string) => void;
  addresses: Address[];
  selectedAddressId: string;
  addAddress: (address: Address) => void;
  setSelectedAddressId: (id: string) => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon | null) => void;

  // Navigation drawer state
  isNavDrawerOpen: boolean;
  setNavDrawerOpen: (open: boolean) => void;

  // Subscription state
  subscription: Subscription | null;
  pauseSubscription: (days: number) => void;
  resumeSubscription: () => void;
  cancelSubscription: (reason: string) => void;

  // Rotating 5-Item Box Checkout State
  activeCheckoutType: 'trial' | 'weekly' | 'monthly' | 'custom' | 'plan';
  setActiveCheckoutType: (type: 'trial' | 'weekly' | 'monthly' | 'custom' | 'plan') => void;
  trialOrder: TrialOrderConfig | null;
  setTrialOrder: (order: TrialOrderConfig | null) => void;
  weeklyOrder: WeeklyOrderConfig | null;
  setWeeklyOrder: (order: WeeklyOrderConfig | null) => void;
  monthlyOrder: MonthlyOrderConfig | null;
  setMonthlyOrder: (order: MonthlyOrderConfig | null) => void;

  // Computed Calculation Helpers
  getPlanMealCount: () => number;
  getPlanBasePrice: () => number;
  getPlanTotalWeeklyPrice: () => number;
  getSingleDaySurcharge: () => number;
  getDailyBox: (day: DayOfWeek) => Box;
  getDailyTotals: (day: DayOfWeek) => { calories: number; protein: number; carbs: number; fat: number };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isLoggedIn: true,
      user: defaultProfile,
      setUser: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } })),
      login: (phone: string) =>
        set((state) => ({
          isLoggedIn: true,
          user: { ...state.user, phone },
        })),
      logout: () => set({ isLoggedIn: false }),

      isNavDrawerOpen: false,
      setNavDrawerOpen: (open: boolean) => set({ isNavDrawerOpen: open }),

      mealsPerDay: 1,
      setMealsPerDay: (count) =>
        set((state) => {
          const updated = { ...state.dayConfigs };
          (Object.keys(updated) as DayOfWeek[]).forEach((d) => {
            updated[d] = { ...updated[d], boxCount: count };
          });
          return { mealsPerDay: count, dayConfigs: updated };
        }),

      selectedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      setSelectedDays: (days) => set({ selectedDays: days }),
      toggleDay: (day) =>
        set((state) => {
          const exists = state.selectedDays.includes(day);
          const next = exists
            ? state.selectedDays.filter((d) => d !== day)
            : [...state.selectedDays, day];
          return { selectedDays: next.length === 0 ? [day] : next };
        }),

      dayConfigs: initialDayConfigs,
      setDayConfig: (day, updates) =>
        set((state) => ({
          dayConfigs: {
            ...state.dayConfigs,
            [day]: {
              ...state.dayConfigs[day],
              ...updates,
            },
          },
        })),

      toggleDayEggFree: (day) =>
        set((state) => ({
          dayConfigs: {
            ...state.dayConfigs,
            [day]: {
              ...state.dayConfigs[day],
              isEggFree: !state.dayConfigs[day]?.isEggFree,
            },
          },
        })),

      toggleDaySkipLegume: (day) =>
        set((state) => ({
          dayConfigs: {
            ...state.dayConfigs,
            [day]: {
              ...state.dayConfigs[day],
              skipLegume: !state.dayConfigs[day]?.skipLegume,
            },
          },
        })),

      toggleDayDoubleMain: (day) =>
        set((state) => ({
          dayConfigs: {
            ...state.dayConfigs,
            [day]: {
              ...state.dayConfigs[day],
              doubleMain: !state.dayConfigs[day]?.doubleMain,
            },
          },
        })),

      toggleSideForDay: (day, sideId) =>
        set((state) => {
          const current = state.dayConfigs[day]?.selectedSides || [];
          const next = current.includes(sideId)
            ? current.filter((id) => id !== sideId)
            : [...current, sideId];
          return {
            dayConfigs: {
              ...state.dayConfigs,
              [day]: {
                ...state.dayConfigs[day],
                selectedSides: next,
              },
            },
          };
        }),

      toggleDrinkForDay: (day, drinkId) =>
        set((state) => {
          const current = state.dayConfigs[day]?.selectedDrinks || [];
          const next = current.includes(drinkId)
            ? current.filter((id) => id !== drinkId)
            : [...current, drinkId];
          return {
            dayConfigs: {
              ...state.dayConfigs,
              [day]: {
                ...state.dayConfigs[day],
                selectedDrinks: next,
              },
            },
          };
        }),

      setDayBoxCount: (day, count) =>
        set((state) => ({
          dayConfigs: {
            ...state.dayConfigs,
            [day]: {
              ...state.dayConfigs[day],
              boxCount: count,
            },
          },
        })),

      hasWeeklyJuiceBundle: false,
      setWeeklyJuiceBundle: (enabled) => set({ hasWeeklyJuiceBundle: enabled }),
      hasWeeklySideBundle: false,
      setWeeklySideBundle: (enabled) => set({ hasWeeklySideBundle: enabled }),

      selectedTier: plansData[0] as PlanTier,
      setSelectedTier: (tier) =>
        set((state) => {
          const updated = { ...state.dayConfigs };
          (Object.keys(updated) as DayOfWeek[]).forEach((d) => {
            updated[d] = { ...updated[d], boxCount: tier.mealsPerDay };
          });
          return { selectedTier: tier, mealsPerDay: tier.mealsPerDay, dayConfigs: updated };
        }),

      billingCycle: 'weekly',
      setBillingCycle: (cycle) => set({ billingCycle: cycle }),
      paymentMode: 'autopay',
      setPaymentMode: (mode) => set({ paymentMode: mode }),

      deliverySlotLunch: "12:00 PM - 1:30 PM",
      deliverySlotDinner: "7:00 PM - 8:30 PM",
      setDeliverySlotLunch: (slot) => set({ deliverySlotLunch: slot }),
      setDeliverySlotDinner: (slot) => set({ deliverySlotDinner: slot }),

      addresses: [defaultAddress],
      selectedAddressId: "addr-1",
      addAddress: (address) =>
        set((state) => ({ addresses: [...state.addresses, address] })),
      setSelectedAddressId: (id) => set({ selectedAddressId: id }),

      appliedCoupon: null,
      applyCoupon: (coupon) => set({ appliedCoupon: coupon }),

      subscription: {
        id: "sub-9021",
        planId: "plan-6day-weekly",
        planName: "6-Day Weekly Protein Plan",
        status: "active",
        billingCycle: "weekly",
        paymentMode: "autopay",
        mealsPerDay: 1,
        currentWeekStart: "Mon, 6 Oct",
        nextBillingDate: "Sun, 12 Oct",
        pricePerCycle: 1532,
        pausedUntil: null,
        addressId: "addr-1",
        deliverySlotLunch: "12:00 PM - 1:30 PM",
        deliverySlotDinner: "7:00 PM - 8:30 PM",
      },
      pauseSubscription: (days: number) =>
        set((state) => {
          if (!state.subscription) return state;
          const returnDate = new Date();
          returnDate.setDate(returnDate.getDate() + days);
          return {
            subscription: {
              ...state.subscription,
              status: "paused",
              pausedUntil: returnDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
            },
          };
        }),
      resumeSubscription: () =>
        set((state) => {
          if (!state.subscription) return state;
          return {
            subscription: {
              ...state.subscription,
              status: "active",
              pausedUntil: null,
            },
          };
        }),
      cancelSubscription: (reason: string) =>
        set((state) => {
          if (!state.subscription) return state;
          return {
            subscription: {
              ...state.subscription,
              status: "cancelled",
              cancelReason: reason,
            },
          };
        }),

      // Rotating 5-Item Box Checkout State
      activeCheckoutType: 'trial',
      setActiveCheckoutType: (type) => set({ activeCheckoutType: type }),
      trialOrder: null,
      setTrialOrder: (order) => set({ trialOrder: order, activeCheckoutType: 'trial' }),
      weeklyOrder: null,
      setWeeklyOrder: (order) => set({ weeklyOrder: order, activeCheckoutType: 'weekly' }),
      monthlyOrder: null,
      setMonthlyOrder: (order) => set({ monthlyOrder: order, activeCheckoutType: 'monthly' }),

      getPlanMealCount: () => {
        const { selectedDays, dayConfigs } = get();
        let total = 0;
        selectedDays.forEach((d) => {
          const cfg = dayConfigs[d];
          total += cfg ? cfg.boxCount : 1;
        });
        return total;
      },

      getSingleDaySurcharge: () => {
        const { selectedDays } = get();
        return selectedDays.length === 1 ? 30 : 0;
      },

      getDailyBox: (day: DayOfWeek) => {
        const boxes = boxesData as Box[];
        return boxes.find((b) => b.day === day) || boxes[0];
      },

      getPlanBasePrice: () => {
        const { selectedDays, dayConfigs } = get();
        const boxes = boxesData as Box[];
        const sides = sidesData as SideBox[];
        const addons = addonsData as AddonDrink[];

        let sum = 0;
        selectedDays.forEach((day) => {
          const cfg = dayConfigs[day];
          const box = boxes.find((b) => b.day === day) || boxes[0];
          const count = cfg ? cfg.boxCount : 1;
          sum += box.price * count;

          if (cfg?.doubleMain) {
            sum += 80 * count;
          }

          if (cfg?.selectedSides) {
            cfg.selectedSides.forEach((sideId) => {
              const s = sides.find((item) => item.id === sideId);
              if (s) sum += s.price;
            });
          }

          if (cfg?.selectedDrinks) {
            cfg.selectedDrinks.forEach((drinkId) => {
              const d = addons.find((item) => item.id === drinkId);
              if (d) sum += d.price;
            });
          }
        });
        return sum;
      },

      getPlanTotalWeeklyPrice: () => {
        const {
          selectedDays,
          dayConfigs,
          billingCycle,
          hasWeeklyJuiceBundle,
          hasWeeklySideBundle,
          getSingleDaySurcharge,
        } = get();
        const boxes = boxesData as Box[];
        const sides = sidesData as SideBox[];
        const addons = addonsData as AddonDrink[];

        let boxSubtotal = 0;
        let extrasSubtotal = 0;

        selectedDays.forEach((day) => {
          const cfg = dayConfigs[day];
          const box = boxes.find((b) => b.day === day) || boxes[0];
          const count = cfg ? cfg.boxCount : 1;
          boxSubtotal += box.price * count;

          if (cfg?.doubleMain) {
            extrasSubtotal += 80 * count;
          }

          if (cfg?.selectedSides) {
            cfg.selectedSides.forEach((sideId) => {
              const s = sides.find((item) => item.id === sideId);
              if (s) extrasSubtotal += s.price;
            });
          }

          if (cfg?.selectedDrinks) {
            cfg.selectedDrinks.forEach((drinkId) => {
              const d = addons.find((item) => item.id === drinkId);
              if (d) extrasSubtotal += d.price;
            });
          }
        });

        // Weekly discount of 9% if 6 days, or monthly 10%
        let discountRate = 0;
        if (billingCycle === 'monthly') {
          discountRate = 0.10;
        } else if (selectedDays.length >= 6) {
          discountRate = 0.09;
        }

        const discountedBoxTotal = Math.round(boxSubtotal * (1 - discountRate));
        let total = discountedBoxTotal + extrasSubtotal + getSingleDaySurcharge();

        if (hasWeeklyJuiceBundle) {
          total += 299;
        }
        if (hasWeeklySideBundle) {
          total += 999;
        }

        return total;
      },

      getDailyTotals: (day: DayOfWeek) => {
        const { dayConfigs, getDailyBox } = get();
        const cfg = dayConfigs[day];
        const box = getDailyBox(day);
        const sides = sidesData as SideBox[];
        const addons = addonsData as AddonDrink[];

        const isEggFree = cfg?.isEggFree || false;
        const boxCount = cfg?.boxCount || 1;
        const doubleMain = cfg?.doubleMain || false;

        let calories = isEggFree ? box.eggFreeVersion.calories : box.totals.calories;
        let protein = isEggFree ? box.eggFreeVersion.protein : box.totals.protein;
        let carbs = isEggFree ? box.eggFreeVersion.carbs : box.totals.carbs;
        let fat = isEggFree ? box.eggFreeVersion.fat : box.totals.fat;

        if (doubleMain) {
          calories += 180;
          protein += 24;
          fat += 6;
          carbs += 2;
        }

        calories *= boxCount;
        protein *= boxCount;
        carbs *= boxCount;
        fat *= boxCount;

        if (cfg?.selectedSides) {
          cfg.selectedSides.forEach((sideId) => {
            const s = sides.find((item) => item.id === sideId);
            if (s) {
              calories += s.calories;
              protein += s.protein;
              carbs += s.carbs;
              fat += s.fat;
            }
          });
        }

        if (cfg?.selectedDrinks) {
          cfg.selectedDrinks.forEach((drinkId) => {
            const d = addons.find((item) => item.id === drinkId);
            if (d) {
              calories += d.calories;
              protein += d.protein;
              carbs += d.carbs;
            }
          });
        }

        return { calories, protein, carbs, fat };
      },
    }),
    {
      name: 'musclegrow-storage',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        mealsPerDay: state.mealsPerDay,
        selectedDays: state.selectedDays,
        dayConfigs: state.dayConfigs,
        hasWeeklyJuiceBundle: state.hasWeeklyJuiceBundle,
        hasWeeklySideBundle: state.hasWeeklySideBundle,
        selectedTier: state.selectedTier,
        billingCycle: state.billingCycle,
        paymentMode: state.paymentMode,
        addresses: state.addresses,
        selectedAddressId: state.selectedAddressId,
        subscription: state.subscription,
        activeCheckoutType: state.activeCheckoutType,
        trialOrder: state.trialOrder,
        weeklyOrder: state.weeklyOrder,
        monthlyOrder: state.monthlyOrder,
      }),
    }
  )
);
