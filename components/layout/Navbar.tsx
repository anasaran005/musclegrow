'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { BRAND } from '@/config/brand';
import { useAppStore } from '@/store/useAppStore';
import {
  X,
  Home,
  MapPin,
  Sparkles,
  Utensils,
  Calendar,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  MessageCircle,
  User as UserIcon,
  LogOut,
  Sliders,
  ChevronDown,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LocationSelector } from '@/components/layout/LocationSelector';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { isLoggedIn, user, isNavDrawerOpen, setNavDrawerOpen } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  const isHomePage = pathname === '/';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/tomorrow?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset navbar visibility on page navigation
  useEffect(() => {
    setIsMobileNavVisible(true);
    lastScrollYRef.current = typeof window !== 'undefined' ? window.scrollY : 0;
  }, [pathname]);

  // Keep navbar visible if drawer is open
  useEffect(() => {
    if (isNavDrawerOpen) {
      setIsMobileNavVisible(true);
    }
  }, [isNavDrawerOpen]);

  // Mobile navbar scroll direction auto-hide (up on scroll down, down on scroll up)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        // If an input is focused (e.g. searching dishes), keep navbar visible
        if (document.activeElement?.tagName === 'INPUT') {
          setIsMobileNavVisible(true);
          ticking = false;
          return;
        }

        const currentScrollY = window.scrollY;
        const lastScrollY = lastScrollYRef.current;
        const diff = currentScrollY - lastScrollY;

        // If at the top of the page, always show navbar
        if (currentScrollY <= 30) {
          setIsMobileNavVisible(true);
          lastScrollYRef.current = currentScrollY;
          ticking = false;
          return;
        }

        // Avoid rubber-banding jitter at bottom of page
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        if (currentScrollY + clientHeight >= scrollHeight - 20) {
          ticking = false;
          return;
        }

        // Only trigger on intentional scroll delta (> 6px)
        if (Math.abs(diff) > 6) {
          if (diff > 0 && currentScrollY > 50) {
            // Scrolling down -> slide mobile navbar up
            setIsMobileNavVisible(false);
          } else if (diff < 0) {
            // Scrolling up -> slide mobile navbar back down
            setIsMobileNavVisible(true);
          }
          lastScrollYRef.current = currentScrollY;
        }

        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when menu drawer is open
  useEffect(() => {
    if (isNavDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isNavDrawerOpen]);

  // Close menu on route change or Escape key
  useEffect(() => {
    setNavDrawerOpen(false);
  }, [pathname, setNavDrawerOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNavDrawerOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setNavDrawerOpen]);

  const navLinks = [
    { label: 'Home', href: '/', icon: Home, desc: 'Gramwise daily protein overview' },
    { label: 'Weekly Menu', href: '/menu', icon: Utensils, desc: 'Rotating 6-day box menu with photos' },
    { label: 'Daily Trial Box', href: '/tomorrow', icon: Utensils, desc: "Tomorrow's rotating 5-item box" },
    { label: 'Weekly Plan', href: '/weekly', icon: Calendar, badge: 'Popular', desc: '6-day Mon–Sat routine with skip option' },
    { label: 'Monthly Lifestyle', href: '/monthly', icon: Calendar, desc: '24-day transformation calendar' },
    { label: 'Central Kitchen Cook-Sheet', href: '/admin/cook-sheet', icon: Sliders, desc: 'Live daily batches & delivery roster' },
    { label: 'How It Works', href: '/how-it-works', icon: Sliders, desc: 'Digital kitchen weighing to delivery' },
    { label: 'Delivery Areas', href: '/delivery-areas', icon: MapPin, desc: 'Coimbatore coverage & pincodes' },
    { label: 'FAQ & Support', href: '/faq', icon: HelpCircle, desc: 'Questions about meal rotation & billing' },
  ];

  return (
    <>
      {/* Top Navbar for non-home pages (Desktop matches the clean home hero navbar) */}
      {!isHomePage && (
        <header
          className={cn(
            "sticky top-0 z-40 w-full bg-[#E8F1D4] sm:bg-[#E8F1D4]/95 backdrop-blur-md transition-transform duration-300 ease-in-out will-change-transform",
            !isMobileNavVisible ? "-translate-y-full md:translate-y-0" : "translate-y-0"
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-5">
            {/* Desktop Navbar (Hidden on mobile, undisturbed) */}
            <div className="hidden md:flex items-center justify-between">
              {/* Left Brand Logo */}
              <Link href="/" className="flex items-center gap-2 group">
                <Image
                  src="/logo.png"
                  alt={BRAND.name}
                  width={160}
                  height={50}
                  className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
                  priority
                />
              </Link>

              {/* Center Clean Typography Navigation Links */}
              <nav className="flex items-center gap-6 lg:gap-8">
                <Link
                  href="/menu"
                  className={cn(
                    "text-sm font-bold tracking-wide transition-colors",
                    pathname === '/menu'
                      ? "text-[#899545]"
                      : "text-[#124233] hover:text-[#899545]"
                  )}
                >
                  Menu
                </Link>
                <Link
                  href="/tomorrow"
                  className={cn(
                    "text-sm font-bold tracking-wide transition-colors",
                    pathname === '/tomorrow'
                      ? "text-[#899545]"
                      : "text-[#124233] hover:text-[#899545]"
                  )}
                >
                  Daily Trial
                </Link>
                <Link
                  href="/weekly"
                  className={cn(
                    "text-sm font-bold tracking-wide transition-colors",
                    pathname === '/weekly'
                      ? "text-[#899545]"
                      : "text-[#124233] hover:text-[#899545]"
                  )}
                >
                  Weekly Plan
                </Link>
                <Link
                  href="/monthly"
                  className={cn(
                    "text-sm font-bold tracking-wide transition-colors",
                    pathname === '/monthly'
                      ? "text-[#899545]"
                      : "text-[#124233] hover:text-[#899545]"
                  )}
                >
                  Monthly Plan
                </Link>
                <Link
                  href="/delivery-areas"
                  className={cn(
                    "text-sm font-bold tracking-wide transition-colors",
                    pathname === '/delivery-areas'
                      ? "text-[#899545]"
                      : "text-[#124233] hover:text-[#899545]"
                  )}
                >
                  Delivery Areas
                </Link>
              </nav>

              {/* Right Profile Circle Button & Location Selector */}
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

            {/* Mobile Header: Swiggy style (Location on Left, Profile Avatar on Right - No navbar/logo) */}
            <div className="flex md:hidden items-center justify-between">
              <LocationSelector variant="mobile" />

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
          </div>
        </header>
      )}

      {/* Slide-out Drawer & Overlay */}
      {isNavDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            onClick={() => setNavDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div>
              <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
                {/* User Profile Card Summary */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative border-2 border-primary/20 shadow-sm shrink-0">
                    <Image
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                      alt="Profile"
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-gray-900 text-sm sm:text-base leading-tight">
                      {mounted && user?.fullName ? user.fullName : 'Mohammed Anas'}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-primary" />
                      <span>Coimbatore, Tamil Nadu</span>
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setNavDrawerOpen(false)}
                  className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-200/80 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Prominent Quick Action Button */}
              <div className="p-4 sm:p-5 pb-2">
                <Link
                  href="/tomorrow"
                  onClick={() => setNavDrawerOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-cta hover:bg-cta-hover text-white text-sm font-bold py-3.5 px-4 rounded-2xl shadow-md shadow-cta/25 hover:shadow-lg transition-all tap-active"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Order Tomorrow’s Daily Trial Box</span>
                </Link>
              </div>

              {/* Navigation Items */}
              <div className="p-4 sm:p-5 space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 pb-1">
                  Navigation
                </p>

                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setNavDrawerOpen(false)}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-2xl transition-all group tap-active",
                        isActive
                          ? "bg-primary-light text-primary font-bold"
                          : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
                            isActive
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-gray-600 group-hover:bg-primary-light group-hover:text-primary"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold flex items-center gap-2">
                            <span>{link.label}</span>
                            {link.badge && (
                              <span className="text-[10px] font-bold bg-cta text-white px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                                {link.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 group-hover:text-gray-500 font-normal">
                            {link.desc}
                          </p>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  );
                })}
              </div>

              {/* Account / Dashboard Section */}
              <div className="px-4 sm:px-5 pb-4">
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-2 pb-1">
                    Account & Orders
                  </p>

                  <Link
                    href={mounted && isLoggedIn ? "/dashboard" : "/login"}
                    onClick={() => setNavDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-white hover:text-primary transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <UserIcon className="w-4 h-4 text-primary" />
                      <span>{mounted && isLoggedIn ? "Member Dashboard" : "Sign In / Register"}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>

                  <Link
                    href="/delivery-areas"
                    onClick={() => setNavDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-white hover:text-primary transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>Delivery Areas (Coimbatore)</span>
                    </div>
                    <span className="text-xs font-semibold text-primary bg-primary-light px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer Footer: Support & FSSAI Trust */}
            <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-3">
              <a
                href="https://wa.me/919876543210?text=Hi%20MuscleGrow%20Team,%20I%20have%20a%20question%20about%20your%20meal%20boxes"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Nutritionist on WhatsApp</span>
              </a>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>100% Digitally Weighed • FSSAI Licensed Kitchen</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
