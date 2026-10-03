import React from 'react';
import Link from 'next/link';
import { BRAND } from '@/config/brand';
import { Sparkles, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export function FinalCtaBand() {
  const whatsappUrl = `https://wa.me/${BRAND.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(BRAND.whatsappMessage)}`;

  return (
    <section className="py-16 bg-gradient-to-br from-primary-dark via-primary to-[#062e16] text-white relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime-brand/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 text-lime-brand text-xs font-extrabold uppercase tracking-wider mb-3">
          <Sparkles className="w-4 h-4" />
          <span>Transform Your Daily Nutrition</span>
        </div>

        <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
          Ready to stop guessing and start measuring?
        </h2>

        <p className="text-gray-200 text-sm sm:text-base max-w-2xl mx-auto mt-4 leading-relaxed font-normal">
          Join hundreds of active people in Coimbatore who wake up every morning knowing their lunch and dinner nutrition is taken care of.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link
            href="/tomorrow"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-cta hover:bg-cta-hover text-white text-base font-bold px-8 py-4 rounded-full shadow-xl shadow-cta/30 hover:scale-105 transition-all tap-active"
          >
            <span>Try Tomorrow’s Daily Trial Box</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-base font-bold px-7 py-4 rounded-full shadow-lg transition-all tap-active"
          >
            <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
            <span>Join WhatsApp Community</span>
          </a>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-lime-brand/90 font-semibold">
          <span>✓ No lock-in commitment</span>
          <span>✓ Pause or skip days anytime</span>
          <span>✓ Free doorstep delivery in Coimbatore</span>
        </div>
      </div>
    </section>
  );
}
