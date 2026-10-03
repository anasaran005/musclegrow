import { GoalType } from "@/types";

export interface MacroCalculationInput {
  gender: 'male' | 'female' | 'other';
  age: number;
  weightKg: number;
  heightCm: number;
  activityLevel: 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active';
  goal: GoalType;
}

export interface MacroTargetResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  waterLiters: number;
  explanation: string;
}

export function calculateMacros(input: MacroCalculationInput): MacroTargetResult {
  const { gender, age, weightKg, heightCm, activityLevel, goal } = input;

  // 1. Mifflin-St Jeor BMR
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') {
    bmr += 5;
  } else if (gender === 'female') {
    bmr -= 161;
  } else {
    bmr -= 78;
  }

  // 2. TDEE with Activity Multiplier
  const activityFactors = {
    sedentary: 1.2,
    'lightly-active': 1.375,
    'moderately-active': 1.55,
    'very-active': 1.725,
  };
  const factor = activityFactors[activityLevel] || 1.375;
  const tdee = Math.round(bmr * factor);

  // 3. Goal adjustment & protein multiplier
  let targetCalories = tdee;
  let proteinPerKg = 1.6;
  let explanation = "";

  switch (goal) {
    case 'fat-loss':
      targetCalories = Math.max(1200, Math.round(tdee - 400));
      proteinPerKg = 1.9; // higher protein spares muscle in deficit
      explanation = "Moderate 400 kcal deficit with high protein to protect lean muscle.";
      break;
    case 'muscle-gain':
      targetCalories = Math.round(tdee + 350);
      proteinPerKg = 2.1;
      explanation = "Clean 350 kcal surplus with high protein for muscle synthesis.";
      break;
    case 'elderly-care':
      targetCalories = Math.round(Math.min(tdee, 1600));
      proteinPerKg = 1.2;
      explanation = "Soft, easy-to-digest homestyle nutrition with balanced gentle protein.";
      break;
    case 'stay-fit':
    default:
      targetCalories = tdee;
      proteinPerKg = 1.5;
      explanation = "Iso-caloric maintenance to sustain energy and muscle tone.";
      break;
  }

  // Gram targets
  const proteinG = Math.round(weightKg * proteinPerKg);
  const proteinCalories = proteinG * 4;

  // Fat: ~25% of total calories
  const fatCalories = targetCalories * 0.25;
  const fatG = Math.round(fatCalories / 9);

  // Carbs: remaining calories
  const remainingCalories = Math.max(0, targetCalories - proteinCalories - fatCalories);
  const carbsG = Math.round(remainingCalories / 4);

  // Water recommendation: ~35ml per kg
  const waterLiters = Number((weightKg * 0.035).toFixed(1));

  return {
    bmr: Math.round(bmr),
    tdee,
    targetCalories,
    proteinG,
    carbsG,
    fatG,
    waterLiters,
    explanation,
  };
}
