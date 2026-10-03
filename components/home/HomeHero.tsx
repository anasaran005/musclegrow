'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function HomeHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax calculations matching realevate.agency interaction
  const textParallaxX = scrollY * 0.45; // Accelerates background marquee horizontally on scroll
  const imageScale = Math.min(1.06, 1 + scrollY * 0.00025); // Subtle cinematic depth expansion
  const imageTranslateY = scrollY * 0.08; // Gentle depth float
  const subtextOpacity = Math.max(0, 1 - scrollY / 300);
  const scrollHintOpacity = Math.max(0, 1 - scrollY / 90);

  const marqueeItems = [1, 2, 3, 4];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EDF7F1] via-[#E1F1E6] to-[#D4EADC] text-[#14532D] min-h-[84vh] md:min-h-[90vh] flex flex-col justify-between py-6 sm:py-10 select-none border-b border-[#C8E4D3]">
      {/* Background ambient radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/70 via-transparent to-transparent pointer-events-none" />

      {/* Top micro brand meta bar: COIMBATORE and EST removed, KNOWGRAMS centered */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-center text-xs tracking-widest uppercase z-10">
        <span className="font-semibold tracking-[0.35em] text-[#14532D]/75">KNOWGRAMS</span>
      </div>

      {/* Main Stage: Center 4:3 Image with Slow Looping Marquee Moving Behind & Reacting to Scroll */}
      <div className="relative my-auto flex items-center justify-center py-6 sm:py-10">
        {/* Infinite Looping Text Marquee with Scroll Parallax */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden pointer-events-none z-0">
          <div
            className="will-change-transform"
            style={{
              transform: `translate3d(-${textParallaxX}px, 0, 0)`,
            }}
          >
            <div className="animate-marquee-slow-loop flex items-center">
              {/* Group 1 */}
              {marqueeItems.map((idx) => (
                <div key={`group1-${idx}`} className="flex items-center shrink-0">
                  <span className="font-heading font-black text-[#14532D] uppercase tracking-tight text-6xl sm:text-8xl md:text-9xl lg:text-[145px] xl:text-[165px] leading-none whitespace-nowrap">
                    YOUR DAILY PROTEIN. SORTED.
                  </span>
                  <span className="mx-8 sm:mx-14 lg:mx-20 inline-flex items-center justify-center shrink-0">
                    <span className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-[#14532D] shadow-xs inline-block" />
                  </span>
                </div>
              ))}

              {/* Group 2 (Duplicate for continuous seamless loop) */}
              {marqueeItems.map((idx) => (
                <div key={`group2-${idx}`} className="flex items-center shrink-0">
                  <span className="font-heading font-black text-[#14532D] uppercase tracking-tight text-6xl sm:text-8xl md:text-9xl lg:text-[145px] xl:text-[165px] leading-none whitespace-nowrap">
                    YOUR DAILY PROTEIN. SORTED.
                  </span>
                  <span className="mx-8 sm:mx-14 lg:mx-20 inline-flex items-center justify-center shrink-0">
                    <span className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-[#14532D] shadow-xs inline-block" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center 4:3 Aspect Ratio Image (Reduced by 2, no border) */}
        <div
          className="relative z-10 w-[50vw] max-w-[190px] sm:max-w-[240px] md:max-w-[280px] lg:max-w-[320px] aspect-[4/3] shrink-0 rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_20px_50px_-10px_rgba(20,83,45,0.25)] group transition-transform duration-75 ease-out"
          style={{
            transform: `scale(${imageScale}) translateY(${imageTranslateY}px)`,
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=85"
            alt="Freshly weighed high protein balanced bowl"
            fill
            priority
            sizes="(max-width: 768px) 50vw, 320px"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Subtle bottom vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Bottom Content Area: Subtitle, Framed Pill Button & Corner Anchors */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 z-10 pt-2 sm:pt-4">
        {/* Centered Subtitle & Bordered Price Pill */}
        <div
          className="text-center space-y-3.5 max-w-xl mx-auto transition-opacity duration-150"
          style={{ opacity: subtextOpacity }}
        >
          <p className="text-xs sm:text-sm md:text-base text-[#14532D]/85 font-medium leading-relaxed">
            Fresh homestyle meals cooked every morning in Coimbatore
            <br className="hidden sm:inline" /> digitally weighed for exact calories and protein.
          </p>

          <div>
            <Link
              href="/plans"
              className="inline-block border-2 border-[#14532D] hover:bg-[#14532D] text-[#14532D] hover:text-white px-6 sm:px-8 py-2.5 rounded-none text-xs sm:text-sm font-bold tracking-[0.25em] uppercase transition-all shadow-sm bg-white/40 backdrop-blur-xs"
            >
              STARTING FROM ₹269 / DAY
            </Link>
          </div>
        </div>

        {/* Bottom Corner Anchors */}
        <div className="flex items-center justify-between pt-6 text-xs text-[#14532D]/60 tracking-wider">
          <span
            className="font-mono text-[11px] sm:text-xs tracking-widest text-[#14532D]/70 transition-opacity duration-150"
            style={{ opacity: scrollHintOpacity }}
          >
            (Scroll)
          </span>

          <div className="flex items-center gap-2">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 border border-[#14532D]/30 hover:border-[#14532D] bg-white/70 hover:bg-white text-[#14532D] px-3.5 py-1.5 rounded-sm text-xs font-semibold tracking-wide transition-all shadow-xs"
            >
              <span>Our Menu</span>
              <span className="text-[#14532D] font-mono text-[10px]">⸬</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
