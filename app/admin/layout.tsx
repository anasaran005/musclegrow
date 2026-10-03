import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BRAND } from '@/config/brand';
import {
  Utensils,
  ChefHat,
  Bike,
  Users,
  LayoutDashboard,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-4 shrink-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt={BRAND.name}
                width={120}
                height={40}
                className="h-9 w-auto object-contain"
              />
              <div>
                <span className="block text-xs font-bold text-gray-800 uppercase tracking-tight">
                  Kitchen Ops
                </span>
                <span className="block text-[9px] font-semibold text-gray-400 uppercase">
                  Central Portal
                </span>
              </div>
            </Link>
          </div>

          <nav className="space-y-1 text-xs font-bold">
            <Link
              href="/admin/cook-sheet"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-primary-light hover:text-primary transition-colors"
            >
              <ChefHat className="w-4 h-4 text-primary" />
              <span>Daily Cook Sheet</span>
            </Link>

            <Link
              href="/admin/deliveries"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-primary-light hover:text-primary transition-colors"
            >
              <Bike className="w-4 h-4 text-primary" />
              <span>Rider Deliveries</span>
            </Link>

            <Link
              href="/admin/dishes"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-primary-light hover:text-primary transition-colors"
            >
              <Utensils className="w-4 h-4 text-primary" />
              <span>Dish Catalog & Macros</span>
            </Link>

            <Link
              href="/admin/subscribers"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-primary-light hover:text-primary transition-colors"
            >
              <Users className="w-4 h-4 text-primary" />
              <span>Active Subscribers</span>
            </Link>
          </nav>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Consumer App</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
