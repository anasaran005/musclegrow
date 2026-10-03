import { PlanTier } from "@/types";
import plansData from "@/data/plans.json";
import { sleep } from "@/lib/utils";

export async function getPlans(): Promise<PlanTier[]> {
  await sleep(100);
  return plansData as PlanTier[];
}

export async function getPlanById(id: string): Promise<PlanTier | null> {
  await sleep(80);
  const plan = (plansData as PlanTier[]).find((p) => p.id === id || p.slug === id);
  return plan || null;
}
