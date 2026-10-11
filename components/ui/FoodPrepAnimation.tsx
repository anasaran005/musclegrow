'use client';

import React, { useEffect, useState } from 'react';
import { Lottie } from 'lottie-react';

interface FoodPrepAnimationProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export function FoodPrepAnimation({
  className = "w-40 h-40",
  width,
  height,
}: FoodPrepAnimationProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="w-8 h-8 rounded-full border-2 border-emerald-600/30 border-t-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{
        width: width || undefined,
        height: height || undefined,
      }}
    >
      <Lottie
        src="/animation/Food prep.json"
        loop={true}
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
