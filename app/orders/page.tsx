import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getOrders } from '@/lib/api/orders';
import { Package, Bike, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Order History & Tracking',
  description: 'Track your daily lunch and dinner meal deliveries across Coimbatore.',
};

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="min-h-screen bg-background pb-32">
      <section className="bg-white border-b border-gray-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-heading font-black text-2xl text-gray-900">
              Orders & Delivery History
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Live status, delivery partner details, and macro receipts.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-4">
        {orders.map((order) => {
          const isLive = order.status === 'Out for delivery' || order.status === 'Preparing' || order.status === 'Packed';
          return (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all tap-active"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-black text-base text-gray-900">
                        {order.displayId}
                      </span>
                      <span className="text-xs text-gray-400">• {order.date} ({order.slot.toUpperCase()})</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      To: {order.deliveryAddress.area}, Coimbatore
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span
                    className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                      isLive
                        ? 'bg-amber-100 text-amber-900 animate-pulse'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {order.status}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Items summary */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="font-semibold text-gray-800 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-gray-500">
                  <div className="text-right">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {order.totalProtein}g Protein
                    </span>
                    <span className="ml-2 font-semibold text-gray-700">
                      {order.totalCalories} kcal
                    </span>
                  </div>
                  <span className="font-heading font-black text-base text-gray-900">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
