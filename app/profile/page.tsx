'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { Address } from '@/types';
import { BRAND } from '@/config/brand';
import {
  User,
  MapPin,
  ShieldCheck,
  Bell,
  HelpCircle,
  LogOut,
  Plus,
  X,
  Check,
  ChevronRight,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, addresses, addAddress, selectedAddressId, setSelectedAddressId, logout } = useAppStore();

  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [flatNumber, setFlatNumber] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('RS Puram');
  const [pincode, setPincode] = useState('641002');
  const [tag, setTag] = useState<'Home' | 'Work' | 'Other'>('Home');

  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [cutoffReminders, setCutoffReminders] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flatNumber || !street) return;

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      name: user.fullName || 'Mohammed Anas',
      phone: user.phone || '+91 98421 23456',
      tag,
      flatNumber,
      street,
      area,
      pincode,
      city: 'Coimbatore',
      isDefault: false,
    };

    addAddress(newAddr);
    setShowAddAddressModal(false);
    setFlatNumber('');
    setStreet('');
    showToast('New delivery address added successfully!');
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <section className="bg-white border-b border-gray-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-primary text-lime-brand flex items-center justify-center font-heading font-black text-xl shadow-md">
              {user.fullName ? user.fullName.split(' ').map(n => n[0]).join('') : 'MA'}
            </div>
            <div>
              <h1 className="font-heading font-black text-2xl text-gray-900">
                {user.fullName || 'Mohammed Anas'}
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                +91 {user.phone || '98421 23456'} • Coimbatore Member
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </section>

      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-4 z-50 bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
          <Check className="w-4 h-4 text-lime-brand stroke-[3]" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Addresses Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-black text-lg text-gray-900">
                Saved Delivery Addresses
              </h3>
            </div>
            <button
              onClick={() => setShowAddAddressModal(true)}
              className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1 bg-primary-light px-3 py-1.5 rounded-xl tap-active"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New</span>
            </button>
          </div>

          <div className="space-y-3">
            {addresses.map((addr) => {
              const isSelected = selectedAddressId === addr.id;
              return (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={cn(
                    "cursor-pointer p-4 rounded-2xl border-2 transition-all tap-active flex items-start justify-between gap-3",
                    isSelected
                      ? "border-primary bg-primary-light/10 ring-2 ring-primary/20"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className="text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-heading font-bold text-sm text-gray-900">
                        {addr.name}
                      </span>
                      <span className="font-bold text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {addr.tag}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">{addr.flatNumber}, {addr.street}</p>
                    <p className="text-gray-500">{addr.area}, {addr.city} - {addr.pincode}</p>
                    <p className="text-gray-400 mt-1 font-medium">Contact: {addr.phone}</p>
                  </div>

                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5",
                    isSelected ? "border-primary bg-primary text-white" : "border-gray-300"
                  )}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dietary Profile & Goals */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-black text-lg text-gray-900">
                Dietary & Macro Profile
              </h3>
            </div>
            <Link
              href="/onboarding"
              className="text-xs font-bold text-primary hover:underline"
            >
              Re-take Quiz
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <span className="text-[10px] uppercase font-bold text-gray-400">Current Goal</span>
              <p className="font-heading font-black text-sm text-gray-900 capitalize mt-0.5">
                {user.goal.replace('-', ' ')}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <span className="text-[10px] uppercase font-bold text-gray-400">Diet Type</span>
              <p className="font-heading font-black text-sm text-gray-900 capitalize mt-0.5">
                {user.dietType}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <span className="text-[10px] uppercase font-bold text-emerald-700">Daily Protein</span>
              <p className="font-heading font-black text-sm text-emerald-900 mt-0.5">
                {user.calculatedTargets?.protein || 140}g
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <span className="text-[10px] uppercase font-bold text-orange-700">Daily Calories</span>
              <p className="font-heading font-black text-sm text-orange-900 mt-0.5">
                {user.calculatedTargets?.calories || 2200} kcal
              </p>
            </div>
          </div>

          {/* Allergies list */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500 font-semibold">Active Allergens Filtered:</span>
            <div className="flex flex-wrap gap-1">
              {user.allergies && user.allergies.length > 0 ? (
                user.allergies.map((a) => (
                  <span key={a} className="bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded">
                    {a}
                  </span>
                ))
              ) : (
                <span className="text-emerald-700 font-semibold">None (Full menu enabled)</span>
              )}
            </div>
          </div>
        </div>

        {/* Notifications & Preferences */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-black text-lg text-gray-900">
              Delivery Alerts & Notifications
            </h3>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-gray-900">WhatsApp Delivery Updates</p>
              <p className="text-gray-500">Live dispatch and rider tracking alerts sent to your phone.</p>
            </div>
            <input
              type="checkbox"
              checked={whatsappAlerts}
              onChange={() => setWhatsappAlerts(!whatsappAlerts)}
              className="accent-primary w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-2">
            <div>
              <p className="font-bold text-gray-900">8:00 PM Meal Swap Reminder</p>
              <p className="text-gray-500">Reminder to swap tomorrow’s lunch or dinner before the 9 PM cutoff.</p>
            </div>
            <input
              type="checkbox"
              checked={cutoffReminders}
              onChange={() => setCutoffReminders(!cutoffReminders)}
              className="accent-primary w-4 h-4 cursor-pointer"
            />
          </div>
        </div>

        {/* Support & Kitchen Help */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-heading font-black text-base text-gray-900">
              Need assistance with your plan?
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Our Coimbatore kitchen team and founder clinical nutritionist are here to help.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={`https://wa.me/${BRAND.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm tap-active"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
            <a
              href={`tel:${BRAND.phone}`}
              className="flex-1 sm:flex-initial bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 tap-active"
            >
              <Phone className="w-4 h-4" />
              <span>Call Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="font-heading font-black text-lg text-gray-900">
                Add Coimbatore Address
              </h3>
              <button onClick={() => setShowAddAddressModal(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4 my-4">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Tag
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Home', 'Work', 'Other'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTag(t)}
                      className={cn(
                        "py-2 rounded-xl text-xs font-bold border transition-all",
                        tag === t ? "bg-primary text-white border-primary" : "bg-gray-50 text-gray-700 border-gray-200"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Flat / House / Door No.
                </label>
                <input
                  type="text"
                  required
                  value={flatNumber}
                  onChange={(e) => setFlatNumber(e.target.value)}
                  placeholder="e.g. 4B, Green Acres"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Street / Road / Landmark
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. Sambandam Road, near Avila Convent"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                    Area
                  </label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none"
                  >
                    <option value="RS Puram">RS Puram</option>
                    <option value="Saibaba Colony">Saibaba Colony</option>
                    <option value="Peelamedu">Peelamedu</option>
                    <option value="Race Course">Race Course</option>
                    <option value="Gandhipuram">Gandhipuram</option>
                    <option value="Saravanampatti">Saravanampatti</option>
                    <option value="Singanallur">Singanallur</option>
                    <option value="Vadavalli">Vadavalli</option>
                    <option value="Ganapathy">Ganapathy</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="w-1/2 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md tap-active"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
