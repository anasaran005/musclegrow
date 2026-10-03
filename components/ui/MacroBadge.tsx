import React from 'react';
import { cn } from '@/lib/utils';
import { MacroType } from '@/types';

interface MacroBadgeProps {
  type: MacroType;
  value: number;
  unit?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function MacroBadge({
  type,
  value,
  unit,
  size = 'md',
  showLabel = true,
  className,
}: MacroBadgeProps) {
  const configs = {
    protein: {
      label: 'Protein',
      defaultUnit: 'g',
      colorText: 'text-emerald-700',
      colorBg: 'bg-emerald-50/90',
      colorBorder: 'border-emerald-200',
      dotColor: 'bg-emerald-500',
    },
    carbs: {
      label: 'Carbs',
      defaultUnit: 'g',
      colorText: 'text-amber-700',
      colorBg: 'bg-amber-50/90',
      colorBorder: 'border-amber-200',
      dotColor: 'bg-amber-500',
    },
    fat: {
      label: 'Fat',
      defaultUnit: 'g',
      colorText: 'text-purple-700',
      colorBg: 'bg-purple-50/90',
      colorBorder: 'border-purple-200',
      dotColor: 'bg-purple-500',
    },
    calories: {
      label: 'Calories',
      defaultUnit: 'kcal',
      colorText: 'text-orange-700',
      colorBg: 'bg-orange-50/90',
      colorBorder: 'border-orange-200',
      dotColor: 'bg-orange-500',
    },
  };

  const c = configs[type];
  const displayUnit = unit ?? c.defaultUnit;

  if (size === 'sm') {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-semibold border",
          c.colorBg,
          c.colorText,
          c.colorBorder,
          className
        )}
      >
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", c.dotColor)} />
        <span>
          {value}
          <span className="text-[9px] font-normal ml-0.5 opacity-80">{displayUnit}</span>
        </span>
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-3 rounded-2xl border shadow-sm transition-transform",
          c.colorBg,
          c.colorBorder,
          className
        )}
      >
        <span className={cn("text-xs font-semibold uppercase tracking-wider", c.colorText)}>
          {c.label}
        </span>
        <div className="flex items-baseline gap-0.5 mt-0.5">
          <span className={cn("text-2xl font-black font-heading tracking-tight", c.colorText)}>
            {value}
          </span>
          <span className={cn("text-xs font-semibold", c.colorText, "opacity-75")}>
            {displayUnit}
          </span>
        </div>
      </div>
    );
  }

  // Medium (standard tile)
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border",
        c.colorBg,
        c.colorText,
        c.colorBorder,
        className
      )}
    >
      <span className={cn("w-2 h-2 rounded-full shrink-0", c.dotColor)} />
      {showLabel && <span className="opacity-75 font-medium">{c.label}:</span>}
      <span className="font-bold">
        {value}
        <span className="text-[10px] font-normal ml-0.5 opacity-80">{displayUnit}</span>
      </span>
    </div>
  );
}
