'use client';

import React from 'react';
import Link from 'next/link';
import { SideBox } from '@/types';
import { Dumbbell, ArrowRight } from 'lucide-react';
import { CurvedSideCard } from '@/components/ui/CurvedSideCard';

interface AddASideSectionProps {
  sides: SideBox[];
}

export function AddASideSection({ sides }: AddASideSectionProps) {
  return (
    <section className="py-16 sm:py-20 bg-white border-t border-gray-100 text-gray-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-primary font-extrabold text-xs uppercase tracking-wider mb-2">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Protein Booster Extras</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-gray-900 tracking-tight">
              Add a Side Box to Hit Higher Protein Goals
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
              Targeting 90g–130g protein for muscle hypertrophy? Add an extra grilled chicken breast or paneer side to any box—especially on vegetarian & paneer balance days.
            </p>
          </div>

          <Link
            href="/menu"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 self-start md:self-auto"
          >
            <span>View All Extras</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {sides.map((side) => (
            <CurvedSideCard key={side.id} side={side} />
          ))}
        </div>
      </div>
    </section>
  );
}
