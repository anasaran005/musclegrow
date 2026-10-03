'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

function getActiveTabId(pathname: string, isDrawerOpen: boolean): string {
  if (isDrawerOpen) return 'account';
  if (pathname === '/tomorrow' || pathname === '/box' || pathname === '/menu') return 'trial';
  if (pathname === '/weekly' || pathname === '/monthly' || pathname === '/plans' || pathname === '/build-plan' || pathname === '/my-plan') return 'plans';
  if (pathname === '/profile' || pathname === '/dashboard' || pathname === '/orders' || pathname === '/progress' || pathname === '/login') return 'account';
  return 'home';
}

export function BottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { setNavDrawerOpen, isNavDrawerOpen } = useAppStore();
  const [activeTabId, setActiveTabId] = useState<string>(() => getActiveTabId(pathname, isNavDrawerOpen));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setActiveTabId(getActiveTabId(pathname, isNavDrawerOpen));
  }, [pathname, isNavDrawerOpen]);

  if (!mounted) return null;

  // Hide on checkout and admin routes
  if (pathname === '/checkout' || pathname.startsWith('/admin')) {
    return null;
  }

  const tabs = [
    {
      id: 'home',
      ariaLabel: 'Gramwise Home',
      href: '/',
      imageSrc: '/logo.png',
      imageAlt: 'Gramwise Logo',
      imageSize: 'w-8 h-6',
    },
    {
      id: 'trial',
      ariaLabel: 'Tomorrow Trial Box',
      href: '/tomorrow',
      imageSrc: '/icons/icons8-fork-100.png',
      imageAlt: 'Trial Fork Icon',
      imageSize: 'w-6 h-6',
    },
    {
      id: 'plans',
      ariaLabel: 'Weekly & Monthly Plans',
      href: '/weekly',
      imageSrc: '/icons/icons8-calender-100.png',
      imageAlt: 'Calendar Plans Icon',
      imageSize: 'w-6 h-6',
    },
    {
      id: 'account',
      ariaLabel: 'Profile & Account',
      isProfileAvatar: true,
      onClick: () => {
        setActiveTabId('account');
        setNavDrawerOpen(true);
      },
    },
  ];

  return (
    <div
      className={cn(
        "md:hidden fixed bottom-4 inset-x-0 z-40 flex justify-center px-4 pointer-events-none select-none transition-all duration-300 ease-in-out",
        isNavDrawerOpen
          ? "translate-y-28 opacity-0 pointer-events-none"
          : "translate-y-0 opacity-100"
      )}
    >
      <nav
        className="pointer-events-auto relative w-full max-w-[320px] rounded-full overflow-hidden p-1.5 transition-all bg-gradient-to-b from-white/60 via-white/40 to-white/25 backdrop-blur-2xl backdrop-saturate-150 border border-white/70 shadow-[0_14px_40px_rgba(0,0,0,0.18),0_4px_12px_rgba(0,0,0,0.08),inset_0_1.5px_2px_0_rgba(255,255,255,0.95),inset_0_-1px_1.5px_0_rgba(255,255,255,0.35)] ring-1 ring-black/5"
        aria-label="Mobile Floating Navigation Dock"
      >
        {/* Specular fluid light highlight along top rim */}
        <div
          className="pointer-events-none absolute inset-x-4 top-0.5 h-[42%] rounded-full bg-gradient-to-b from-white/75 via-white/25 to-transparent opacity-90 blur-[0.5px]"
          aria-hidden="true"
        />

        {/* Subtle bottom refraction glow */}
        <div
          className="pointer-events-none absolute inset-x-8 bottom-0.5 h-[22%] rounded-full bg-white/25 opacity-70 blur-[1px]"
          aria-hidden="true"
        />

        <div className="relative z-10 flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = activeTabId === tab.id;

            const iconContent = (
              <div className="relative z-10 flex flex-col items-center justify-center">
                {tab.imageSrc ? (
                  <div
                    className={cn(
                      "relative transition-all duration-200 flex items-center justify-center",
                      tab.imageSize,
                      isActive
                        ? "scale-105 drop-shadow-[0_1px_3px_rgba(0,0,0,0.14)]"
                        : "opacity-60 grayscale hover:opacity-90 group-hover:scale-105"
                    )}
                  >
                    <Image
                      src={tab.imageSrc}
                      alt={tab.imageAlt}
                      fill
                      sizes="32px"
                      className="object-contain"
                    />
                  </div>
                ) : tab.isProfileAvatar ? (
                  <div
                    className={cn(
                      "relative w-7 h-7 rounded-full overflow-hidden transition-all duration-200 group-hover:scale-105",
                      isActive
                        ? "ring-2 ring-[#124233] shadow-xs"
                        : "ring-1 ring-white/70 opacity-80 hover:opacity-100"
                    )}
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                      alt="User Profile"
                      fill
                      sizes="28px"
                      className="object-cover"
                    />
                  </div>
                ) : null}
              </div>
            );

            const tabClassName = cn(
              "relative flex items-center justify-center w-14 h-12 rounded-full transition-all duration-200 tap-active group",
              !isActive && "hover:bg-white/20 active:scale-95"
            );

            const sharedAnimatedIndicator = (
              <>
                {isActive && (
                  <motion.div
                    layoutId="liquidGlassSelectedOutline"
                    className="absolute inset-0 rounded-full bg-white/50 border border-white/80 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.95),0_2px_8px_rgba(0,0,0,0.06)] backdrop-blur-md pointer-events-none"
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 32,
                    }}
                  />
                )}
                {isActive && (
                  <motion.span
                    layoutId="liquidGlassSelectedDot"
                    className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#124233] shadow-[0_0_6px_rgba(18,66,51,0.6)] pointer-events-none"
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 32,
                    }}
                  />
                )}
              </>
            );

            if (tab.href) {
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  prefetch={true}
                  onClick={() => setActiveTabId(tab.id)}
                  aria-label={tab.ariaLabel}
                  className={tabClassName}
                >
                  {sharedAnimatedIndicator}
                  {iconContent}
                </Link>
              );
            }

            return (
              <button
                key={tab.id}
                type="button"
                onClick={tab.onClick}
                aria-label={tab.ariaLabel}
                className={tabClassName}
              >
                {sharedAnimatedIndicator}
                {iconContent}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
