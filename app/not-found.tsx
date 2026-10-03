import React from 'react';
import Link from 'next/link';
import { Utensils, Home, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-background">
      <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-sm">
        <Utensils className="w-10 h-10" />
      </div>

      <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-3 py-1 rounded-full">
        404 Page Not Found
      </span>

      <h1 className="font-heading font-black text-3xl sm:text-4xl text-gray-900 mt-3">
        Looks like this dish isn't on the menu!
      </h1>

      <p className="text-gray-500 text-xs sm:text-sm max-w-sm mt-2 leading-relaxed">
        The page you are looking for might have been moved or doesn't exist. Let's get you back to fresh measured food.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md tap-active"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <Link
          href="/menu"
          className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-800 text-xs font-bold px-6 py-3 rounded-xl hover:bg-gray-50 tap-active"
        >
          <span>Explore Daily Menu</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
