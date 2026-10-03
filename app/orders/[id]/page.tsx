import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrderById, getOrders } from '@/lib/api/orders';
import {
  ChefHat,
  Box,
  Bike,
  CheckCircle2,
  Phone,
  MapPin,
  ChevronLeft,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { MacroBadge } from '@/components/ui/MacroBadge';

interface OrderDetailProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const orders = await getOrders();
  return orders.map((o) => ({
    id: o.id,
  }));
}

export default async function OrderDetailPage({ params }: OrderDetailProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const steps = [
    { step: 1, title: 'Preparing', desc: 'Central Kitchen, RS Puram', icon: ChefHat },
    { step: 2, title: 'Packed', desc: 'Tare verified & heat sealed', icon: Box },
    { step: 3, title: 'Out for delivery', desc: 'On bike with thermal bag', icon: Bike },
    { step: 4, title: 'Delivered', desc: 'Fresh at your doorstep', icon: CheckCircle2 },
  ];

  const currentStep = order.statusStep;

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            href="/orders"
            className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>All Orders</span>
          </Link>
          <span className="font-heading font-black text-sm text-gray-900">
            {order.displayId}
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Live Delivery Status Stepper Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-card">
          <div className="flex items-center justify-between pb-6 border-b border-gray-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-primary tracking-wider bg-primary-light px-2.5 py-0.5 rounded-md">
                Live Status
              </span>
              <h2 className="font-heading font-black text-2xl text-gray-900 mt-1">
                {order.status}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Estimated Arrival: <span className="font-bold text-gray-800">{order.estimatedDeliveryTime}</span>
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-primary text-lime-brand flex items-center justify-center font-bold shadow-md">
              <Bike className="w-6 h-6" />
            </div>
          </div>

          {/* Stepper */}
          <div className="py-6">
            <div className="grid grid-cols-4 gap-2 relative">
              {steps.map((st) => {
                const Icon = st.icon;
                const isPassed = currentStep >= st.step;
                const isCurrent = currentStep === st.step;

                return (
                  <div key={st.step} className="flex flex-col items-center text-center">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-primary text-lime-brand ring-4 ring-primary/20 scale-105'
                          : isPassed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>

                    <h4
                      className={`text-[11px] sm:text-xs font-bold mt-2 leading-tight ${
                        isPassed ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {st.title}
                    </h4>
                    <p className="text-[9px] text-gray-400 mt-0.5 hidden sm:block">
                      {st.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Agent Card */}
          {order.deliveryAgent && (
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between gap-4 mt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  {order.deliveryAgent.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Delivery Executive</p>
                  <h4 className="font-heading font-bold text-sm text-gray-900">
                    {order.deliveryAgent.name}
                  </h4>
                </div>
              </div>

              <a
                href={`tel:${order.deliveryAgent.phone}`}
                className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm tap-active"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Rider</span>
              </a>
            </div>
          )}
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-primary" />
            <h3 className="font-heading font-bold text-sm text-gray-900 uppercase tracking-wider">
              Delivery Address
            </h3>
          </div>
          <div className="text-xs text-gray-600 space-y-0.5">
            <p className="font-bold text-gray-900">{order.deliveryAddress.name} ({order.deliveryAddress.tag})</p>
            <p>{order.deliveryAddress.flatNumber}, {order.deliveryAddress.street}</p>
            {order.deliveryAddress.landmark && <p>Near: {order.deliveryAddress.landmark}</p>}
            <p>{order.deliveryAddress.area}, Coimbatore - {order.deliveryAddress.pincode}</p>
            <p className="text-gray-400 font-semibold pt-1">Phone: {order.deliveryAddress.phone}</p>
          </div>
        </div>

        {/* Items & Macro Receipt */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-heading font-bold text-sm text-gray-900 uppercase tracking-wider mb-4">
            Items in this Delivery
          </h3>

          <div className="space-y-4 divide-y divide-gray-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                    <Image
                      src={item.image || '/images/hero-meal.jpg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-gray-900 leading-snug">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MacroBadge type="protein" value={item.protein} size="sm" />
                      <MacroBadge type="calories" value={item.calories} size="sm" />
                    </div>
                  </div>
                </div>

                <span className="font-heading font-black text-sm text-gray-900 shrink-0">
                  {formatCurrency(item.price)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold">
            <span className="text-gray-500">Total Billed ({order.items.length} items):</span>
            <span className="font-heading font-black text-base text-primary">
              {formatCurrency(order.totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
