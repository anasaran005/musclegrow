'use client';

import React, { useState } from 'react';
import { Bike, MapPin, Search, Check, Clock, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminDeliveriesPage() {
  const [deliveries, setDeliveries] = useState([
    {
      id: 'DEL-101',
      customer: 'Mohammed Anas',
      phone: '+91 98421 23456',
      area: 'RS Puram',
      slot: 'Lunch (12:00-1:30 PM)',
      dish: 'Chettinad Chicken & Foxtail Millet',
      rider: 'Murugan S.',
      status: 'Out for Delivery',
    },
    {
      id: 'DEL-102',
      customer: 'Dr. Soundarya V.',
      phone: '+91 98432 54321',
      area: 'Peelamedu',
      slot: 'Lunch (12:00-1:30 PM)',
      dish: 'Kongu Country Chicken & Red Rice',
      rider: 'Karthik K.',
      status: 'Out for Delivery',
    },
    {
      id: 'DEL-103',
      customer: 'Gokul Prasad',
      phone: '+91 97890 12345',
      area: 'Saravanampatti',
      slot: 'Lunch (12:00-1:30 PM)',
      dish: 'Sprouted Kollu & Tofu Bowl',
      rider: 'Ramesh R.',
      status: 'Packed',
    },
    {
      id: 'DEL-104',
      customer: 'Meenakshi Sundaram',
      phone: '+91 94431 98765',
      area: 'Saibaba Colony',
      slot: 'Dinner (7:00-8:30 PM)',
      dish: 'Tri-Dal Palak Khichdi',
      rider: 'Unassigned',
      status: 'Kitchen Prepping',
    },
    {
      id: 'DEL-105',
      customer: 'Vignesh Balaji',
      phone: '+91 98940 33445',
      area: 'Race Course',
      slot: 'Dinner (7:00-8:30 PM)',
      dish: 'Tandoori Tikka & Quinoa Pilaf',
      rider: 'Unassigned',
      status: 'Kitchen Prepping',
    },
  ]);

  const [selectedArea, setSelectedArea] = useState('All');

  const toggleStatus = (id: string) => {
    setDeliveries(
      deliveries.map((d) => {
        if (d.id === id) {
          const next =
            d.status === 'Kitchen Prepping'
              ? 'Packed'
              : d.status === 'Packed'
              ? 'Out for Delivery'
              : 'Delivered';
          return { ...d, status: next };
        }
        return d;
      })
    );
  };

  const filtered = selectedArea === 'All'
    ? deliveries
    : deliveries.filter((d) => d.area === selectedArea);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-gray-900">
            Delivery Dispatch & Riders
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Coimbatore live routing and status updates.
          </p>
        </div>

        {/* Area Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500">Filter Area:</span>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-primary"
          >
            <option value="All">All Coimbatore Areas</option>
            <option value="RS Puram">RS Puram</option>
            <option value="Peelamedu">Peelamedu</option>
            <option value="Saibaba Colony">Saibaba Colony</option>
            <option value="Saravanampatti">Saravanampatti</option>
            <option value="Race Course">Race Course</option>
          </select>
        </div>
      </div>

      {/* Deliveries Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-bold">
              <th className="p-4">Delivery ID</th>
              <th className="p-4">Subscriber</th>
              <th className="p-4">Area</th>
              <th className="p-4">Slot</th>
              <th className="p-4">Dish Assigned</th>
              <th className="p-4">Rider</th>
              <th className="p-4">Live Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50/50">
                <td className="p-4 font-heading font-bold text-gray-900">{d.id}</td>
                <td className="p-4">
                  <p className="font-bold text-gray-900">{d.customer}</p>
                  <p className="text-gray-400 text-[11px]">{d.phone}</p>
                </td>
                <td className="p-4 font-semibold text-gray-800">{d.area}</td>
                <td className="p-4 text-gray-600">{d.slot}</td>
                <td className="p-4 font-medium text-gray-800">{d.dish}</td>
                <td className="p-4 font-semibold text-primary">{d.rider}</td>
                <td className="p-4">
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase",
                      d.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : d.status === 'Out for Delivery'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-700'
                    )}
                  >
                    {d.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => toggleStatus(d.id)}
                    className="text-xs font-bold text-primary hover:underline bg-primary-light/60 px-3 py-1.5 rounded-lg"
                  >
                    Advance Status →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
