'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import boxesData from '@/data/boxes.json';
import sidesData from '@/data/sides.json';
import addonsData from '@/data/addons.json';
import { Box, SideBox, AddonDrink } from '@/types';
import { Layers, Plus, Search, Sparkles, Scale, GlassWater } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminDishesPage() {
  const [activeTab, setActiveTab] = useState<'boxes' | 'sides' | 'drinks'>('boxes');
  const [search, setSearch] = useState('');

  const boxes = boxesData as Box[];
  const sides = sidesData as SideBox[];
  const addons = addonsData as AddonDrink[];

  const filteredBoxes = boxes.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()) || b.day.toLowerCase().includes(search.toLowerCase()));
  const filteredSides = sides.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
  const filteredDrinks = addons.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-gray-900">
            Weekly Boxes, Sides & Drinks Inventory
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Fixed 6-box rotation (Mon-Sat), 6 protein sides, and 4 cold-pressed drinks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('boxes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'boxes' ? 'bg-primary text-white shadow-xs' : 'bg-white border text-gray-700'
            }`}
          >
            6 Daily Boxes
          </button>
          <button
            onClick={() => setActiveTab('sides')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'sides' ? 'bg-primary text-white shadow-xs' : 'bg-white border text-gray-700'
            }`}
          >
            6 Sides
          </button>
          <button
            onClick={() => setActiveTab('drinks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'drinks' ? 'bg-primary text-white shadow-xs' : 'bg-white border text-gray-700'
            }`}
          >
            4 Juices
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter catalog..."
          className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:border-primary"
        />
      </div>

      {/* Boxes Table */}
      {activeTab === 'boxes' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-bold">
                <th className="p-4">Cook Day</th>
                <th className="p-4">Box Name & Main</th>
                <th className="p-4">Diet</th>
                <th className="p-4 text-center">Protein</th>
                <th className="p-4 text-center">Calories</th>
                <th className="p-4 text-center">Carbs</th>
                <th className="p-4 text-center">Fat</th>
                <th className="p-4">Subscription Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBoxes.map((box) => (
                <tr key={box.id} className="hover:bg-gray-50/50">
                  <td className="p-4 font-black text-primary font-heading">{box.day}</td>
                  <td className="p-4 font-bold text-gray-900">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                        <Image src={box.image} alt={box.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-heading font-bold text-gray-900">{box.name}</p>
                        <p className="text-[11px] text-gray-400">{box.items[0]?.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${box.isVeg ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                      {box.isVeg ? 'VEG' : 'NON-VEG'}
                    </span>
                  </td>
                  <td className="p-4 text-center font-bold text-emerald-700">{box.totals.protein}g</td>
                  <td className="p-4 text-center font-bold text-orange-700">{box.totals.calories}</td>
                  <td className="p-4 text-center font-medium text-amber-700">{box.totals.carbs}g</td>
                  <td className="p-4 text-center font-medium text-purple-700">{box.totals.fat}g</td>
                  <td className="p-4 font-heading font-black text-gray-900">{formatCurrency(box.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sides Table */}
      {activeTab === 'sides' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-bold">
                <th className="p-4">Side Box</th>
                <th className="p-4">Type</th>
                <th className="p-4 text-center">Protein</th>
                <th className="p-4 text-center">Calories</th>
                <th className="p-4 text-center">Carbs</th>
                <th className="p-4 text-center">Fat</th>
                <th className="p-4">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSides.map((side) => (
                <tr key={side.id} className="hover:bg-gray-50/50">
                  <td className="p-4 font-bold text-gray-900">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                        <Image src={side.image} alt={side.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-heading font-bold text-gray-900">{side.name}</p>
                        <p className="text-[11px] text-gray-400 line-clamp-1">{side.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${side.isVeg ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                      {side.isVeg ? 'VEG' : 'NON-VEG'}
                    </span>
                  </td>
                  <td className="p-4 text-center font-bold text-emerald-700">{side.protein}g</td>
                  <td className="p-4 text-center font-bold text-orange-700">{side.calories}</td>
                  <td className="p-4 text-center font-medium text-amber-700">{side.carbs}g</td>
                  <td className="p-4 text-center font-medium text-purple-700">{side.fat}g</td>
                  <td className="p-4 font-heading font-black text-gray-900">{formatCurrency(side.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Drinks Table */}
      {activeTab === 'drinks' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-bold">
                <th className="p-4">Drink Name (250 ml)</th>
                <th className="p-4">Natural Sugar Disclosure</th>
                <th className="p-4 text-center">Calories</th>
                <th className="p-4 text-center">Protein</th>
                <th className="p-4 text-center">Carbs</th>
                <th className="p-4">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDrinks.map((drink) => (
                <tr key={drink.id} className="hover:bg-gray-50/50">
                  <td className="p-4 font-bold text-gray-900">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                        <Image src={drink.image} alt={drink.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-heading font-bold text-gray-900">{drink.name}</p>
                        <p className="text-[11px] text-gray-400">{drink.volume}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-amber-800 bg-amber-50/50">
                    {drink.sugar}
                  </td>
                  <td className="p-4 text-center font-bold text-orange-700">{drink.calories}</td>
                  <td className="p-4 text-center font-medium text-emerald-700">{drink.protein}g</td>
                  <td className="p-4 text-center font-medium text-amber-700">{drink.carbs}g</td>
                  <td className="p-4 font-heading font-black text-gray-900">{formatCurrency(drink.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
