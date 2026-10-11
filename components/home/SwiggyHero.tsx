'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Search,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { LocationSelector } from '@/components/layout/LocationSelector';

export function SwiggyHero() {
  const router = useRouter();
  const { setNavDrawerOpen } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/tomorrow');
  };

  const categoryCards = [
    {
      id: 'trial',
      title: 'DAILY TRIAL BOX',
      subtitle: 'JUST TRY IT',
      offer: 'FROM ₹289 (V) / ₹319 (NV)',
      mobileOffer: 'FROM ₹289 (V) / ₹319 (NV)',
      href: '/tomorrow',
      image: '/daily.png',
      imageAlt: 'MuscleGrow Daily Trial Box meal',
    },
    {
      id: 'weekly',
      title: 'WEEKLY PLAN',
      subtitle: 'SMALL CHANGE MATTERS',
      offer: 'FROM ₹259/DAY',
      mobileOffer: 'FROM ₹259/DAY',
      href: '/weekly',
      image: '/weekly.png',
      imageAlt: 'MuscleGrow Weekly 6-day protein meal plan boxes',
    },
    {
      id: 'monthly',
      title: 'MONTHLY PLAN',
      subtitle: 'WE GOT YOU',
      offer: 'HABIT ON AUTOPILOT',
      mobileOffer: 'HABIT ON AUTOPILOT',
      href: '/monthly',
      image: '/monthly.png',
      imageAlt: 'MuscleGrow Monthly lifestyle meal plan stack',
    },
    {
      id: 'custom',
      title: 'BUILD YOUR OWN BOX',
      subtitle: 'COMING SOON',
      offer: 'CUSTOMIZE EVERY GRAM',
      mobileOffer: 'CUSTOMIZE EVERY GRAM',
      href: '/custom',
      image: '/custom.png',
      imageAlt: 'MuscleGrow Custom digitally measured diet box',
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#E2ECBA] via-[#EDF5D3] to-[#F5F8EC] text-[#124233] pt-4 sm:pt-7 pb-0 select-none">
      {/* 1. Top Bar: Mobile Swiggy-style (Location + Avatar) & Desktop Logo + Nav Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-16 relative z-20">
        {/* Mobile Header: Swiggy style (Location on Left, Profile Avatar on Right) */}
        <div className="flex md:hidden items-center justify-between gap-3">
          <LocationSelector variant="mobile" />

          {/* Right: Profile Avatar Button on Mobile */}
          <button
            type="button"
            onClick={() => setNavDrawerOpen(true)}
            aria-label="Open menu and profile"
            className="relative p-0.5 rounded-full ring-2 ring-[#124233]/20 hover:ring-[#124233] focus:outline-none transition-all tap-active shrink-0 shadow-xs"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden relative bg-[#124233]/10 flex items-center justify-center">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                alt="Profile"
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-white" />
          </button>
        </div>

        {/* Desktop Header (Brand Logo + Clean Navigation Links + Profile Button) */}
        <div className="hidden md:flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.png"
              alt="Gramwise"
              width={160}
              height={50}
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
              priority
            />
          </Link>

          <nav className="flex items-center gap-6 lg:gap-8">
            <Link
              href="/menu"
              className="text-sm font-bold text-[#124233] hover:text-[#899545] transition-colors tracking-wide"
            >
              Menu
            </Link>
            <Link
              href="/tomorrow"
              className="text-sm font-bold text-[#124233] hover:text-[#899545] transition-colors tracking-wide"
            >
              Daily Trial
            </Link>
            <Link
              href="/weekly"
              className="text-sm font-bold text-[#124233] hover:text-[#899545] transition-colors tracking-wide"
            >
              Weekly Plan
            </Link>
            <Link
              href="/monthly"
              className="text-sm font-bold text-[#124233] hover:text-[#899545] transition-colors tracking-wide"
            >
              Monthly Plan
            </Link>
            <Link
              href="/delivery-areas"
              className="text-sm font-bold text-[#124233] hover:text-[#899545] transition-colors tracking-wide"
            >
              Delivery Areas
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <LocationSelector variant="desktop" />

            <button
              type="button"
              onClick={() => setNavDrawerOpen(true)}
              aria-label="Open menu and profile"
              className="relative p-0.5 rounded-full ring-2 ring-[#124233]/20 hover:ring-[#124233] focus:outline-none transition-all tap-active group shadow-xs hover:shadow"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden relative bg-[#124233]/10 flex items-center justify-center">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  alt="Profile"
                  fill
                  sizes="44px"
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-600 ring-2 ring-white" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Hero Stage (Headline + Responsive Search Bar Centered) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-4 sm:pt-10 lg:pt-16 pb-8 sm:pb-16 md:pb-24 lg:pb-32 flex flex-col items-center justify-center text-center">
        {/* Headline */}
        <div className="max-w-4xl mx-auto">
          <h1 className="font-heading font-[900] text-3xl sm:text-4xl lg:text-5xl text-[#124233] tracking-tight leading-tight sm:leading-snug">
            Fresh daily protein meals.
          </h1>
        </div>

        {/* Responsive Search Bar (Available on Mobile & Desktop) */}
        <div className="mt-4 sm:mt-8 w-full max-w-2xl mx-auto relative z-30">
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white rounded-2xl p-1.5 sm:p-2.5 shadow-xl shadow-[#124233]/10 border border-[#124233]/15 flex items-center gap-2"
          >
            <div className="flex-1 flex items-center px-2.5 sm:px-3.5">
              <Search className="w-4 h-4 text-gray-400 mr-2 sm:mr-2.5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chicken box, paneer, low-carb..."
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#124233] placeholder:text-gray-400 focus:outline-none py-1 sm:py-1.5"
              />
            </div>

            <button
              type="submit"
              className="bg-[#124233] hover:bg-[#0E3529] text-white px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md shadow-[#124233]/25 flex items-center justify-center gap-1.5 tap-active shrink-0 cursor-pointer"
            >
              <span className="hidden sm:inline">Explore Menu</span>
              <span className="sm:hidden text-xs">Search</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* 3. Full-Bleed 1-to-1 Attached Images Strip (Left to Right Edge, 0 Gaps, Sharp Corners, No Buttons) */}
      <div className="w-full relative z-20 border-t border-black/10 bg-white shadow-2xl">
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-0">
          {categoryCards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="group relative flex flex-col bg-white overflow-hidden border-r border-b md:border-b-0 border-black/10 [&:nth-child(2n)]:border-r-0 md:[&:nth-child(2n)]:border-r md:last:border-r-0 transition-all duration-300 tap-active"
            >
              {/* Clean Title Bar (Sharp corners, no buttons) */}
              <div className="py-2.5 sm:py-3.5 px-2 sm:px-4 text-center bg-white border-b border-black/5">
                <h3 className="font-heading font-[900] text-[11px] sm:text-xs md:text-sm lg:text-base text-[#124233] tracking-tight group-hover:text-[#899545] transition-colors uppercase leading-tight line-clamp-1">
                  {card.title}
                </h3>
              </div>

              {/* Seamless Attached Mockup Image (Edge-to-Edge Sharp) */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#FAFAF8]">
                <Image
                  src={card.image}
                  alt={card.imageAlt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  priority={card.id === 'trial'}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
