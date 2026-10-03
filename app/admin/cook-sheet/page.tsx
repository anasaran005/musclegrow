'use client';

import React, { useState, useMemo } from 'react';
import {
  ChefHat,
  Printer,
  Download,
  Scale,
  Clock,
  MapPin,
  CheckCircle2,
  Leaf,
  Layers,
  Sparkles,
  Drumstick,
  Calendar,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';
import {
  getMenuForDate,
  getNextBookableDays,
  getEarliestBookableDate,
  DailyMenuResult,
} from '@/lib/menu-engine';
import sidesData from '@/data/sides.json';
import addonsData from '@/data/addons.json';
import { SideBox, AddonDrink } from '@/types';
import { cn } from '@/lib/utils';

export default function AdminCookSheetPage() {
  const earliest = useMemo(() => getEarliestBookableDate(), []);
  const bookableDays = useMemo(() => getNextBookableDays(6), []);

  const [selectedDateStr, setSelectedDateStr] = useState<string>(earliest.dateStr);

  const sides = sidesData as SideBox[];
  const addons = addonsData as AddonDrink[];

  // Menus for selected date
  const nvMenu: DailyMenuResult = useMemo(() => {
    return getMenuForDate(selectedDateStr, 'non-veg');
  }, [selectedDateStr]);

  const vMenu: DailyMenuResult = useMemo(() => {
    return getMenuForDate(selectedDateStr, 'veg');
  }, [selectedDateStr]);

  // Production batch counts for tomorrow
  const nonVegBoxCount = 165;
  const vegBoxCount = 75;
  const totalBoxPortions = nonVegBoxCount + vegBoxCount; // 240 boxes

  // 2-Meal dinner variant subscribers: 45 users receive dinner boxes with shifted salad/legume/carb
  const dinnerVariantCount = 45;
  const lunchOnlyCount = totalBoxPortions - dinnerVariantCount; // 195

  // Sides batch counts
  const sidesCounts = [
    { side: sides[0], count: 38 }, // Grilled Chicken with Salad
    { side: sides[1], count: 24 }, // Chicken Salad
    { side: sides[2], count: 30 }, // Chicken Post Workout Meal
    { side: sides[3], count: 22 }, // Grilled Paneer with Salad
    { side: sides[4], count: 18 }, // Paneer Salad
    { side: sides[5], count: 15 }, // Paneer Post Workout Meal
  ];
  const totalSides = sidesCounts.reduce((acc, s) => acc + s.count, 0);

  // Cold-pressed juices bottling
  const juiceCounts = [
    { addon: addons[0], count: 42 }, // Beetroot Elixir
    { addon: addons[1], count: 36 }, // Cucumber-Mint
    { addon: addons[2], count: 28 }, // Ooty Carrot
    { addon: addons[3], count: 34 }, // Nagpur Orange
  ];
  const totalJuices = juiceCounts.reduce((acc, j) => acc + j.count, 0);

  // Delivery list grouped by Coimbatore zones
  const deliveriesByArea = [
    {
      area: "RS Puram",
      pincode: "641002",
      nvBoxes: 38,
      vBoxes: 16,
      dinnerBoxes: 12,
      sides: 28,
      juices: 32,
      driver: "Murugan S. (+91 94432 87654)",
      dispatchTime: "11:30 AM",
      status: "Packing Staged",
    },
    {
      area: "Peelamedu & Hopes",
      pincode: "641004",
      nvBoxes: 34,
      vBoxes: 14,
      dinnerBoxes: 10,
      sides: 34,
      juices: 30,
      driver: "Senthil K. (+91 98431 11223)",
      dispatchTime: "11:35 AM",
      status: "Cooking",
    },
    {
      area: "Saibaba Colony",
      pincode: "641011",
      nvBoxes: 26,
      vBoxes: 10,
      dinnerBoxes: 8,
      sides: 22,
      juices: 24,
      driver: "Praveen M. (+91 97890 33445)",
      dispatchTime: "11:40 AM",
      status: "Staged",
    },
    {
      area: "Saravanampatti (Tech Park)",
      pincode: "641035",
      nvBoxes: 30,
      vBoxes: 12,
      dinnerBoxes: 9,
      sides: 38,
      juices: 34,
      driver: "Vignesh R. (+91 96554 88990)",
      dispatchTime: "11:15 AM",
      status: "Departed",
    },
    {
      area: "Race Course",
      pincode: "641018",
      nvBoxes: 20,
      vBoxes: 13,
      dinnerBoxes: 6,
      sides: 25,
      juices: 20,
      driver: "Karthik D. (+91 94860 44556)",
      dispatchTime: "11:45 AM",
      status: "Cooking",
    },
  ];

  // Export CSV Handler
  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        ["Gramwise Central Kitchen Production Sheet", selectedDateStr],
        [],
        ["Component", "Item Name", "Grams/Box", "Total Portions", "Total Raw Kitchen Batch"],
        ["NV Main", nvMenu.lunch.items.main.name, `${nvMenu.lunch.items.main.grams}g`, nonVegBoxCount, `${((nvMenu.lunch.items.main.grams * nonVegBoxCount) / 1000).toFixed(1)} kg`],
        ["Veg Main", vMenu.lunch.items.main.name, `${vMenu.lunch.items.main.grams}g`, vegBoxCount, `${((vMenu.lunch.items.main.grams * vegBoxCount) / 1000).toFixed(1)} kg`],
        ["NV Protein Side", nvMenu.lunch.items.proteinSide.name, "90g", nonVegBoxCount, `${nonVegBoxCount * 3} Boiled Egg Whites`],
        ["Veg Protein Side", vMenu.lunch.items.proteinSide.name, "100g", vegBoxCount, `${((100 * vegBoxCount) / 1000).toFixed(1)} kg Curd`],
        ["Lunch Salad", nvMenu.lunch.items.salad.name, "80g", lunchOnlyCount, `${((80 * lunchOnlyCount) / 1000).toFixed(1)} kg`],
        ["Dinner Salad (+2)", nvMenu.dinner.items.salad.name, "80g", dinnerVariantCount, `${((80 * dinnerVariantCount) / 1000).toFixed(1)} kg`],
        ["Lunch Legume", nvMenu.lunch.items.legume.name, "100g", lunchOnlyCount, `${((100 * lunchOnlyCount) / 1000).toFixed(1)} kg`],
        ["Dinner Legume (+3)", nvMenu.dinner.items.legume.name, "100g", dinnerVariantCount, `${((100 * dinnerVariantCount) / 1000).toFixed(1)} kg`],
        ["Lunch Carb", nvMenu.lunch.items.carb.name, "Portion", lunchOnlyCount, `${lunchOnlyCount} portions`],
        ["Dinner Carb (+3)", nvMenu.dinner.items.carb.name, "Portion", dinnerVariantCount, `${dinnerVariantCount} portions`],
      ]
        .map((e) => e.join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `gramwise-cooksheet-${selectedDateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-[#124233]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Live Central Kitchen Cook Sheet • Digital Scale Weighing
            </span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-gray-900 mt-1">
            Production Sheet: {nvMenu.dayName} ({selectedDateStr})
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            RS Puram Central Kitchen • Cutoff locked strictly at 9:00 PM previous evening • 0 Food Wastage
          </p>
        </div>

        {/* Date Selector & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-bold">
            {bookableDays.map((b) => (
              <button
                key={b.dateStr}
                onClick={() => setSelectedDateStr(b.dateStr)}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-all",
                  selectedDateStr === b.dateStr
                    ? "bg-[#124233] text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                {b.dayOfWeek}
              </button>
            ))}
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-xs hover:bg-gray-50"
          >
            <Printer className="w-4 h-4 text-[#124233]" />
            <span>Print Sheet</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-[#124233] text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-xs hover:bg-[#0E3529]"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Production Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-gray-400">Total Boxes Cooked</span>
          <p className="font-heading font-black text-3xl text-gray-900 mt-1">{totalBoxPortions} Boxes</p>
          <span className="text-[11px] text-[#899545] font-semibold">{lunchOnlyCount} Lunch • {dinnerVariantCount} Dinner</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-amber-700">Non-Veg Box Count</span>
          <p className="font-heading font-black text-3xl text-amber-900 mt-1">{nonVegBoxCount} Boxes</p>
          <span className="text-[11px] text-gray-500 truncate block">{nvMenu.lunch.items.main.name}</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-emerald-700">Vegetarian Box Count</span>
          <p className="font-heading font-black text-3xl text-emerald-800 mt-1">{vegBoxCount} Boxes</p>
          <span className="text-[11px] text-gray-500 truncate block">{vMenu.lunch.items.main.name}</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-gray-400">Sides &amp; Juices Batch</span>
          <p className="font-heading font-black text-3xl text-[#124233] mt-1">{totalSides + totalJuices} Units</p>
          <span className="text-[11px] text-gray-500">{totalSides} Sides • {totalJuices} Bottles</span>
        </div>
      </div>

      {/* 5-Item Component Weighed Batch Breakdown */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
          <div>
            <h3 className="font-heading font-black text-base text-gray-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#899545]" />
              <span>Tomorrow&apos;s Weighed Kitchen Batches (Mains, Sides, Salads, Legumes, Carbs)</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              195 standard lunch boxes + 45 dinner rotation boxes with shifted sides.
            </p>
          </div>
          <span className="text-xs font-bold bg-[#E8F1D4] text-[#124233] px-3 py-1 rounded-full">
            Exact Scale Calibration
          </span>
        </div>

        {/* Mains & Protein Sides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Non-Veg Production Card */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-sm text-amber-950 flex items-center gap-1.5">
                <Drumstick className="w-4 h-4 text-amber-700" />
                <span>Non-Veg Batch: {nvMenu.lunch.items.main.name}</span>
              </span>
              <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                {nonVegBoxCount} portions
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-amber-200">
                <span className="text-[10px] text-gray-400 block font-bold uppercase">Raw Meat Requirement</span>
                <span className="font-heading font-black text-lg text-amber-900 block mt-0.5">
                  {((nvMenu.lunch.items.main.grams * nonVegBoxCount) / 1000).toFixed(1)} kg
                </span>
                <span className="text-[10px] text-gray-500">{nvMenu.lunch.items.main.grams}g raw / portion</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-200">
                <span className="text-[10px] text-gray-400 block font-bold uppercase">Boiled Egg Whites</span>
                <span className="font-heading font-black text-lg text-amber-900 block mt-0.5">
                  {nonVegBoxCount * 3} Eggs
                </span>
                <span className="text-[10px] text-gray-500">3 egg whites / box (90g)</span>
              </div>
            </div>
          </div>

          {/* Veg Production Card */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-sm text-emerald-950 flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-700" />
                <span>Vegetarian Batch: {vMenu.lunch.items.main.name}</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {vegBoxCount} portions
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-emerald-200">
                <span className="text-[10px] text-gray-400 block font-bold uppercase">Raw Protein Requirement</span>
                <span className="font-heading font-black text-lg text-emerald-900 block mt-0.5">
                  {((vMenu.lunch.items.main.grams * vegBoxCount) / 1000).toFixed(1)} kg
                </span>
                <span className="text-[10px] text-gray-500">{vMenu.lunch.items.main.grams}g / portion</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-emerald-200">
                <span className="text-[10px] text-gray-400 block font-bold uppercase">Fresh Hung Curd Cups</span>
                <span className="font-heading font-black text-lg text-emerald-900 block mt-0.5">
                  {vegBoxCount} Cups
                </span>
                <span className="text-[10px] text-gray-500">{((100 * vegBoxCount) / 1000).toFixed(1)} kg A2 curd</span>
              </div>
            </div>
          </div>
        </div>

        {/* Salads, Legumes, and Carbs with Dinner Variant Rotations */}
        <div className="pt-3 border-t border-gray-100">
          <span className="text-xs font-extrabold uppercase tracking-wider text-gray-400 block mb-3">
            Rotational Sides Batch Requirements (Including Dinner Variants)
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Salads */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-2.5">
              <span className="font-heading font-bold text-sm text-gray-900 block">Salad Batches (80g / box)</span>
              <div className="p-2.5 bg-white rounded-xl border border-gray-100 flex justify-between">
                <div>
                  <span className="font-bold text-gray-900 block">{nvMenu.lunch.items.salad.name}</span>
                  <span className="text-[10px] text-gray-500">Lunch Standard ({lunchOnlyCount} boxes)</span>
                </div>
                <span className="font-heading font-black text-sm text-[#124233]">
                  {((80 * lunchOnlyCount) / 1000).toFixed(1)} kg
                </span>
              </div>
              <div className="p-2.5 bg-[#EDF5D3] rounded-xl border border-[#899545]/20 flex justify-between">
                <div>
                  <span className="font-bold text-[#124233] block">{nvMenu.dinner.items.salad.name}</span>
                  <span className="text-[10px] text-[#899545] font-semibold">Dinner Variant (+2 slots, {dinnerVariantCount} boxes)</span>
                </div>
                <span className="font-heading font-black text-sm text-[#124233]">
                  {((80 * dinnerVariantCount) / 1000).toFixed(1)} kg
                </span>
              </div>
            </div>

            {/* Legumes */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-2.5">
              <span className="font-heading font-bold text-sm text-gray-900 block">Legume Batches (100g / box)</span>
              <div className="p-2.5 bg-white rounded-xl border border-gray-100 flex justify-between">
                <div>
                  <span className="font-bold text-gray-900 block">{nvMenu.lunch.items.legume.name}</span>
                  <span className="text-[10px] text-gray-500">Lunch Standard ({lunchOnlyCount} boxes)</span>
                </div>
                <span className="font-heading font-black text-sm text-[#124233]">
                  {((100 * lunchOnlyCount) / 1000).toFixed(1)} kg
                </span>
              </div>
              <div className="p-2.5 bg-[#EDF5D3] rounded-xl border border-[#899545]/20 flex justify-between">
                <div>
                  <span className="font-bold text-[#124233] block">{nvMenu.dinner.items.legume.name}</span>
                  <span className="text-[10px] text-[#899545] font-semibold">Dinner Variant (+3 slots, {dinnerVariantCount} boxes)</span>
                </div>
                <span className="font-heading font-black text-sm text-[#124233]">
                  {((100 * dinnerVariantCount) / 1000).toFixed(1)} kg
                </span>
              </div>
            </div>

            {/* Carbs */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-2.5">
              <span className="font-heading font-bold text-sm text-gray-900 block">Carb Batches</span>
              <div className="p-2.5 bg-white rounded-xl border border-gray-100 flex justify-between">
                <div>
                  <span className="font-bold text-gray-900 block">{nvMenu.lunch.items.carb.name}</span>
                  <span className="text-[10px] text-gray-500">Lunch Standard</span>
                </div>
                <span className="font-heading font-black text-sm text-[#124233]">
                  {lunchOnlyCount} portions
                </span>
              </div>
              <div className="p-2.5 bg-[#EDF5D3] rounded-xl border border-[#899545]/20 flex justify-between">
                <div>
                  <span className="font-bold text-[#124233] block">{nvMenu.dinner.items.carb.name}</span>
                  <span className="text-[10px] text-[#899545] font-semibold">Dinner Variant (+3 slots)</span>
                </div>
                <span className="font-heading font-black text-sm text-[#124233]">
                  {dinnerVariantCount} portions
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sides & Juices Batch Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sides Prep Table */}
        <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs">
          <h3 className="font-heading font-black text-sm text-gray-900 mb-3 flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#124233]" />
            <span>High-Protein Side Boxes Batch</span>
          </h3>

          <div className="space-y-2 text-xs">
            {sidesCounts.map((sc, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <div>
                  <span className="font-bold text-gray-900 block">{sc.side.name}</span>
                  <span className="text-[10px] text-gray-400">{sc.side.protein}g P • {sc.side.calories} kcal</span>
                </div>
                <span className="font-heading font-black text-sm text-[#124233]">
                  {sc.count} portions
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cold-Pressed Juices Table */}
        <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs">
          <h3 className="font-heading font-black text-sm text-gray-900 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>Cold-Pressed Juice Bottling (250 ml, Zero Added Sugar)</span>
          </h3>

          <div className="space-y-2 text-xs">
            {juiceCounts.map((jc, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <div>
                  <span className="font-bold text-gray-900 block">{jc.addon.name}</span>
                  <span className="text-[10px] text-amber-800">{jc.addon.sugar}</span>
                </div>
                <span className="font-heading font-black text-sm text-emerald-800">
                  {jc.count} bottles
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delivery List Grouped by Coimbatore Area */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-heading font-black text-base text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#124233]" />
              <span>Tomorrow&apos;s Delivery Distribution by Coimbatore Area</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Assigned route drivers for morning lunch (before 1:00 PM) &amp; evening dinner runs.
            </p>
          </div>
          <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
            5 Route Clusters
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                <th className="p-4">Delivery Cluster &amp; Pincode</th>
                <th className="p-4 text-center">NV Boxes</th>
                <th className="p-4 text-center">Veg Boxes</th>
                <th className="p-4 text-center">Dinner Variants</th>
                <th className="p-4 text-center">Sides</th>
                <th className="p-4 text-center">Juices</th>
                <th className="p-4">Assigned Driver &amp; Contact</th>
                <th className="p-4">Target Window</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {deliveriesByArea.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/60">
                  <td className="p-4 font-bold text-gray-900">
                    <div>{row.area}</div>
                    <span className="text-[10px] text-gray-400 font-normal">{row.pincode}</span>
                  </td>
                  <td className="p-4 text-center font-bold text-amber-900">{row.nvBoxes}</td>
                  <td className="p-4 text-center font-bold text-emerald-800">{row.vBoxes}</td>
                  <td className="p-4 text-center font-bold text-[#899545]">{row.dinnerBoxes}</td>
                  <td className="p-4 text-center font-bold text-gray-700">{row.sides}</td>
                  <td className="p-4 text-center font-bold text-amber-700">{row.juices}</td>
                  <td className="p-4 text-gray-700 font-medium">{row.driver}</td>
                  <td className="p-4 font-semibold text-gray-800">{row.dispatchTime}</td>
                  <td className="p-4">
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
