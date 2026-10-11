'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { BRAND } from '@/config/brand';
import couponsData from '@/data/coupons.json';
import sidesData from '@/data/sides.json';
import addonsData from '@/data/addons.json';
import { Coupon, SideBox, AddonDrink, Address } from '@/types';
import {
  MapPin,
  Clock,
  CreditCard,
  Tag,
  ShieldCheck,
  Check,
  ArrowRight,
  ChevronLeft,
  Sparkles,
  QrCode,
  Building,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { getZoneByPincode } from '@/lib/location';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    activeCheckoutType,
    trialOrder,
    weeklyOrder,
    monthlyOrder,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    appliedCoupon,
    applyCoupon,
    addAddress,
    currentLocation,
  } = useAppStore();

  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3 | 4>(1);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [paymentGatewayMethod, setPaymentGatewayMethod] = useState<'upi_autopay' | 'upi_qr' | 'cards' | 'netbanking'>('upi_qr');
  const [isProcessing, setIsProcessing] = useState(false);

  // New address modal / inline form state
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newArea, setNewArea] = useState('RS Puram');
  const [newPincode, setNewPincode] = useState('641002');
  const [newFlat, setNewFlat] = useState('');

  const sides = sidesData as SideBox[];
  const addons = addonsData as AddonDrink[];

  // Delivery fee calculation based on selected address / zone
  const selectedAddr = addresses.find((a) => a.id === selectedAddressId) || addresses[0];
  const pinToCheck = selectedAddr?.pincode || currentLocation?.pincode;
  const zoneInfo = pinToCheck ? getZoneByPincode(pinToCheck) : undefined;
  
  const isPhase2 = zoneInfo?.tier === 'phase2' || (!zoneInfo && currentLocation?.tier === 'phase2');
  const isOutOfRange = zoneInfo?.tier === 'out-of-range' || (!zoneInfo && currentLocation?.tier === 'out-of-range');
  const deliveryFee = isPhase2 ? (zoneInfo?.deliveryFee ?? 35) : 0;

  // Determine subtotal based on active order
  let subtotal = 299;
  let title = 'Daily Trial Box';
  let subtitle = 'Single Day 5-Item Protein Box';
  let mealsCount = 1;
  let lunchSlot = '12:00 PM - 1:30 PM';
  let dinnerSlot = '7:00 PM - 8:30 PM';

  if (activeCheckoutType === 'trial' && trialOrder) {
    subtotal = trialOrder.price;
    title = `Daily Trial Box (${trialOrder.dayName})`;
    subtitle = `${trialOrder.diet === 'non-veg' ? 'Non-Veg Protein' : 'Vegetarian Protein'} • ${trialOrder.mealsPerDay} meal(s)`;
    mealsCount = trialOrder.mealsPerDay;
    lunchSlot = trialOrder.lunchSlot;
    dinnerSlot = trialOrder.dinnerSlot;
  } else if (activeCheckoutType === 'weekly' && weeklyOrder) {
    subtotal = weeklyOrder.price;
    title = 'Weekly Routine (6-Day Mon–Sat)';
    subtitle = `${weeklyOrder.dietVariation.toUpperCase()} • ${weeklyOrder.mealsPerDay} meal(s)/day • ${6 - weeklyOrder.skippedDays.length} days active`;
    mealsCount = (6 - weeklyOrder.skippedDays.length) * weeklyOrder.mealsPerDay;
    lunchSlot = weeklyOrder.lunchSlot;
    dinnerSlot = weeklyOrder.dinnerSlot;
  } else if (activeCheckoutType === 'monthly' && monthlyOrder) {
    subtotal = monthlyOrder.price;
    title = 'Monthly Lifestyle Plan';
    subtitle = `24 Days Transformation • ${monthlyOrder.paymentMode === 'autopay' ? 'UPI AutoPay' : 'Prepaid'}`;
    mealsCount = (24 - monthlyOrder.skippedDays.length) * monthlyOrder.mealsPerDay;
    lunchSlot = monthlyOrder.lunchSlot;
    dinnerSlot = monthlyOrder.dinnerSlot;
  }

  // Coupon discount calculation
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'flat') {
      discount = appliedCoupon.discountValue;
    } else {
      discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
        discount = appliedCoupon.maxDiscount;
      }
    }
  }

  const finalTotal = Math.max(0, subtotal - discount + deliveryFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const clean = couponCodeInput.trim().toUpperCase();
    const found = (couponsData as Coupon[]).find((c) => c.code === clean);

    if (found) {
      if (subtotal >= found.minOrderValue) {
        applyCoupon(found);
        setCouponCodeInput('');
      } else {
        setCouponError(`Min order value for ${found.code} is ${formatCurrency(found.minOrderValue)}`);
      }
    } else {
      setCouponError('Invalid coupon code. Try PROTEIN50 or GRAMFIRST');
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet) return;
    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      name: 'Mohammed Anas',
      phone: '+91 98421 23456',
      tag: 'Home',
      flatNumber: newFlat || 'Flat 2A',
      street: newStreet,
      area: newArea,
      pincode: newPincode,
      city: 'Coimbatore',
      isDefault: false,
    };
    addAddress(newAddr);
    setSelectedAddressId(newAddr.id);
    setShowNewAddress(false);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      router.push('/checkout/success');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FBFDF8] text-[#124233] pb-32">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-[#124233] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="font-heading font-black text-sm text-[#124233]">
              {BRAND.name} Prepayment Checkout
            </span>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">
              100% Safe
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        {/* Cutoff Notice Banner */}
        <div className="bg-[#E8F1D4]/60 border border-[#899545]/30 rounded-2xl p-3.5 mb-6 text-xs text-[#124233] flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-[#899545] shrink-0 mt-0.5" />
          <span>
            <strong>9:00 PM Night-Before Kitchen Lock:</strong> The central kitchen cooks against exact digital scale portions every morning. Prepayment guarantees your hot box slot with zero food waste.
          </span>
        </div>

        {/* Stepper */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-black/5 shadow-xs mb-6">
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
            {[
              { num: 1, label: 'Address' },
              { num: 2, label: 'Slots' },
              { num: 3, label: 'Review' },
              { num: 4, label: 'Prepay' },
            ].map((s) => (
              <div
                key={s.num}
                onClick={() => {
                  if (s.num < checkoutStep) setCheckoutStep(s.num as any);
                }}
                className={cn(
                  "py-2 rounded-xl transition-all cursor-pointer",
                  checkoutStep === s.num
                    ? "bg-[#124233] text-white shadow-xs"
                    : checkoutStep > s.num
                    ? "text-emerald-800 bg-[#E8F1D4]/50"
                    : "text-gray-400 bg-gray-50"
                )}
              >
                <span>{s.num}. {s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Step Content */}
          <div className="lg:col-span-7 space-y-6">
            {/* STEP 1: Address */}
            {checkoutStep === 1 && (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-black/5 shadow-md animate-in fade-in duration-200">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-4">
                  <MapPin className="w-5 h-5 text-[#124233]" />
                  <h3 className="font-heading font-black text-lg text-[#124233]">
                    Select Coimbatore Delivery Address
                  </h3>
                </div>

                <div className="space-y-3">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    const addrZone = getZoneByPincode(addr.pincode);
                    const addrTier = addrZone?.tier || 'core';
                    const addrFee = addrTier === 'phase2' ? (addrZone?.deliveryFee ?? 35) : 0;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={cn(
                          "cursor-pointer p-4 rounded-2xl border-2 transition-all tap-active flex items-start justify-between gap-3",
                          isSelected
                            ? "border-[#124233] bg-[#F5F8EC]/60 ring-2 ring-[#124233]/20"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-heading font-black text-sm text-[#124233]">
                              {addr.tag} ({addr.area})
                            </span>
                            {addr.isDefault && (
                              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-bold">
                                Default
                              </span>
                            )}
                            {addrTier === 'core' && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                                Core Hub • Free Delivery
                              </span>
                            )}
                            {addrTier === 'phase2' && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                                Phase 2 • +₹{addrFee} Delivery Fee
                              </span>
                            )}
                            {addrTier === 'out-of-range' && (
                              <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">
                                Beyond 10km Limit
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {addr.flatNumber}, {addr.street}, {addr.area} - {addr.pincode}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5 font-mono">{addr.phone}</p>
                        </div>
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5",
                          isSelected ? "border-[#124233] bg-[#124233] text-white" : "border-gray-300"
                        )}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}

                  {isOutOfRange && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Delivery Notice: Address Beyond 10km</span>
                        <span>This selected address ({selectedAddr?.area}, {selectedAddr?.pincode}) is beyond our current 10km delivery radius from our Kuniyamuthur central kitchen. We are expanding to Phase 3 soon.</span>
                      </div>
                    </div>
                  )}

                  {!showNewAddress ? (
                    <button
                      type="button"
                      onClick={() => setShowNewAddress(true)}
                      className="w-full py-3 border-2 border-dashed border-gray-300 hover:border-[#124233] rounded-2xl text-xs font-bold text-gray-600 hover:text-[#124233] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Delivery Address</span>
                    </button>
                  ) : (
                    <form onSubmit={handleAddAddress} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3 text-xs">
                      <span className="font-bold text-gray-800 block">Add New Address</span>
                      <div>
                        <label className="text-[11px] text-gray-500 block mb-1">Flat / Building No</label>
                        <input
                          type="text"
                          value={newFlat}
                          onChange={(e) => setNewFlat(e.target.value)}
                          placeholder="e.g. 402, Green Valley Apartments"
                          className="w-full p-2.5 rounded-xl border border-gray-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-500 block mb-1">Street Address</label>
                        <input
                          type="text"
                          required
                          value={newStreet}
                          onChange={(e) => setNewStreet(e.target.value)}
                          placeholder="e.g. Sambandam Road West"
                          className="w-full p-2.5 rounded-xl border border-gray-300 bg-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] text-gray-500 block mb-1">Area</label>
                          <select
                            value={newArea}
                            onChange={(e) => setNewArea(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-gray-300 bg-white"
                          >
                            <option value="RS Puram">RS Puram</option>
                            <option value="Peelamedu">Peelamedu</option>
                            <option value="Gandhipuram">Gandhipuram</option>
                            <option value="Saibaba Colony">Saibaba Colony</option>
                            <option value="Race Course">Race Course</option>
                            <option value="Saravanampatti">Saravanampatti</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[11px] text-gray-500 block mb-1">Pincode</label>
                          <input
                            type="text"
                            value={newPincode}
                            onChange={(e) => setNewPincode(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-gray-300 bg-white"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          type="submit"
                          className="flex-1 bg-[#124233] text-white py-2 rounded-xl font-bold"
                        >
                          Save Address
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowNewAddress(false)}
                          className="px-4 bg-gray-200 text-gray-700 py-2 rounded-xl font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => setCheckoutStep(2)}
                    className="bg-[#124233] hover:bg-[#0E3529] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md tap-active flex items-center gap-1.5"
                  >
                    <span>Confirm Address &amp; Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Delivery Slot */}
            {checkoutStep === 2 && (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-black/5 shadow-md animate-in fade-in duration-200 space-y-6">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <Clock className="w-5 h-5 text-[#124233]" />
                  <h3 className="font-heading font-black text-lg text-[#124233]">
                    Delivery Time Windows
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#F5F8EC] border border-[#124233]/15">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Lunch Delivery Slot</span>
                    <span className="font-heading font-black text-base text-[#124233] mt-0.5 block">{lunchSlot}</span>
                    <span className="text-xs text-gray-500">Cooked fresh in morning batch &amp; delivered hot before 1:30 PM.</span>
                  </div>

                  {mealsCount > 1 && (
                    <div className="p-4 rounded-2xl bg-[#EDF5D3] border border-[#899545]/20">
                      <span className="text-[10px] uppercase font-bold text-[#899545] block">Dinner Delivery Slot</span>
                      <span className="font-heading font-black text-base text-[#124233] mt-0.5 block">{dinnerSlot}</span>
                      <span className="text-xs text-gray-500">Evening fresh dispatch for hot post-workout &amp; dinner recovery.</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <button
                    onClick={() => setCheckoutStep(1)}
                    className="text-xs font-bold text-gray-500 hover:text-gray-900"
                  >
                    &larr; Back to Address
                  </button>
                  <button
                    onClick={() => setCheckoutStep(3)}
                    className="bg-[#124233] hover:bg-[#0E3529] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md tap-active flex items-center gap-1.5"
                  >
                    <span>Review Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Review Order */}
            {checkoutStep === 3 && (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-black/5 shadow-md animate-in fade-in duration-200 space-y-6">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <Sparkles className="w-5 h-5 text-[#899545]" />
                  <h3 className="font-heading font-black text-lg text-[#124233]">
                    Review Rotating Box Order
                  </h3>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5F8EC] border border-[#124233]/15 space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-heading font-black text-sm text-[#124233]">{title}</h4>
                      <p className="text-gray-500 mt-0.5">{subtitle}</p>
                    </div>
                    <span className="font-heading font-black text-base text-[#124233]">
                      ₹{subtotal}
                    </span>
                  </div>

                  {activeCheckoutType === 'trial' && trialOrder?.selectedSides && trialOrder.selectedSides.length > 0 && (
                    <div className="pt-2 border-t border-[#124233]/10">
                      <span className="font-bold text-gray-700 block">Extras:</span>
                      {trialOrder.selectedSides.map((sId) => {
                        const s = sides.find((it) => it.id === sId);
                        return s ? (
                          <div key={sId} className="flex justify-between text-gray-600">
                            <span>{s.name}</span>
                            <span>+₹{s.price}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}

                  {activeCheckoutType === 'trial' && trialOrder?.selectedDrinks && trialOrder.selectedDrinks.length > 0 && (
                    <div className="pt-1">
                      <span className="font-bold text-gray-700 block">Cold-Pressed Juices:</span>
                      {trialOrder.selectedDrinks.map((dId) => {
                        const d = addons.find((it) => it.id === dId);
                        return d ? (
                          <div key={dId} className="flex justify-between text-gray-600">
                            <span>{d.name}</span>
                            <span>+₹{d.price}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>

                {/* Promo Code Form */}
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                    Have a Promo Code?
                  </label>
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                        placeholder="e.g. PROTEIN50"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 bg-gray-50 uppercase focus:bg-white focus:border-[#124233] focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-xl tap-active shrink-0"
                    >
                      Apply
                    </button>
                  </form>

                  {couponError && (
                    <p className="text-xs text-rose-600 font-semibold mt-1.5">{couponError}</p>
                  )}

                  {appliedCoupon && (
                    <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs flex items-center justify-between text-emerald-800">
                      <span className="font-bold">✓ Coupon &apos;{appliedCoupon.code}&apos; applied (-₹{discount})</span>
                      <button
                        type="button"
                        onClick={() => applyCoupon(null)}
                        className="text-xs font-bold text-rose-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <button
                    onClick={() => setCheckoutStep(2)}
                    className="text-xs font-bold text-gray-500 hover:text-gray-900"
                  >
                    &larr; Back to Slots
                  </button>
                  <button
                    onClick={() => setCheckoutStep(4)}
                    className="bg-[#124233] hover:bg-[#0E3529] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md tap-active flex items-center gap-1.5"
                  >
                    <span>Proceed to Prepayment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Prepayment Options */}
            {checkoutStep === 4 && (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-black/5 shadow-md animate-in fade-in duration-200 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#124233]" />
                    <h3 className="font-heading font-black text-lg text-[#124233]">
                      Prepayment Options
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                    Prepay Only (Zero COD)
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: 'upi_qr',
                      title: 'Instant UPI / QR Code',
                      desc: 'Scan QR code or pay directly with GPay, PhonePe, Paytm, or BHIM.',
                      icon: QrCode,
                      badge: 'Instant & Zero Fee',
                    },
                    {
                      id: 'upi_autopay',
                      title: 'UPI AutoPay Mandate',
                      desc: 'Auto-renews weekly every Monday with Cashfree. Pause or cancel anytime before 9 PM.',
                      icon: QrCode,
                    },
                    {
                      id: 'cards',
                      title: 'Credit / Debit Cards',
                      desc: 'Visa, MasterCard, RuPay, and American Express supported.',
                      icon: CreditCard,
                    },
                    {
                      id: 'netbanking',
                      title: 'Netbanking',
                      desc: 'All major banks in India (SBI, HDFC, ICICI, Axis).',
                      icon: Building,
                    },
                  ].map((method) => {
                    const Icon = method.icon;
                    const isSelected = paymentGatewayMethod === method.id;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setPaymentGatewayMethod(method.id as any)}
                        className={cn(
                          "cursor-pointer p-4 rounded-2xl border-2 transition-all tap-active flex items-start justify-between gap-3",
                          isSelected
                            ? "border-[#124233] bg-[#F5F8EC]/60 ring-2 ring-[#124233]/20 shadow-xs"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 shrink-0">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-heading font-black text-sm text-[#124233]">
                                {method.title}
                              </span>
                              {method.badge && (
                                <span className="text-[9px] bg-[#E8F1D4] text-[#124233] px-2 py-0.5 rounded-full font-bold">
                                  {method.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{method.desc}</p>
                          </div>
                        </div>

                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5",
                          isSelected ? "border-[#124233] bg-[#124233] text-white" : "border-gray-300"
                        )}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    disabled={isProcessing}
                    className="w-full bg-[#124233] hover:bg-[#0E3529] disabled:bg-gray-400 text-white font-heading font-bold text-base py-4 px-6 rounded-2xl shadow-xl shadow-[#124233]/30 hover:scale-[1.01] transition-all tap-active flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <span>Connecting to Payment Gateway...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5 text-white" />
                        <span>Prepay {formatCurrency(finalTotal)} &amp; Lock Order</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-gray-400 text-center mt-2">
                    Locked at 9:00 PM the previous evening. 100% digital kitchen scale guaranteed.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Bill Summary Card */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-xl shadow-[#124233]/5">
              <h3 className="font-heading font-black text-lg text-[#124233] pb-3 border-b border-gray-100">
                Order Summary
              </h3>

              <div className="space-y-3 py-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Product:</span>
                  <span className="font-bold text-[#124233] truncate max-w-[200px] text-right">{title}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Portions / Day:</span>
                  <span className="font-bold text-[#124233]">{mealsCount} Meal(s)</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-mono font-bold text-gray-900">₹{subtotal}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Coupon Discount ({appliedCoupon?.code}):</span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Coimbatore Doorstep Delivery:</span>
                  {deliveryFee > 0 ? (
                    <span className="font-bold text-amber-800 font-mono">+₹{deliveryFee} (Phase 2 Route)</span>
                  ) : (
                    <span className="font-bold text-emerald-800 uppercase font-mono">FREE (Core Hub)</span>
                  )}
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>5-Item Eco Bento Box:</span>
                  <span className="font-bold text-emerald-800">Included</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-900">Total Payable</span>
                  <p className="text-[10px] text-gray-400">All taxes &amp; packaging included</p>
                </div>
                <span className="font-heading font-black text-2xl text-[#124233]">
                  ₹{finalTotal}
                </span>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-[#F5F8EC] border border-[#124233]/10 text-[11px] text-[#124233]/80 space-y-1">
                <p>✓ Prepay-only policy ensures 0 food wastage</p>
                <p>✓ 100% money back on any skipped or cancelled days</p>
                <p>✓ Cutoff locks strictly at 9:00 PM previous evening</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
