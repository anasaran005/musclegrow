'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { BRAND } from '@/config/brand';

import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

export function FloatingWhatsApp() {
  const pathname = usePathname();
  const { isNavDrawerOpen } = useAppStore();

  // Hide on admin routes or checkout
  if (pathname === '/checkout' || pathname.startsWith('/admin')) {
    return null;
  }

  const encodedMsg = encodeURIComponent(BRAND.whatsappMessage);
  const whatsappUrl = `https://wa.me/${BRAND.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodedMsg}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with our Nutritionist on WhatsApp"
      className={cn(
        "fixed z-40 flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white p-3 md:px-4 md:py-3 rounded-full shadow-lg shadow-black/15 transition-all duration-300 hover:scale-105 active:scale-95 tap-active bottom-20 right-4 md:bottom-6 md:right-6 group",
        isNavDrawerOpen && "translate-y-28 opacity-0 pointer-events-none"
      )}
    >
      <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
      <span className="hidden md:inline font-bold text-xs tracking-wide">
        Chat with Nutritionist
      </span>
      <span className="md:hidden absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
      </span>
    </a>
  );
}
