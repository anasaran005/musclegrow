import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  progress: number; // 0 to 100+
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  label?: string;
  value?: string | number;
  subValue?: string;
  className?: string;
}

export function ProgressRing({
  progress,
  size = 110,
  strokeWidth = 10,
  color = "#16A34A",
  bgColor = "#E5E7EB",
  label,
  value,
  subValue,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Cap visual circle at 100% or allow slightly more with stroke dash
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;

  return (
    <div className={cn("relative inline-flex flex-col items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Progress bar */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>

      {/* Center text content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
        {value !== undefined && (
          <span className="font-heading font-extrabold text-gray-900 leading-none" style={{ fontSize: size * 0.18 }}>
            {value}
          </span>
        )}
        {label && (
          <span className="text-[10px] uppercase font-bold tracking-tight text-gray-500 mt-0.5">
            {label}
          </span>
        )}
        {subValue && (
          <span className="text-[9px] font-medium text-gray-400 leading-tight">
            {subValue}
          </span>
        )}
      </div>
    </div>
  );
}
