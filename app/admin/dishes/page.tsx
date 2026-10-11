'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import boxesData from '@/data/boxes.json';
import sidesData from '@/data/sides.json';
import addonsData from '@/data/addons.json';
import { Box, SideBox, AddonDrink } from '@/types';
import { Layers, Plus, Search, Sparkles, Scale, GlassWater, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { MENU_30_DAYS, DietType } from '@/lib/menu-engine';

export default function AdminDishesPage() {
  const [activeTab, setActiveTab] = useState<'30day' | 'boxes' | 'sides' | 'drinks'>('30day');
  const [dietFilter, setDietFilter] = useState<DietType>('non-veg');
  const [search, setSearch] = useState('');

  const boxes = boxesData as Box[];
  const sides = sidesData as SideBox[];
  const addons = addonsData as AddonDrink[];

  const filteredBoxes = boxes.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()) || b.day.toLowerCase().includes(search.toLowerCase()));
  const filteredSides = sides.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
  const filteredDrinks = addons.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));
  const filtered30Days = (MENU_30_DAYS || []).filter((d: any) => {
    const box = dietFilter === 'non-veg' ? d.nonVeg : d.veg;
    const text = `${d.day} ${box.items.main.name} ${box.items.proteinSide.name} ${box.items.legume.name} ${box.items.salad.name} ${box.items.carb.name}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-gray-900">
            Dish Catalog & 30-Day Master Menu
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Gramwise official 30-day rotation, item codes, macros, allergens, and kitchen batch costs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('30day')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === '30day' ? 'bg-primary text-white shadow-xs' : 'bg-white border text-gray-700'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>30-Day Menu</span>
          </button>
          <button
            onClick={() => setActiveTab('boxes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'boxes' ? 'bg-primary text-white shadow-xs' : 'bg-white border text-gray-700'
            }`}
          >
            Cycle 1 Boxes
          </button>
          <button
            onClick={() => setActiveTab('sides')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'sides' ? 'bg-primary text-white shadow-xs' : 'bg-white border text-gray-700'
            }`}
          >
            Sides
          </button>
          <button
            onClick={() => setActiveTab('drinks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'drinks' ? 'bg-primary text-white shadow-xs' : 'bg-white border text-gray-700'
            }`}
          >
            Juices
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items, ingredients, days..."
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:border-primary"
          />
        </div>

        {activeTab === '30day' && (
          <div className="inline-flex p-1 bg-white border border-gray-200 rounded-xl shadow-2xs">
            <button
              onClick={() => setDietFilter('non-veg')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                dietFilter === 'non-veg' ? 'bg-primary text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Non-Veg (70% Split)
            </button>
            <button
              onClick={() => setDietFilter('veg')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                dietFilter === 'veg' ? 'bg-primary text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Veg (30% Split)
            </button>
          </div>
        )}
      </div>

      {/* 30-Day Master Menu Table */}
      {activeTab === '30day' && (
        <div className="space-y-4">
          {/* Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Dietary Cycle</span>
              <p className="text-lg font-black text-gray-900 font-heading">
                {dietFilter === 'non-veg' ? 'High-Protein Non-Veg' : 'High-Protein Veg'}
              </p>
              <span className="text-[11px] text-gray-500 font-medium">30 Unique Daily Boxes (Cycles 1–5)</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">30-Day Avg Protein</span>
              <p className="text-lg font-black text-emerald-700 font-heading">
                {dietFilter === 'non-veg' ? '75.4g' : '40.0g'}
              </p>
              <span className="text-[11px] text-gray-500 font-medium">
                {dietFilter === 'non-veg' ? 'Min 58.6g • Max 81.4g' : 'Min 29.5g • Max 47.6g'}
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">30-Day Avg Calories</span>
              <p className="text-lg font-black text-orange-700 font-heading">
                {dietFilter === 'non-veg' ? '870 kcal' : '747 kcal'}
              </p>
              <span className="text-[11px] text-gray-500 font-medium">Lab Calibrated Nin/Usda</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Avg Cost / Box</span>
              <p className="text-lg font-black text-primary font-heading">
                {dietFilter === 'non-veg' ? '₹115.27' : '₹72.70'}
              </p>
              <span className="text-[11px] text-gray-500 font-medium">Procurement + Gas</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-bold">
                  <th className="p-3.5">Day</th>
                  <th className="p-3.5">Cycle</th>
                  <th className="p-3.5">Main Protein (1)</th>
                  <th className="p-3.5">{dietFilter === 'non-veg' ? 'Side (2)' : 'Curd (2)'}</th>
                  <th className="p-3.5">Legume / Sprout (3)</th>
                  <th className="p-3.5">Salad (4)</th>
                  <th className="p-3.5">Carb (5)</th>
                  <th className="p-3.5 text-center">Calories</th>
                  <th className="p-3.5 text-center">Protein</th>
                  <th className="p-3.5 text-center">Carbs</th>
                  <th className="p-3.5 text-center">Fat</th>
                  <th className="p-3.5">Allergens</th>
                  <th className="p-3.5 text-right">Cost (Proc+Gas)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered30Days.map((d: any) => {
                  const box = dietFilter === 'non-veg' ? d.nonVeg : d.veg;
                  return (
                    <tr key={d.day} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-3.5 font-black text-primary font-heading text-sm">
                        Day {d.day}
                      </td>
                      <td className="p-3.5 font-bold text-gray-400">
                        C{d.cycle}
                      </td>
                      <td className="p-3.5 font-bold text-gray-900">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                            {box.itemCodes?.main}
                          </span>
                          <span>{box.items.main.name}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-gray-700">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                            {box.itemCodes?.proteinSide}
                          </span>
                          <span>{box.items.proteinSide.name}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-gray-700">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                            {box.itemCodes?.legume}
                          </span>
                          <span>{box.items.legume.name}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-gray-700">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                            {box.itemCodes?.salad}
                          </span>
                          <span>{box.items.salad.name}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-gray-700">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                            {box.itemCodes?.carb}
                          </span>
                          <span>{box.items.carb.name}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-center font-bold text-orange-700">
                        {box.totals.calories}
                      </td>
                      <td className="p-3.5 text-center font-bold text-emerald-700">
                        {box.totals.protein}g
                      </td>
                      <td className="p-3.5 text-center font-medium text-amber-700">
                        {box.totals.carbs}g
                      </td>
                      <td className="p-3.5 text-center font-medium text-purple-700">
                        {box.totals.fat}g
                      </td>
                      <td className="p-3.5 text-[11px] text-gray-500">
                        {box.allergens?.join(', ') || 'None'}
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold text-gray-900">
                        ₹{(box.costs?.procurement + box.costs?.gas).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
