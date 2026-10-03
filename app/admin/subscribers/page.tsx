'use client';

import React, { useState } from 'react';
import { Users, Search, MessageCircle, Phone, CalendarCheck, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState([
    {
      id: 'SUB-9021',
      name: 'Mohammed Anas',
      phone: '+91 98421 23456',
      area: 'RS Puram',
      plan: 'Active Plan (2 meals/day)',
      status: 'Active',
      cycle: 'Weekly',
      nextBilling: 'Sun, 12 Oct',
      joinedDate: '12 Sep 2026',
      mealsDelivered: 28,
    },
    {
      id: 'SUB-8812',
      name: 'Dr. Soundarya V.',
      phone: '+91 98432 54321',
      area: 'Peelamedu',
      plan: 'Starter Plan (1 meal/day)',
      status: 'Active',
      cycle: 'Monthly',
      nextBilling: '28 Oct 2026',
      joinedDate: '1 Aug 2026',
      mealsDelivered: 64,
    },
    {
      id: 'SUB-7640',
      name: 'Gokul Prasad',
      phone: '+91 97890 12345',
      area: 'Saravanampatti',
      plan: 'Athlete High-Protein (2 meals)',
      status: 'Active',
      cycle: 'Monthly',
      nextBilling: '18 Oct 2026',
      joinedDate: '15 Aug 2026',
      mealsDelivered: 48,
    },
    {
      id: 'SUB-6520',
      name: 'Meenakshi Sundaram',
      phone: '+91 94431 98765',
      area: 'Saibaba Colony',
      plan: 'Care & Vitality (1 meal/day)',
      status: 'Paused',
      cycle: 'Monthly',
      nextBilling: 'Paused until 10 Oct',
      joinedDate: '10 Jul 2026',
      mealsDelivered: 72,
    },
    {
      id: 'SUB-5419',
      name: 'Vignesh Balaji',
      phone: '+91 98940 33445',
      area: 'Race Course',
      plan: 'Active Plan (2 meals/day)',
      status: 'Active',
      cycle: 'Weekly',
      nextBilling: 'Sun, 12 Oct',
      joinedDate: '25 Sep 2026',
      mealsDelivered: 12,
    },
  ]);

  const [search, setSearch] = useState('');

  const filtered = subscribers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.area.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-gray-900">
            Active Coimbatore Subscribers
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Member plans, recurring billing dates, and WhatsApp concierge actions.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl">
            Active: 4 Members
          </span>
          <span className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-xl">
            Paused: 1 Member
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by subscriber name, area, or phone..."
          className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:border-primary"
        />
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-bold">
              <th className="p-4">Subscriber</th>
              <th className="p-4">Area</th>
              <th className="p-4">Plan Tier</th>
              <th className="p-4">Cycle</th>
              <th className="p-4">Next Billing</th>
              <th className="p-4 text-center">Meals Done</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50/50">
                <td className="p-4 font-bold text-gray-900">
                  <p>{sub.name}</p>
                  <p className="text-[11px] text-gray-400 font-normal">{sub.phone}</p>
                </td>
                <td className="p-4 font-semibold text-gray-800">{sub.area}</td>
                <td className="p-4 font-semibold text-primary">{sub.plan}</td>
                <td className="p-4 text-gray-600 capitalize">{sub.cycle}</td>
                <td className="p-4 font-medium text-gray-800">{sub.nextBilling}</td>
                <td className="p-4 text-center font-bold text-gray-900">{sub.mealsDelivered}</td>
                <td className="p-4">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      sub.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {sub.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <a
                    href={`https://wa.me/${sub.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#25D366] hover:underline font-bold text-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-[#25D366] text-[#25D366]" />
                    <span>WhatsApp</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
