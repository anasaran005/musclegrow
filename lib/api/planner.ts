import { DayOfWeek, SideBox, Box, GoalType, DayBoxConfig } from "@/types";
import boxesData from "@/data/boxes.json";
import sidesData from "@/data/sides.json";
import scheduleData from "@/data/schedule.json";

export interface PlannerRecommendationInput {
  targetCalories: number;
  targetProtein: number;
  mealsPerDay: 1 | 2;
  selectedDays: DayOfWeek[];
  isVeg: boolean;
  activeConfigs: Record<DayOfWeek, DayBoxConfig>;
}

export interface DayRecommendation {
  day: DayOfWeek;
  boxName: string;
  currentCalories: number;
  currentProtein: number;
  calorieGap: number;
  proteinGap: number;
  recommendedSide?: SideBox;
  recommendationReason?: string;
}

export interface PlannerValidationResult {
  dayRecommendations: DayRecommendation[];
  averageDailyCalories: number;
  averageDailyProtein: number;
  targetCalories: number;
  targetProtein: number;
  calorieDiff: number;
  proteinDiff: number;
  overallStatus: 'perfect' | 'near-target' | 'low-protein' | 'high-calories';
  summaryMessage: string;
}

export function recommendSidesForTargets(input: PlannerRecommendationInput): PlannerValidationResult {
  const {
    targetCalories,
    targetProtein,
    mealsPerDay,
    selectedDays,
    isVeg,
    activeConfigs,
  } = input;

  const boxes = boxesData as Box[];
  const sides = sidesData as SideBox[];
  const eligibleSides = sides.filter((s) => (isVeg ? s.isVeg : true));

  const dayRecommendations: DayRecommendation[] = [];
  let totalWeekCalories = 0;
  let totalWeekProtein = 0;

  selectedDays.forEach((day) => {
    const config = activeConfigs[day];
    const box = boxes.find((b) => b.day === day) || boxes[0];
    const boxCount = config?.boxCount || mealsPerDay;
    const isEggFree = config?.isEggFree || isVeg;
    const doubleMain = config?.doubleMain || false;

    // Base box macros
    let boxCal = isEggFree ? box.eggFreeVersion.calories : box.totals.calories;
    let boxProt = isEggFree ? box.eggFreeVersion.protein : box.totals.protein;

    if (doubleMain) {
      boxCal += 180;
      boxProt += 24;
    }

    let dayCal = boxCal * boxCount;
    let dayProt = boxProt * boxCount;

    // Add already selected sides
    if (config?.selectedSides && config.selectedSides.length > 0) {
      config.selectedSides.forEach((sideId) => {
        const side = sides.find((s) => s.id === sideId);
        if (side) {
          dayCal += side.calories;
          dayProt += side.protein;
        }
      });
    }

    const calorieGap = targetCalories - dayCal;
    const proteinGap = targetProtein - dayProt;

    let recommendedSide: SideBox | undefined = undefined;
    let recommendationReason = "";

    // Recommend side if protein gap is >= 15g
    if (proteinGap >= 15) {
      // Find eligible side closest to the protein gap
      const candidate = [...eligibleSides].sort((a, b) => {
        const diffA = Math.abs(a.protein - proteinGap);
        const diffB = Math.abs(b.protein - proteinGap);
        return diffA - diffB;
      })[0];

      if (candidate) {
        recommendedSide = candidate;
        recommendationReason = `Add ${candidate.name} (+${candidate.protein}g protein, ${candidate.calories} kcal) to close your ${proteinGap}g protein gap for ${day}.`;
      }
    } else if (proteinGap <= -20) {
      recommendationReason = `Protein target exceeded by ${Math.abs(proteinGap)}g. High-protein fuel ready for training day.`;
    } else {
      recommendationReason = `Perfect macro alignment within 10% of daily target.`;
    }

    dayRecommendations.push({
      day,
      boxName: box.name,
      currentCalories: dayCal,
      currentProtein: dayProt,
      calorieGap,
      proteinGap,
      recommendedSide,
      recommendationReason,
    });

    totalWeekCalories += dayCal;
    totalWeekProtein += dayProt;
  });

  const activeDaysCount = Math.max(1, selectedDays.length);
  const avgCal = Math.round(totalWeekCalories / activeDaysCount);
  const avgProt = Math.round(totalWeekProtein / activeDaysCount);

  const calDiff = avgCal - targetCalories;
  const protDiff = avgProt - targetProtein;

  let overallStatus: 'perfect' | 'near-target' | 'low-protein' | 'high-calories' = 'perfect';
  let summaryMessage = "";

  if (Math.abs(calDiff) <= 120 && Math.abs(protDiff) <= 12) {
    overallStatus = 'perfect';
    summaryMessage = "Excellent! Your weekly schedule perfectly hits your Mifflin-St Jeor metabolic target.";
  } else if (protDiff < -15) {
    overallStatus = 'low-protein';
    summaryMessage = `You are running ~${Math.abs(protDiff)}g short of your daily protein target. Adding a side on lower-protein box days (Tue/Sat) is strongly recommended.`;
  } else if (calDiff > 250) {
    overallStatus = 'high-calories';
    summaryMessage = `Your plan is ~${calDiff} kcal above daily target. Consider choosing single boxes or 0-sugar drinks.`;
  } else {
    overallStatus = 'near-target';
    summaryMessage = `Very close to your targets (within ~${Math.abs(calDiff)} kcal and ~${Math.abs(protDiff)}g protein). Ready to cook.`;
  }

  return {
    dayRecommendations,
    averageDailyCalories: avgCal,
    averageDailyProtein: avgProt,
    targetCalories,
    targetProtein,
    calorieDiff: calDiff,
    proteinDiff: protDiff,
    overallStatus,
    summaryMessage,
  };
}
