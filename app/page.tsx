import React from 'react';
import { getBoxes, getSchedule, getSides, getAddons } from '@/lib/api/boxes';
import { getPlans } from '@/lib/api/plans';
import { SwiggyHero } from '@/components/home/SwiggyHero';
import { WeeklyCalendarStrip } from '@/components/home/WeeklyCalendarStrip';
import { AddASideSection } from '@/components/home/AddASideSection';
import { DrinksStrip } from '@/components/home/DrinksStrip';
import { HowItWorksSteps } from '@/components/home/HowItWorksSteps';
import { WhyUsSection } from '@/components/home/WhyUsSection';
import { PlansTeaser } from '@/components/home/PlansTeaser';
import { FaqAccordion } from '@/components/home/FaqAccordion';
import { FinalCtaBand } from '@/components/home/FinalCtaBand';

export default async function HomePage() {
  const [boxes, schedule, sides, addons, plans] = await Promise.all([
    getBoxes(),
    getSchedule(),
    getSides(),
    getAddons(),
    getPlans(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Simplified Swiggy-Style Hero Section */}
      <SwiggyHero />

      {/* 3. Weekly calendar strip (Mon-Sat 6 boxes) */}
      <WeeklyCalendarStrip boxes={boxes} schedule={schedule} />

      {/* 4. "Add a side" section (6 high-protein sides) */}
      <AddASideSection sides={sides} />

      {/* 5. Drinks strip (4 cold-pressed juices with natural sugar disclosures) */}
      <DrinksStrip addons={addons} />

      {/* 6. How it works in 3 steps */}
      <HowItWorksSteps />

      {/* 7. Why us & founder doctor note */}
      <WhyUsSection />

      {/* 8. Plans teaser with weekly/monthly toggle */}
      <PlansTeaser plans={plans} />

      {/* 11. FAQ accordion */}
      <FaqAccordion />

      {/* 12. Final CTA band */}
      <FinalCtaBand />
    </div>
  );
}
