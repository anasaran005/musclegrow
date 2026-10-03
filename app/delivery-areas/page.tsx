'use client';

import React, { useState } from 'react';
import { checkPincode, getDeliveryZones } from '@/lib/api/delivery';
import zonesData from '@/data/delivery-zones.json';
import { DeliveryZone } from '@/types';
import { MapPin, Search, CheckCircle2, Clock, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DeliveryAreasPage() {
  const zones = zonesData as DeliveryZone[];
  const [pincodeInput, setPincodeInput] = useState('');
  const [searchResult, setSearchResult] = useState<{ deliverable: boolean; message: string; zone?: DeliveryZone } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincodeInput) return;
    setLoading(true);
    try {
      const res = await checkPincode(pincodeInput);
      setSearchResult(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <section className="bg-white border-b border-gray-200 py-12 md:py-16 text-center px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-3 py-1 rounded-full">
            Coimbatore Delivery Network
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-gray-900 mt-3">
            Fresh Meals at Your Doorstep
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Dispatched hot from our RS Puram central kitchen twice daily. Free delivery across all active Coimbatore pincodes.
          </p>

          {/* Interactive Pincode Checker */}
          <form onSubmit={handleCheck} className="mt-8 max-w-md mx-auto flex gap-2">
            <div className="relative flex-1">
              <MapPin className="w-5 h-5 text-primary absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                maxLength={6}
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Enter 6-digit Pincode (e.g. 641002)"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-900 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none shadow-xs"
              />
            </div>
            <button
              type="submit"
              disabled={loading || pincodeInput.length < 6}
              className="bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-sm tap-active"
            >
              {loading ? 'Checking...' : 'Check Area'}
            </button>
          </form>

          {searchResult && (
            <div
              className={`mt-4 max-w-md mx-auto p-4 rounded-2xl text-xs font-semibold text-left flex items-start gap-3 ${
                searchResult.deliverable
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-amber-50 text-amber-900 border border-amber-200'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">{searchResult.message}</p>
                {searchResult.zone && (
                  <p className="text-[11px] text-emerald-700 mt-1 font-normal">
                    Typical transit time: {searchResult.zone.avgDeliveryMinutes} mins • Slots: {searchResult.zone.slots.join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Grid of Zones */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <h2 className="font-heading font-black text-2xl text-gray-900 mb-6">
          Active Delivery Zones in Coimbatore
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {zones.map((zone) => (
            <div
              key={zone.pincode}
              className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-base text-gray-900">
                    {zone.area}
                  </h3>
                  <span className="font-mono text-xs font-bold bg-primary-light text-primary px-2 py-0.5 rounded">
                    {zone.pincode}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>Avg arrival: {zone.avgDeliveryMinutes} mins</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <span className="font-bold text-emerald-700">✓ 2 Slots Daily</span>
                <span className="text-gray-400">Free Delivery</span>
              </div>
            </div>
          ))}
        </div>

        {/* Not in list banner */}
        <div className="mt-12 bg-white rounded-3xl p-8 border border-gray-200 text-center max-w-xl mx-auto shadow-sm">
          <Truck className="w-10 h-10 text-primary mx-auto mb-3" />
          <h3 className="font-heading font-black text-xl text-gray-900">
            Don't see your Coimbatore area listed?
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            We are rapidly onboarding new delivery routes in Coimbatore. Drop your address on WhatsApp and we will prioritize your neighborhood.
          </p>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 bg-[#25D366] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm"
          >
            <span>Request Area on WhatsApp</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>
    </div>
  );
}
