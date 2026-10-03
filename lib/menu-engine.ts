import overridesData from '@/data/overrides.json';

export type DietType = 'non-veg' | 'veg';
export type Allergen = 'Peanut' | 'Gluten' | 'Dairy' | 'Egg' | 'Soy' | 'Fish';

export interface PortionMacros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  weightG: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'main' | 'protein-side' | 'salad' | 'legume' | 'carb';
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  allergens: Allergen[];
  description: string;
  image: string;
}

export interface BoxMeal {
  slot: 'lunch' | 'dinner';
  items: {
    main: MenuItem;
    proteinSide: MenuItem;
    salad: MenuItem;
    legume: MenuItem;
    carb: MenuItem;
  };
  itemArray: MenuItem[];
  totals: PortionMacros;
  allergens: Allergen[];
  hasPeanut: boolean;
}

export interface DailyMenuResult {
  date: string; // YYYY-MM-DD
  dayOfWeek: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  dayName: string;
  operatingDayIndex: number;
  isClosed: boolean;
  closedReason?: string;
  diet: DietType;
  dietTag: string;
  lunch: BoxMeal;
  dinner: BoxMeal;
  labVerifiedNote: string;
}

// ==========================================
// ITEM CATALOG POOLS (Gramwise Standard Portions)
// ==========================================

export const CHICKEN_MAINS: MenuItem[] = [
  {
    id: 'c-malabar-pepper',
    name: 'Malabar Pepper Chicken Breast',
    category: 'main',
    grams: 150,
    calories: 215,
    protein: 31,
    carbs: 3,
    fat: 7,
    fiber: 1,
    allergens: [],
    description: 'Lean chicken breast seared with Tellicherry black pepper, shallots, and fresh curry leaves.',
    image: '/daily-trial/butter-garlic-chicken.png',
  },
  {
    id: 'c-tandoori-roast',
    name: 'Tandoori Spiced Roasted Chicken',
    category: 'main',
    grams: 150,
    calories: 220,
    protein: 32,
    carbs: 2,
    fat: 7,
    fiber: 1,
    allergens: [],
    description: 'Slow-roasted chicken breast rubbed with degi mirch, kasuri methi, and cold-pressed mustard oil.',
    image: '/daily-trial/tandoori.png',
  },
  {
    id: 'c-andhra-chilli',
    name: 'Andhra Chilli Herb Chicken',
    category: 'main',
    grams: 150,
    calories: 210,
    protein: 31,
    carbs: 3,
    fat: 8,
    fiber: 1,
    allergens: [],
    description: 'Pan-seared tender chicken infused with green bird’s eye chillies, fresh coriander, and ginger.',
    image: '/daily-trial/peri-peri.png',
  },
  {
    id: 'c-chettinad-roast',
    name: 'Chettinad Masala Dry Roast Chicken',
    category: 'main',
    grams: 150,
    calories: 225,
    protein: 30,
    carbs: 4,
    fat: 8.5,
    fiber: 1.5,
    allergens: [],
    description: 'Stone-ground kalpasi, fennel, and coriander dry-roasted with lean diced chicken breast.',
    image: '/daily-trial/chetinad.png',
  },
  {
    id: 'c-lemon-garlic',
    name: 'Lemon Garlic Rosemary Chicken Tenders',
    category: 'main',
    grams: 150,
    calories: 205,
    protein: 32,
    carbs: 2,
    fat: 6.5,
    fiber: 0.5,
    allergens: [],
    description: 'Zesty lemon zest and crushed garlic seared over high heat with garden rosemary sprigs.',
    image: '/daily-trial/lemon-herb.png',
  },
];

export const FISH_MAIN: MenuItem = {
  id: 'f-coastal-grilled',
  name: 'Coastal Grilled Lemon Pepper Fish',
  category: 'main',
  grams: 140,
  calories: 195,
  protein: 28,
  carbs: 1,
  fat: 6,
  fiber: 0,
  allergens: ['Fish'],
  description: 'Fresh ocean catch fillet grilled over cold-pressed coconut oil with crushed black pepper and lime.',
  image: '/daily-trial/spicy-fish.png',
};

export const VEG_MAINS: MenuItem[] = [
  {
    id: 'v-soya-sukka',
    name: 'Kerala Soya Chunks Sukka Bhurji',
    category: 'main',
    grams: 120,
    calories: 185,
    protein: 24,
    carbs: 12,
    fat: 3.5,
    fiber: 5,
    allergens: ['Soy'],
    description: 'High-density textured soya chunks hand-pulled and roasted with shallots, curry leaf, and cracked pepper.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'v-paneer-tikka',
    name: 'Smoked Paneer Tikka with Capsicum',
    category: 'main',
    grams: 120,
    calories: 245,
    protein: 20,
    carbs: 6,
    fat: 14,
    fiber: 2,
    allergens: ['Dairy'],
    description: 'Fresh Malabar cottage cheese blocks seared with tri-color capsicum and roasted cumin.',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'v-herb-tofu',
    name: 'Pan-Seared Herb Organic Tofu',
    category: 'main',
    grams: 130,
    calories: 175,
    protein: 18,
    carbs: 5,
    fat: 8.5,
    fiber: 3,
    allergens: ['Soy'],
    description: 'Non-GMO firm organic tofu seared with toasted sesame seeds and cold-pressed mustard oil.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
  },
];

export const PROTEIN_SIDES: Record<DietType, MenuItem> = {
  'non-veg': {
    id: 'ps-egg-whites',
    name: '3 Farm-Fresh Boiled Egg Whites',
    category: 'protein-side',
    grams: 90,
    calories: 51,
    protein: 11,
    carbs: 0.7,
    fat: 0.2,
    fiber: 0,
    allergens: ['Egg'],
    description: 'Clean grade-A boiled egg whites, seasoned with a pinch of pink Himalayan rock salt.',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80',
  },
  'veg': {
    id: 'ps-hung-curd',
    name: 'Fresh Hung Curd Cup (100g)',
    category: 'protein-side',
    grams: 100,
    calories: 98,
    protein: 10,
    carbs: 4,
    fat: 4.5,
    fiber: 0,
    allergens: ['Dairy'],
    description: 'Slow-strained A2 probiotic curd whipped smooth with roasted cumin and crushed mint.',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
  },
};

export const SALADS: MenuItem[] = [
  {
    id: 's-moong-pom',
    name: 'Sprouted Moong & Pomegranate Salad',
    category: 'salad',
    grams: 80,
    calories: 80,
    protein: 4,
    carbs: 15,
    fat: 0.5,
    fiber: 3.5,
    allergens: [],
    description: 'Crisp green sprouts with ruby pomegranate jewels and lemon-coriander dressing.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 's-cucumber-flax',
    name: 'Crunchy Cucumber & Carrot Flaxseed Slaw',
    category: 'salad',
    grams: 80,
    calories: 65,
    protein: 2,
    carbs: 9,
    fat: 2.5,
    fiber: 3,
    allergens: [],
    description: 'Julienned polyhouse cucumbers and sweet carrots tossed with roasted golden flaxseeds.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 's-beet-mint',
    name: 'Roasted Beetroot & Mint Kachumber',
    category: 'salad',
    grams: 80,
    calories: 60,
    protein: 1.8,
    carbs: 13,
    fat: 0.3,
    fiber: 3.2,
    allergens: [],
    description: 'Steamed cubed Nilgiri beetroot with torn garden mint, chaat spices, and fresh lime.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 's-cabbage-sesame',
    name: 'Purple Cabbage & Toasted Sesame Salad',
    category: 'salad',
    grams: 80,
    calories: 70,
    protein: 2.2,
    carbs: 7,
    fat: 3.5,
    fiber: 2.8,
    allergens: [],
    description: 'Fine-shredded purple and green cabbage with cold-pressed sesame oil and toasted sesame.',
    image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 's-tomato-greens',
    name: 'Cherry Tomato & Herb Greens Crunch',
    category: 'salad',
    grams: 80,
    calories: 55,
    protein: 2,
    carbs: 10,
    fat: 0.8,
    fiber: 2.5,
    allergens: [],
    description: 'Plump cherry tomatoes, cucumber coins, and peppery greens in lime-pepper reduction.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
  },
];

export const LEGUMES: MenuItem[] = [
  {
    id: 'l-white-channa',
    name: 'Boiled White Channa Sundal',
    category: 'legume',
    grams: 100,
    calories: 140,
    protein: 7.5,
    carbs: 22,
    fat: 2.5,
    fiber: 6.5,
    allergens: [],
    description: 'Kabuli garbanzo chickpeas boiled tender and tempered with mustard seeds and curry leaves.',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'l-brown-channa',
    name: 'Boiled Brown Kala Channa Masala',
    category: 'legume',
    grams: 100,
    calories: 135,
    protein: 7,
    carbs: 21,
    fat: 2,
    fiber: 7,
    allergens: [],
    description: 'High-fiber indigenous black chickpea tossed with grated ginger, cumin, and mild green chillies.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'l-rajma',
    name: 'Simmered Rajma (Kidney Beans) Toss',
    category: 'legume',
    grams: 100,
    calories: 130,
    protein: 8.5,
    carbs: 22,
    fat: 0.8,
    fiber: 6.8,
    allergens: [],
    description: 'Slow-cooked red kidney beans tossed lightly with diced tomato, shallots, and amchur.',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'l-peanut-corn',
    name: 'Steamed Peanut & Sweet Corn Sundal',
    category: 'legume',
    grams: 90,
    calories: 165,
    protein: 6.5,
    carbs: 14,
    fat: 9,
    fiber: 4.5,
    allergens: ['Peanut'],
    description: 'Boiled raw groundnuts and sweet corn kernels tempered with hing, mustard seeds, and fresh coconut.',
    image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'l-green-moong',
    name: 'Boiled Sprouted Green Moong Sundal',
    category: 'legume',
    grams: 100,
    calories: 115,
    protein: 7.5,
    carbs: 19,
    fat: 0.6,
    fiber: 7.2,
    allergens: [],
    description: 'Whole green gram sprouted and steamed with cracked pepper, ginger slivers, and lemon juice.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'l-lobia',
    name: 'Boiled Black-Eyed Peas (Lobia) Sundal',
    category: 'legume',
    grams: 100,
    calories: 125,
    protein: 8,
    carbs: 20,
    fat: 1.5,
    fiber: 6,
    allergens: [],
    description: 'Tender cowpeas seasoned South-Indian style with cold-pressed coconut oil, mustard, and curry leaves.',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'l-double-beans',
    name: 'Boiled Mixed Double Beans & Seeds',
    category: 'legume',
    grams: 100,
    calories: 145,
    protein: 7.5,
    carbs: 18,
    fat: 4.5,
    fiber: 5.5,
    allergens: [],
    description: 'Creamy double beans tossed with steamed pumpkin seeds and roasted cumin.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
  },
];

export const CARBS: MenuItem[] = [
  {
    id: 'cb-phulkas',
    name: '2 Whole Wheat Soft Phulkas',
    category: 'carb',
    grams: 60,
    calories: 150,
    protein: 4.8,
    carbs: 30,
    fat: 1,
    fiber: 4,
    allergens: ['Gluten'],
    description: 'Stone-ground 100% whole wheat phulkas puffed over open flame with zero added fat.',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'cb-ragi-dosa',
    name: '2 Multigrain Ragi Millet Dosas',
    category: 'carb',
    grams: 70,
    calories: 155,
    protein: 4.2,
    carbs: 31,
    fat: 1.8,
    fiber: 4.5,
    allergens: [],
    description: 'Slow-fermented finger millet and urad dal batter crisped lightly in cold-pressed sesame oil.',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'cb-masala-oats',
    name: 'Steel-Cut Masala Oats Bowl',
    category: 'carb',
    grams: 120,
    calories: 145,
    protein: 5,
    carbs: 26,
    fat: 2.5,
    fiber: 5,
    allergens: [],
    description: 'Whole steel-cut oat groats simmered with turmeric, crushed pepper, and diced french beans.',
    image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'cb-red-rice',
    name: 'Steamed Kerala Red Matta Rice',
    category: 'carb',
    grams: 130,
    calories: 155,
    protein: 3.5,
    carbs: 33,
    fat: 0.8,
    fiber: 3.5,
    allergens: [],
    description: 'Unpolished double-boiled Palakkad matta red rice with intact nutrient bran layer.',
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'cb-oats-phulka',
    name: '2 Oats & Flaxseed Chapatis',
    category: 'carb',
    grams: 65,
    calories: 155,
    protein: 5.2,
    carbs: 28,
    fat: 2.5,
    fiber: 4.8,
    allergens: ['Gluten'],
    description: 'Whole wheat blended with powdered rolled oats and crushed roasted flaxseed meal.',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'cb-millet-pulao',
    name: 'Barnyard Millet (Kuthiraivali) Pulao',
    category: 'carb',
    grams: 130,
    calories: 140,
    protein: 3.8,
    carbs: 29,
    fat: 1.2,
    fiber: 4,
    allergens: [],
    description: 'Ancient low-glycemic barnyard millet steamed with whole spices and mint leaves.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'cb-brown-dosa',
    name: '2 Brown Rice & Lentil Dosas',
    category: 'carb',
    grams: 70,
    calories: 160,
    protein: 4.5,
    carbs: 31,
    fat: 2,
    fiber: 3.5,
    allergens: [],
    description: 'Wholesome fermented unpolished brown rice and protein-rich dal homestyle crisp dosas.',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
  },
];

// ==========================================
// PRICING MATRIX
// ==========================================

export const PRICING = {
  trial: {
    'non-veg': 299,
    'veg': 279,
  },
  weekly: {
    'non-veg': 279,
    'veg': 259,
  },
  monthly: {
    'non-veg': 269,
    'veg': 249,
  },
  secondMealDiscount: 10, // second meal per day is -₹10
};

// ==========================================
// DATE & OPERATING DAY CALCULATION
// ==========================================

// Anchor date: Monday, Jan 5, 2026 (epoch = week 0, day 0)
const ANCHOR_EPOCH = new Date(Date.UTC(2026, 0, 5, 0, 0, 0));

export function parseDate(d: Date | string): Date {
  if (typeof d === 'string') {
    const parts = d.split('T')[0].split('-');
    if (parts.length === 3) {
      return new Date(Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 12, 0, 0));
    }
  }
  return new Date(d);
}

export function formatDateToYMD(d: Date): string {
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getISOWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/**
 * Calculates the Mon-Sat operating day index since anchor epoch.
 * Sunday returns null since it is not an operating day.
 */
export function getOperatingDayInfo(targetDate: Date) {
  const d = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate(), 12, 0, 0));
  const dayOfWeekNumber = d.getUTCDay(); // 0 = Sun, 1 = Mon ... 6 = Sat

  if (dayOfWeekNumber === 0) {
    return {
      isClosed: true,
      dayOfWeek: 'Sun' as const,
      dayName: 'Sunday',
      operatingDayIndex: -1,
      operatingDayInWeek: -1,
      weekNumber: getISOWeekNumber(d),
      chickenDayCounter: -1,
    };
  }

  // Operating days are Mon (1) to Sat (6) -> map to 0 to 5
  const operatingDayInWeek = dayOfWeekNumber - 1; // 0..5

  // Total weeks difference from anchor
  const diffDays = Math.floor((d.getTime() - ANCHOR_EPOCH.getTime()) / 86400000);
  const diffWeeks = Math.floor(diffDays / 7);
  const operatingDayIndex = (diffWeeks * 6) + operatingDayInWeek;

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayAbbrs: Array<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'> = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Non-Wed chicken counter: Mon=0, Tue=1, Thu=2, Fri=3, Sat=4. (Wed is fish)
  let chickenDayCounter = 0;
  if (operatingDayInWeek === 0) chickenDayCounter = 0; // Mon
  else if (operatingDayInWeek === 1) chickenDayCounter = 1; // Tue
  else if (operatingDayInWeek === 2) chickenDayCounter = -1; // Wed (Fish)
  else if (operatingDayInWeek === 3) chickenDayCounter = 2; // Thu
  else if (operatingDayInWeek === 4) chickenDayCounter = 3; // Fri
  else if (operatingDayInWeek === 5) chickenDayCounter = 4; // Sat

  return {
    isClosed: false,
    dayOfWeek: dayAbbrs[operatingDayInWeek],
    dayName: dayNames[operatingDayInWeek],
    operatingDayIndex,
    operatingDayInWeek,
    weekNumber: getISOWeekNumber(d),
    chickenDayCounter,
  };
}

// ==========================================
// PURE FUNCTION: getMenuForDate(date, diet)
// ==========================================

export function getMenuForDate(dateInput: Date | string, diet: DietType = 'non-veg'): DailyMenuResult {
  const dateObj = parseDate(dateInput);
  const dateStr = formatDateToYMD(dateObj);
  const opInfo = getOperatingDayInfo(dateObj);

  const labVerifiedNote = 'All macros are estimated from USDA and NIN standard food composition tables. Digital kitchen weighed. Lab verification pending.';

  if (opInfo.isClosed) {
    // Sunday default empty meal fallback
    const emptyMeal: BoxMeal = {
      slot: 'lunch',
      items: {
        main: CHICKEN_MAINS[0],
        proteinSide: PROTEIN_SIDES[diet],
        salad: SALADS[0],
        legume: LEGUMES[0],
        carb: CARBS[0],
      },
      itemArray: [CHICKEN_MAINS[0], PROTEIN_SIDES[diet], SALADS[0], LEGUMES[0], CARBS[0]],
      totals: { calories: 0, protein: 0, carbs: 0, fat: 0, weightG: 0 },
      allergens: [],
      hasPeanut: false,
    };

    return {
      date: dateStr,
      dayOfWeek: 'Sun',
      dayName: 'Sunday',
      operatingDayIndex: -1,
      isClosed: true,
      closedReason: 'Gramwise Kitchen is closed on Sundays for deep sanitisation. Delivery operates Monday to Saturday.',
      diet,
      dietTag: diet === 'non-veg' ? 'High-Protein Non-Veg' : 'High-Protein Veg',
      lunch: emptyMeal,
      dinner: { ...emptyMeal, slot: 'dinner' },
      labVerifiedNote,
    };
  }

  const idx = Math.abs(opInfo.operatingDayIndex);
  const weekNum = opInfo.weekNumber;
  const dayInWeek = opInfo.operatingDayInWeek;

  // 1. Salad = idx mod 5
  const lunchSaladIdx = idx % SALADS.length;

  // 2. Legume = idx mod 7
  const lunchLegumeIdx = idx % LEGUMES.length;

  // 3. Carb = idx mod 7
  const lunchCarbIdx = idx % CARBS.length;

  // 4. Main Protein:
  let lunchMain: MenuItem;
  if (diet === 'non-veg') {
    if (dayInWeek === 2) {
      // Wednesday is Fish!
      lunchMain = FISH_MAIN;
    } else {
      // (chickenDayCounter + weekNumber) mod 5
      const chickenIdx = Math.abs(opInfo.chickenDayCounter + weekNum) % CHICKEN_MAINS.length;
      lunchMain = CHICKEN_MAINS[chickenIdx];
    }
  } else {
    // Veg main cycles soya, paneer, tofu twice a week, shifted one slot weekly
    const vegIdx = Math.abs(dayInWeek + weekNum) % VEG_MAINS.length;
    lunchMain = VEG_MAINS[vegIdx];
  }

  // 5. Protein Side
  const lunchProteinSide = PROTEIN_SIDES[diet];

  // 6. Dinner Box (2-meal plans)
  // "Dinner box (2-meal plans) = same main as lunch with salad +2, legume +3, carb +3."
  const dinnerSaladIdx = (lunchSaladIdx + 2) % SALADS.length;
  const dinnerLegumeIdx = (lunchLegumeIdx + 3) % LEGUMES.length;
  const dinnerCarbIdx = (lunchCarbIdx + 3) % CARBS.length;

  let lunchItems = {
    main: lunchMain,
    proteinSide: lunchProteinSide,
    salad: SALADS[lunchSaladIdx],
    legume: LEGUMES[lunchLegumeIdx],
    carb: CARBS[lunchCarbIdx],
  };

  let dinnerItems = {
    main: lunchMain, // same main as lunch
    proteinSide: lunchProteinSide,
    salad: SALADS[dinnerSaladIdx],
    legume: LEGUMES[dinnerLegumeIdx],
    carb: CARBS[dinnerCarbIdx],
  };

  // Check Admin Overrides map from /data/overrides.json
  const overrides = (overridesData as any)?.overrides || {};
  if (overrides[dateStr]) {
    const override = overrides[dateStr];
    if (override.lunchMainId) {
      const allMains = [...CHICKEN_MAINS, FISH_MAIN, ...VEG_MAINS];
      const match = allMains.find((m) => m.id === override.lunchMainId);
      if (match) lunchItems.main = match;
    }
    if (override.lunchSaladId) {
      const match = SALADS.find((s) => s.id === override.lunchSaladId);
      if (match) lunchItems.salad = match;
    }
    if (override.lunchLegumeId) {
      const match = LEGUMES.find((l) => l.id === override.lunchLegumeId);
      if (match) lunchItems.legume = match;
    }
    if (override.lunchCarbId) {
      const match = CARBS.find((c) => c.id === override.lunchCarbId);
      if (match) lunchItems.carb = match;
    }

    if (override.dinnerMainId) {
      const allMains = [...CHICKEN_MAINS, FISH_MAIN, ...VEG_MAINS];
      const match = allMains.find((m) => m.id === override.dinnerMainId);
      if (match) dinnerItems.main = match;
    }
    if (override.dinnerSaladId) {
      const match = SALADS.find((s) => s.id === override.dinnerSaladId);
      if (match) dinnerItems.salad = match;
    }
    if (override.dinnerLegumeId) {
      const match = LEGUMES.find((l) => l.id === override.dinnerLegumeId);
      if (match) dinnerItems.legume = match;
    }
    if (override.dinnerCarbId) {
      const match = CARBS.find((c) => c.id === override.dinnerCarbId);
      if (match) dinnerItems.carb = match;
    }
  }

  // Calculate totals and allergens helper
  const computeMeal = (slot: 'lunch' | 'dinner', items: typeof lunchItems): BoxMeal => {
    const itemArray = [items.main, items.proteinSide, items.salad, items.legume, items.carb];
    const totals: PortionMacros = {
      calories: itemArray.reduce((acc, it) => acc + it.calories, 0),
      protein: itemArray.reduce((acc, it) => acc + it.protein, 0),
      carbs: itemArray.reduce((acc, it) => acc + it.carbs, 0),
      fat: itemArray.reduce((acc, it) => acc + it.fat, 0),
      fiber: itemArray.reduce((acc, it) => acc + (it.fiber || 0), 0),
      weightG: itemArray.reduce((acc, it) => acc + it.grams, 0),
    };

    const allergenSet = new Set<Allergen>();
    itemArray.forEach((it) => {
      it.allergens.forEach((a) => allergenSet.add(a));
    });

    const allergens = Array.from(allergenSet);
    const hasPeanut = allergens.includes('Peanut');

    return {
      slot,
      items,
      itemArray,
      totals,
      allergens,
      hasPeanut,
    };
  };

  const lunch = computeMeal('lunch', lunchItems);
  const dinner = computeMeal('dinner', dinnerItems);

  return {
    date: dateStr,
    dayOfWeek: opInfo.dayOfWeek,
    dayName: opInfo.dayName,
    operatingDayIndex: opInfo.operatingDayIndex,
    isClosed: false,
    diet,
    dietTag: diet === 'non-veg' ? 'High-Protein Non-Veg' : 'High-Protein Veg',
    lunch,
    dinner,
    labVerifiedNote,
  };
}

// ==========================================
// HELPER: Earliest Open Date & Next Open Days
// ==========================================

export function getEarliestBookableDate(nowInput?: Date) {
  // Cutoff is 9:00 PM (21:00) IST previous night
  const now = nowInput || new Date();
  
  // Convert now to local IST representation or work in local time
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const isPast9PM = currentHour > 21 || (currentHour === 21 && currentMinutes >= 0);

  // If before 9PM, tomorrow is the candidate date.
  // If at/after 9PM, day after tomorrow is candidate date.
  const candidate = new Date(now);
  if (isPast9PM) {
    candidate.setDate(candidate.getDate() + 2);
  } else {
    candidate.setDate(candidate.getDate() + 1);
  }

  // If candidate is Sunday, skip to Monday!
  if (candidate.getDay() === 0) {
    candidate.setDate(candidate.getDate() + 1);
  }

  const dateStr = formatDateToYMD(candidate);

  // Compute cutoff time for this bookable date:
  // Cutoff is 9:00 PM on the day immediately preceding the bookable date.
  const cutoffTime = new Date(candidate);
  cutoffTime.setDate(cutoffTime.getDate() - 1);
  cutoffTime.setHours(21, 0, 0, 0);

  // Check if candidate date is tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = formatDateToYMD(tomorrow) === dateStr;

  return {
    date: candidate,
    dateStr,
    isTomorrow,
    isCutoffPassed: isPast9PM,
    cutoffTime,
    formatted: candidate.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }),
  };
}

export function getNextBookableDays(count = 6, startFromDate?: Date) {
  const earliest = getEarliestBookableDate(startFromDate);
  const days: Array<{
    date: Date;
    dateStr: string;
    dayOfWeek: string;
    dayName: string;
    formatted: string;
    isEarliest: boolean;
  }> = [];

  let cursor = new Date(earliest.date);
  while (days.length < count) {
    if (cursor.getDay() !== 0) {
      // Mon-Sat
      const dateStr = formatDateToYMD(cursor);
      days.push({
        date: new Date(cursor),
        dateStr,
        dayOfWeek: cursor.toLocaleDateString('en-IN', { weekday: 'short' }),
        dayName: cursor.toLocaleDateString('en-IN', { weekday: 'long' }),
        formatted: cursor.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        isEarliest: days.length === 0,
      });
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

// Next week Mon-Sat days generator
export function getNextWeekOperatingDays(baseDate?: Date) {
  const now = baseDate || new Date();
  // Find upcoming Monday
  const day = now.getDay(); // 0 is Sunday, 1 is Monday ...
  const daysUntilMonday = day === 0 ? 1 : (8 - day);
  
  const monday = new Date(now);
  monday.setDate(now.getDate() + daysUntilMonday);

  const days: Array<{
    date: Date;
    dateStr: string;
    dayOfWeek: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
    dayName: string;
    formatted: string;
  }> = [];

  const dayAbbrs: Array<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'> = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 0; i < 6; i++) {
    const cur = new Date(monday);
    cur.setDate(monday.getDate() + i);
    days.push({
      date: cur,
      dateStr: formatDateToYMD(cur),
      dayOfWeek: dayAbbrs[i],
      dayName: cur.toLocaleDateString('en-IN', { weekday: 'long' }),
      formatted: cur.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    });
  }

  return days;
}

// Monthly operating days generator (24 operating days = 4 weeks of Mon-Sat)
export function getMonthlyOperatingDays(baseDate?: Date) {
  const now = baseDate || new Date();
  const day = now.getDay();
  const daysUntilMonday = day === 0 ? 1 : (8 - day);
  
  const startMonday = new Date(now);
  startMonday.setDate(now.getDate() + daysUntilMonday);

  const days: Array<{
    date: Date;
    dateStr: string;
    dayOfWeek: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
    dayName: string;
    formatted: string;
    weekNumber: number;
    weekIndex: number; // 0..3
  }> = [];

  const dayAbbrs: Array<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'> = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  let cursor = new Date(startMonday);
  let weekIndex = 0;
  let dayInWeekCount = 0;

  while (days.length < 24) {
    if (cursor.getDay() !== 0) {
      days.push({
        date: new Date(cursor),
        dateStr: formatDateToYMD(cursor),
        dayOfWeek: dayAbbrs[dayInWeekCount],
        dayName: cursor.toLocaleDateString('en-IN', { weekday: 'long' }),
        formatted: cursor.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        weekNumber: getISOWeekNumber(cursor),
        weekIndex,
      });
      dayInWeekCount++;
      if (dayInWeekCount === 6) {
        dayInWeekCount = 0;
        weekIndex++;
      }
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}
