'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Search,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

const COIMBATORE_ZONES = [
  { area: 'RS Puram', pincode: '641002' },
  { area: 'Peelamedu', pincode: '641004' },
  { area: 'Gandhipuram', pincode: '641012' },
  { area: 'Saibaba Colony', pincode: '641011' },
  { area: 'Race Course', pincode: '641018' },
  { area: 'Saravanampatti', pincode: '641035' },
];

const DAILY_TRIAL_IMAGES = [
  {
    name: 'Butter Garlic Chicken',
    src: '/daily-trial/butter-garlic-chicken.png',
    alt: 'Butter Garlic Chicken Box',
  },
  {
    name: 'Chettinad Chicken',
    src: '/daily-trial/chetinad.png',
    alt: 'Chettinad Protein Box',
  },
  {
    name: 'Lemon Herb Chicken',
    src: '/daily-trial/lemon-herb.png',
    alt: 'Lemon Herb High Protein Meal',
  },
  {
    name: 'Peri Peri Chicken',
    src: '/daily-trial/peri-peri.png',
    alt: 'Peri Peri Chicken Protein Box',
  },
  {
    name: 'Spicy Fish',
    src: '/daily-trial/spicy-fish.png',
    alt: 'Spicy Fish Lean Meal Prep',
  },
  {
    name: 'Tandoori Protein',
    src: '/daily-trial/tandoori.png',
    alt: 'Tandoori Protein Box',
  },
];

function DailyTrialImageSlider({ className }: { className?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % DAILY_TRIAL_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const current = DAILY_TRIAL_IMAGES[currentIndex];

  return (
    <div className={cn("relative w-full h-full", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={current.src}
          initial={{ opacity: 0, x: 24, filter: 'blur(8px)', scale: 1.05 }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)', scale: 1 }}
          exit={{ opacity: 0, x: -24, filter: 'blur(8px)', scale: 0.95 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 w-full h-full flex items-center justify-center"
        >
          <Image
            src={current.src}
            alt={current.alt}
            fill
            sizes="(max-width: 768px) 140px, 180px"
            className="object-contain drop-shadow-md"
            priority={currentIndex === 0}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function SwiggyHero() {
  const router = useRouter();
  const { setNavDrawerOpen } = useAppStore();
  const [selectedZone, setSelectedZone] = useState(COIMBATORE_ZONES[0]);
  const [zoneDropdownOpen, setZoneDropdownOpen] = useState(false);
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
      offer: 'FROM ₹279 (V) / ₹299 (NV)',
      mobileOffer: 'FROM ₹279 (V) / ₹299 (NV)',
      href: '/tomorrow',
      image: '/daily-trial/butter-garlic-chicken.png',
      imageAlt: 'Daily Trial Box meal',
    },
    {
      id: 'weekly',
      title: 'WEEKLY PLAN',
      subtitle: 'SMALL CHANGE MATTERS',
      offer: 'FROM ₹259/DAY',
      mobileOffer: 'FROM ₹259/DAY',
      href: '/weekly',
      image: '/daily-trial/weekly-plan.png',
      imageAlt: 'Weekly 6-day protein meal plan bowl',
    },
    {
      id: 'monthly',
      title: 'MONTHLY PLAN',
      subtitle: 'WE GOT YOU',
      offer: 'HABIT ON AUTOPILOT',
      mobileOffer: 'HABIT ON AUTOPILOT',
      href: '/monthly',
      image: '/daily-trial/monthly-plan.png',
      imageAlt: 'Monthly lifestyle meal plan with cold pressed juice',
    },
    {
      id: 'custom',
      title: 'BUILD YOUR OWN BOX',
      subtitle: 'COMING SOON',
      offer: 'CUSTOMIZE EVERY GRAM',
      mobileOffer: 'CUSTOMIZE EVERY GRAM',
      href: '/custom',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      imageAlt: 'Digitally measured custom diet bowl',
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#E2ECBA] via-[#EDF5D3] to-[#F5F8EC] text-[#124233] pt-4 sm:pt-7 pb-12 sm:pb-20 select-none">
      {/* 1. Top Bar: Mobile Swiggy-style (Location + Avatar) & Desktop Logo + Nav Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-16 relative z-20">
        {/* Mobile Header: Swiggy style (Location on Left, Profile Avatar on Right) */}
        <div className="flex md:hidden items-center justify-between">
          <div className="relative">
            <button
              type="button"
              onClick={() => setZoneDropdownOpen(!zoneDropdownOpen)}
              className="flex items-center gap-1.5 text-[#124233] tap-active"
            >
              <div className="w-8 h-8 rounded-full bg-[#124233]/10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-[#124233]" />
              </div>
              <div className="text-left leading-tight">
                <div className="flex items-center gap-1 font-heading font-black text-sm text-[#124233]">
                  <span>{selectedZone.area}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#124233]/70" />
                </div>
                <span className="text-[10px] text-gray-500 font-semibold">{selectedZone.pincode}, Coimbatore</span>
              </div>
            </button>

            {/* Mobile Location Dropdown */}
            {zoneDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setZoneDropdownOpen(false)}
                />
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-40 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Select Coimbatore Delivery Area
                  </div>
                  {COIMBATORE_ZONES.map((zone) => (
                    <button
                      key={zone.pincode}
                      type="button"
                      onClick={() => {
                        setSelectedZone(zone);
                        setZoneDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-xs font-semibold hover:bg-[#F5F8EC] transition-colors ${
                        selectedZone.pincode === zone.pincode
                          ? 'bg-[#F5F8EC] text-[#124233] font-bold'
                          : 'text-gray-700'
                      }`}
                    >
                      <span>{zone.area}</span>
                      <span className="text-[10px] font-mono text-gray-400">
                        {zone.pincode}
                      </span>
                    </button>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1.5 px-3.5 py-1">
                    <Link
                      href="/delivery-areas"
                      className="text-[11px] font-bold text-[#899545] hover:underline"
                      onClick={() => setZoneDropdownOpen(false)}
                    >
                      View all 12 delivery pincodes &rarr;
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Search Bar on Top Right (Replaces Profile Avatar) */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-[200px] sm:max-w-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes..."
              className="w-full bg-white text-xs font-medium text-[#124233] placeholder:text-gray-400 pl-3.5 pr-8 py-2 rounded-full shadow-sm shadow-[#124233]/5 border border-black/5 focus:outline-none focus:ring-1 focus:ring-[#899545]"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#124233] transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
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
              href="/custom"
              className="text-sm font-bold text-[#124233] hover:text-[#899545] transition-colors tracking-wide"
            >
              Custom Box
            </Link>
            <Link
              href="/delivery-areas"
              className="text-sm font-bold text-[#124233] hover:text-[#899545] transition-colors tracking-wide"
            >
              Delivery Areas
            </Link>
          </nav>

          <div className="flex items-center gap-3">
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

      {/* 2. Main Hero Stage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Headline (Clean single line, no description) */}
        <div className="text-left sm:text-center max-w-5xl mx-auto">
          <h1 className="font-heading font-[900] text-xl sm:text-3xl lg:text-4xl text-[#124233] tracking-tight leading-tight">
            Fresh daily protein meals. <span className="text-[#899545]">Digitally weighed in Coimbatore.</span>
          </h1>
        </div>

        {/* Desktop Search & Location Bar */}
        <div className="hidden md:block mt-6 sm:mt-8 max-w-3xl mx-auto relative z-30">
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-xl shadow-[#124233]/10 border border-[#124233]/15 flex items-center gap-2 sm:gap-3"
          >
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setZoneDropdownOpen(!zoneDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#F5F8EC] hover:bg-[#EAF1DC] text-xs sm:text-sm font-bold text-[#124233] transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#899545] shrink-0" />
                <span className="truncate">{selectedZone.area}, {selectedZone.pincode}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#124233]/70 shrink-0" />
              </button>
            </div>

            <div className="flex-1 flex items-center px-3 sm:px-2">
              <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chicken box, paneer, low-carb..."
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#124233] placeholder:text-gray-400 focus:outline-none py-1"
              />
            </div>

            <button
              type="submit"
              className="bg-[#124233] hover:bg-[#0E3529] text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md shadow-[#124233]/25 flex items-center justify-center gap-2 tap-active shrink-0"
            >
              <span>Explore Menu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* 3. Swiggy-Style Category Cards Grid */}

        {/* MOBILE GRID LAYOUT: (Exact layout reference from Swiggy mobile screenshots) */}
        <div className="mt-5 space-y-3.5 md:hidden">
          {/* Card 1: DAILY TRIAL BOX (Full Width Hero Card, like Swiggy Food Delivery) */}
          <Link
            href="/tomorrow"
            className="block bg-white rounded-3xl p-5 shadow-md shadow-[#124233]/5 border border-black/5 hover:shadow-xl transition-all relative overflow-hidden group tap-active"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1 max-w-[62%]">
                <h3 className="font-heading font-[900] text-xl text-[#124233] tracking-tight group-hover:text-[#899545] transition-colors leading-tight">
                  DAILY TRIAL BOX
                </h3>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  JUST TRY IT
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center pl-2.5 pr-4 py-0.5 rounded-full bg-gradient-to-r from-[#FFEADF] via-[#FFF4EE] to-transparent text-[#FF5200] text-[10px] font-black uppercase tracking-wider">
                    FROM ₹279 (V) / ₹299 (NV)
                  </span>
                </div>
              </div>

              {/* Delicious dish photo slider (fully visible without clipping container) */}
              <div className="relative w-28 h-24 sm:w-32 sm:h-28 shrink-0 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                <DailyTrialImageSlider className="w-full h-full" />
              </div>
            </div>
          </Link>

          {/* Cards 2 & 3: 2-Column Row (Instamart & Dineout layout from Swiggy) */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Card 2: Weekly Plan */}
            <Link
              href="/weekly"
              className="bg-white rounded-3xl p-4 shadow-md shadow-[#124233]/5 border border-black/5 hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden group tap-active"
            >
              <div className="space-y-1">
                <h3 className="font-heading font-[900] text-base text-[#124233] tracking-tight group-hover:text-[#899545] transition-colors leading-tight">
                  WEEKLY PLAN
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  SMALL CHANGE MATTERS
                </p>
                <div className="pt-1.5">
                  <span className="inline-flex items-center pl-2.5 pr-4 py-0.5 rounded-full bg-gradient-to-r from-[#FFEADF] via-[#FFF4EE] to-transparent text-[#FF5200] text-[9px] font-black uppercase tracking-wider">
                    FROM ₹259/DAY
                  </span>
                </div>
              </div>

              <div className="mt-3 flex justify-end">
                <div className="relative w-24 h-24 shrink-0 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                  <Image
                    src="/daily-trial/weekly-plan.png"
                    alt="Weekly Plan"
                    fill
                    sizes="100px"
                    className="object-contain drop-shadow-md"
                  />
                </div>
              </div>
            </Link>

            {/* Card 3: Monthly Plan */}
            <Link
              href="/monthly"
              className="bg-white rounded-3xl p-4 shadow-md shadow-[#124233]/5 border border-black/5 hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden group tap-active"
            >
              <div className="space-y-1">
                <h3 className="font-heading font-[900] text-base text-[#124233] tracking-tight group-hover:text-[#899545] transition-colors leading-tight">
                  MONTHLY PLAN
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  WE GOT YOU
                </p>
                <div className="pt-1.5">
                  <span className="inline-flex items-center pl-2.5 pr-4 py-0.5 rounded-full bg-gradient-to-r from-[#FFEADF] via-[#FFF4EE] to-transparent text-[#FF5200] text-[9px] font-black uppercase tracking-wider">
                    HABIT ON AUTOPILOT
                  </span>
                </div>
              </div>

              <div className="mt-3 flex justify-end">
                <div className="relative w-24 h-24 shrink-0 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                  <Image
                    src="/daily-trial/monthly-plan.png"
                    alt="Monthly Plan"
                    fill
                    sizes="100px"
                    className="object-contain drop-shadow-md"
                  />
                </div>
              </div>
            </Link>
          </div>

          {/* Card 4: Build Your Own Box (Full Width Card) */}
          <Link
            href="/custom"
            className="block bg-white rounded-3xl p-5 shadow-md shadow-[#124233]/5 border border-black/5 hover:shadow-xl transition-all relative overflow-hidden group tap-active"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1 max-w-[62%]">
                <h3 className="font-heading font-[900] text-xl text-[#124233] tracking-tight group-hover:text-[#899545] transition-colors leading-tight">
                  BUILD YOUR OWN BOX
                </h3>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  COMING SOON
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center pl-2.5 pr-4 py-0.5 rounded-full bg-gradient-to-r from-[#FFEADF] via-[#FFF4EE] to-transparent text-[#FF5200] text-[10px] font-black uppercase tracking-wider">
                    CUSTOMIZE EVERY GRAM
                  </span>
                </div>
              </div>

              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80"
                  alt="Custom Box"
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </div>
            </div>
          </Link>
        </div>

        {/* DESKTOP GRID LAYOUT: 4 Clean Columns */}
        <div className="hidden md:grid md:grid-cols-4 gap-4 lg:gap-5 mt-12 sm:mt-16">
          {categoryCards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="group relative bg-white rounded-3xl p-5 sm:p-6 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-black/5 flex flex-col justify-between overflow-hidden"
            >
              <div className="space-y-1 z-10">
                <h3 className="font-heading font-[900] text-xl lg:text-[23px] text-[#124233] tracking-tight leading-tight group-hover:text-[#899545] transition-colors">
                  {card.title}
                </h3>

                <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">
                  {card.subtitle}
                </p>

                <div className="pt-2">
                  <span className="inline-flex items-center pl-3.5 pr-6 py-1 rounded-full bg-gradient-to-r from-[#FFEADF] via-[#FFF4EE] to-transparent text-[#FF5200] font-heading font-black text-xs tracking-wider uppercase">
                    {card.offer}
                  </span>
                </div>
              </div>

              <div className="relative mt-6 pt-2 flex items-end justify-between">
                <div className="w-10 h-10 rounded-full bg-[#124233] group-hover:bg-[#899545] text-white flex items-center justify-center shadow-md transition-all group-hover:scale-110 shrink-0">
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </div>

                {card.id === 'trial' ? (
                  <div className="relative w-32 h-28 lg:w-36 lg:h-32 shrink-0 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                    <DailyTrialImageSlider className="w-full h-full" />
                  </div>
                ) : card.id === 'weekly' ? (
                  <div className="relative w-28 h-28 lg:w-32 lg:h-32 shrink-0 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                    <Image
                      src="/daily-trial/weekly-plan.png"
                      alt={card.imageAlt}
                      fill
                      sizes="130px"
                      className="object-contain drop-shadow-md"
                    />
                  </div>
                ) : card.id === 'monthly' ? (
                  <div className="relative w-28 h-28 lg:w-32 lg:h-32 shrink-0 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                    <Image
                      src="/daily-trial/monthly-plan.png"
                      alt={card.imageAlt}
                      fill
                      sizes="130px"
                      className="object-contain drop-shadow-md"
                    />
                  </div>
                ) : (
                  <div className="relative w-28 aspect-square rounded-2xl overflow-hidden shadow-md border-2 border-white shrink-0 group-hover:scale-105 transition-transform duration-500">
                    <Image
                      src={card.image}
                      alt={card.imageAlt}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
