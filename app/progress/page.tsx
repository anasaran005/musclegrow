'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import {
  TrendingDown,
  Dumbbell,
  Flame,
  Award,
  Calendar,
  Plus,
  Scale,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { ProgressRing } from '@/components/ui/ProgressRing';

export default function ProgressPage() {
  const { user, setUser } = useAppStore();

  const [weightLogs, setWeightLogs] = useState([
    { date: 'Today', weight: user.weightKg || 70 },
    { date: '1 week ago', weight: 70.8 },
    { date: '2 weeks ago', weight: 71.5 },
    { date: '3 weeks ago', weight: 72.4 },
  ]);

  const [newWeight, setNewWeight] = useState('');
  const [showLogModal, setShowLogModal] = useState(false);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight) return;
    const wt = parseFloat(newWeight);
    setWeightLogs([{ date: 'Just now', weight: wt }, ...weightLogs]);
    setUser({ weightKg: wt });
    setNewWeight('');
    setShowLogModal(false);
  };

  // Weekly compliance data
  const weekData = [
    { day: 'Mon', protein: 142, targetP: 140, calories: 2180, targetC: 2200 },
    { day: 'Tue', protein: 138, targetP: 140, calories: 2150, targetC: 2200 },
    { day: 'Wed', protein: 145, targetP: 140, calories: 2240, targetC: 2200 },
    { day: 'Thu', protein: 140, targetP: 140, calories: 2200, targetC: 2200 },
    { day: 'Fri', protein: 144, targetP: 140, calories: 2210, targetC: 2200 },
    { day: 'Sat', protein: 135, targetP: 140, calories: 2100, targetC: 2200 },
  ];

  const totalLost = (weightLogs[weightLogs.length - 1].weight - weightLogs[0].weight).toFixed(1);

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <section className="bg-white border-b border-gray-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-heading font-black text-2xl text-gray-900">
              Health & Macro Progress
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Weekly consistency charts, weight trajectory, and habit streaks.
            </p>
          </div>

          <button
            onClick={() => setShowLogModal(true)}
            className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm tap-active"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Weight</span>
          </button>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Top Cards: Streak & Weight delta */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-xl">
              🔥
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Current Streak</p>
              <h3 className="font-heading font-black text-2xl text-gray-900">14 Days</h3>
              <p className="text-[11px] text-emerald-600 font-semibold">Top 5% in Coimbatore</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Current Weight</p>
              <h3 className="font-heading font-black text-2xl text-gray-900">{weightLogs[0].weight} kg</h3>
              <p className="text-[11px] text-gray-500 font-medium">Target: {user.targetWeightKg || 73} kg</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xl">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">3-Week Change</p>
              <h3 className="font-heading font-black text-2xl text-gray-900">
                {Number(totalLost) < 0 ? `${Math.abs(Number(totalLost))} kg` : `-${totalLost} kg`}
              </h3>
              <p className="text-[11px] text-emerald-600 font-semibold">Consistent trajectory</p>
            </div>
          </div>
        </div>

        {/* Weekly Macro Adherence Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-2">
            <div>
              <h3 className="font-heading font-black text-xl text-gray-900">
                Weekly Macro Consistency
              </h3>
              <p className="text-xs text-gray-500">
                Mon-Sat actual protein and calories delivered vs target.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span>Protein (140g target)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-orange-400 inline-block" />
                <span>Calories</span>
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-6">
            <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-48 sm:h-56 pb-4 border-b border-gray-200">
              {weekData.map((d) => {
                const proteinHeight = Math.min(100, Math.round((d.protein / 160) * 100));
                const calHeight = Math.min(100, Math.round((d.calories / 2500) * 100));

                return (
                  <div key={d.day} className="flex flex-col items-center h-full justify-end gap-1 group">
                    <span className="text-[10px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.protein}g
                    </span>
                    <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full">
                      {/* Protein bar */}
                      <div
                        style={{ height: `${proteinHeight}%` }}
                        className="w-1/2 bg-emerald-500 rounded-t-lg transition-all hover:bg-emerald-600"
                        title={`${d.day}: ${d.protein}g protein`}
                      />
                      {/* Calorie bar */}
                      <div
                        style={{ height: `${calHeight}%` }}
                        className="w-1/2 bg-orange-400 rounded-t-lg transition-all hover:bg-orange-500"
                        title={`${d.day}: ${d.calories} kcal`}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-700 mt-2">{d.day}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <span>Overall weekly adherence: <strong className="text-emerald-700">98.2%</strong></span>
              <span>Sunday: Kitchen deep sanitization rest day</span>
            </div>
          </div>
        </div>

        {/* Weight Log History */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-black text-lg text-gray-900">
              Weight Log History
            </h3>
            <span className="text-xs text-gray-400 font-semibold">Updated weekly</span>
          </div>

          <div className="divide-y divide-gray-100">
            {weightLogs.map((log, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-700">{log.date}</span>
                <span className="font-heading font-black text-sm text-gray-900">
                  {log.weight} kg
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Log Weight Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="font-heading font-black text-lg text-gray-900 mb-2">
              Log Today's Weight
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Step on your bathroom scale first thing in the morning for best accuracy.
            </p>

            <form onSubmit={handleAddLog} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Weight in Kilograms (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="e.g. 71.2"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-900 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newWeight}
                  className="w-1/2 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md tap-active"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
