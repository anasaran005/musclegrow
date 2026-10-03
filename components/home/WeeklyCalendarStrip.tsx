'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Box, ScheduleItem } from '@/types';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { CurvedBoxCard } from '@/components/ui/CurvedBoxCard';
import { getMenuForDate, formatDateToYMD, DietType } from '@/lib/menu-engine';
import { cn } from '@/lib/utils';

interface WeeklyCalendarStripProps {
  boxes?: Box[];
  schedule?: ScheduleItem[];
}

function getWeeklyOperatingDays(): Array<{
  date: Date;
  dateStr: string;
  dayOfWeek: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
  dayName: string;
  formatted: string;
}> {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat

  // Monday of the active week cycle (if Sunday, look forward to tomorrow Monday)
  const monday = new Date(now);
  if (day === 0) {
    monday.setDate(now.getDate() + 1);
  } else {
    monday.setDate(now.getDate() - (day - 1));
  }
  monday.setHours(12, 0, 0, 0);

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

export function WeeklyCalendarStrip({ boxes, schedule }: WeeklyCalendarStripProps) {
  const [diet, setDiet] = useState<DietType>('non-veg');
  const operatingDays = useMemo(() => getWeeklyOperatingDays(), []);
  const todayStr = useMemo(() => formatDateToYMD(new Date()), []);

  return (
    <section className="py-14 sm:py-18 bg-background relative overflow-hidden text-gray-900 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading: Title on Left, Normal Toggle Button on Right */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-gray-900 tracking-tight">
              Six Dedicated Protein Boxes
            </h2>
          </div>

          {/* Normal Toggle Button near right side */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <div className="inline-flex items-center p-1 rounded-full bg-gray-100 border border-gray-200/90 shadow-2xs">
              {/* Non-Veg Button */}
              <button
                type="button"
                onClick={() => setDiet('non-veg')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all tap-active",
                  diet === 'non-veg'
                    ? "bg-white text-gray-900 shadow-xs ring-1 ring-gray-200"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                {/* Red Triangle */}
                <span className="w-3.5 h-3.5 rounded-[3px] border border-red-700 bg-white flex items-center justify-center p-[2px]">
                  <span className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[6px] border-b-red-700 inline-block" />
                </span>
                <span>Non-Veg</span>
              </button>

              {/* Veg Button */}
              <button
                type="button"
                onClick={() => setDiet('veg')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all tap-active",
                  diet === 'veg'
                    ? "bg-white text-gray-900 shadow-xs ring-1 ring-gray-200"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                {/* Green Dot */}
                <span className="w-3.5 h-3.5 rounded-[3px] border border-emerald-600 bg-white flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                </span>
                <span>Pure Veg</span>
              </button>
            </div>
          </div>
        </div>

        {/* 6 Box Cards Grid (Mon to Sat) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {operatingDays.map((day) => {
            const menu = getMenuForDate(day.date, diet);
            const isToday = day.dateStr === todayStr;

            return (
              <CurvedBoxCard
                key={`${day.dateStr}-${diet}`}
                menu={menu}
                dayInfo={day}
                diet={diet}
                isToday={isToday}
              />
            );
          })}
        </div>

        {/* Bottom Banner Linking to Weekly Subscription Plan */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-r from-[#124233] to-[#1e5845] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-lime-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Full 6-Day Routine • Mon to Sat</span>
            </div>
            <h3 className="font-heading font-black text-xl sm:text-2xl text-white">
              Want the entire week handled without ordering daily?
            </h3>
            <p className="text-gray-200 text-xs sm:text-sm">
              Subscribe to the Weekly Plan with our hassle-free Skip-a-Day policy. Discounted to ₹{diet === 'non-veg' ? 279 : 259}/day.
            </p>
          </div>

          <Link
            href="/weekly"
            className="shrink-0 bg-cta hover:bg-cta-hover text-white font-bold text-sm py-3 px-6 rounded-2xl shadow-lg shadow-cta/25 hover:scale-105 transition-all tap-active flex items-center gap-2"
          >
            <span>Explore Weekly Plan</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
