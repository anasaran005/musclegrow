'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapPin,
  Navigation,
  Loader2,
  ChevronDown,
  Check,
  Search,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { COIMBATORE_ALL_ZONES, ZoneLocation } from '@/lib/location';
import { cn } from '@/lib/utils';
import { UserLocation } from '@/types';

interface LocationSelectorProps {
  variant?: 'desktop' | 'mobile';
  className?: string;
}

export function LocationSelector({ variant = 'desktop', className }: LocationSelectorProps) {
  const { currentLocation, setCurrentLocation } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const autoDetectAttempted = useRef(false);

  // Clean up any historical "Ward 88" from localStorage
  useEffect(() => {
    if (currentLocation?.area && (/^ward\s*\d+/i.test(currentLocation.area) || currentLocation.area.toLowerCase().includes('ward'))) {
      const matched = COIMBATORE_ALL_ZONES.find((z) => z.pincode === currentLocation.pincode) || COIMBATORE_ALL_ZONES[0];
      setCurrentLocation({
        ...currentLocation,
        area: matched.area,
      });
    }
  }, [currentLocation, setCurrentLocation]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Browser location detector
  const handleDetectLocation = useCallback(async (isSilent = false) => {
    if (!('geolocation' in navigator)) return;

    if (!isSilent) setIsDetecting(true);

    const getBrowserCoords = (highAccuracy: boolean): Promise<{ lat: number; lng: number }> => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          (err) => reject(err),
          {
            enableHighAccuracy: highAccuracy,
            timeout: 6000,
            maximumAge: 60000,
          }
        );
      });
    };

    try {
      let coords: { lat: number; lng: number } | null = null;
      try {
        coords = await getBrowserCoords(false);
      } catch {
        try {
          coords = await getBrowserCoords(true);
        } catch {
          // Fall back quietly to IP
          const ipRes = await fetch('/api/geocode/ip');
          if (ipRes.ok) {
            const ipData = await ipRes.json();
            if (ipData?.lat && ipData?.lng) {
              coords = { lat: ipData.lat, lng: ipData.lng };
            }
          }
        }
      }

      if (coords) {
        const res = await fetch(`/api/geocode/reverse?lat=${coords.lat}&lng=${coords.lng}`);
        if (res.ok) {
          const data: UserLocation = await res.json();
          // Ensure area is not "Ward xx"
          let cleanArea = data.area;
          if (/^ward\s*\d+/i.test(cleanArea) || cleanArea.toLowerCase().includes('ward')) {
            const matched = COIMBATORE_ALL_ZONES.find((z) => z.pincode === data.pincode);
            if (matched) cleanArea = matched.area;
          }

          setCurrentLocation({
            ...data,
            area: cleanArea,
            detectedViaGps: true,
          });
        }
      }
    } catch (err) {
      console.warn('Auto-detect location skipped:', err);
    } finally {
      if (!isSilent) {
        setIsDetecting(false);
        setIsOpen(false);
      }
    }
  }, [setCurrentLocation]);

  // Auto detect location when user lands on page
  useEffect(() => {
    if (!autoDetectAttempted.current) {
      autoDetectAttempted.current = true;
      handleDetectLocation(true);
    }
  }, [handleDetectLocation]);

  const handleSelectZone = (zone: ZoneLocation) => {
    setCurrentLocation({
      area: zone.area,
      pincode: zone.pincode,
      city: 'Coimbatore',
      lat: zone.lat,
      lng: zone.lng,
      distanceKm: zone.distanceKm,
      tier: zone.tier,
      deliveryFee: zone.deliveryFee,
      isDeliverable: zone.isDeliverable,
      formattedAddress: `${zone.area}, ${zone.pincode}, Coimbatore`,
      detectedViaGps: false,
    });
    setIsOpen(false);
    setSearchQuery('');
  };

  const filteredZones = COIMBATORE_ALL_ZONES.filter((z) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return z.area.toLowerCase().includes(q) || z.pincode.includes(q);
  });

  const displayArea = currentLocation?.area || 'Kuniyamuthur';
  const displayPincode = currentLocation?.pincode || '641008';

  if (variant === 'mobile') {
    return (
      <div className={cn("relative", className)} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-[#124233] tap-active -ml-1 p-1 rounded-xl text-left"
        >
          <div className="w-8 h-8 rounded-full bg-[#124233]/10 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-[#124233]" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1 font-heading font-black text-sm text-[#124233]">
              <span className="truncate max-w-[130px]">{displayArea}</span>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 text-[#124233]/70 transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
            </div>
            <span className="text-[10px] text-gray-500 font-semibold">{displayPincode}, Coimbatore</span>
          </div>
        </button>

        {isOpen && renderDropdown(true)}
      </div>
    );
  }

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/85 hover:bg-white text-xs sm:text-sm font-bold text-[#124233] transition-all border border-[#124233]/10 shadow-xs hover:shadow-sm"
      >
        <MapPin className="w-4 h-4 text-[#899545] shrink-0" />
        <span className="truncate max-w-[160px] sm:max-w-[200px]">
          {displayArea}, {displayPincode}
        </span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-[#124233]/70 shrink-0 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && renderDropdown(false)}
    </div>
  );

  function renderDropdown(isMobile: boolean) {
    return (
      <>
        {/* Backdrop on mobile */}
        <div
          className="fixed inset-0 z-40 bg-black/20 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
        <div
          className={cn(
            "absolute mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]",
            isMobile ? "left-0" : "right-0"
          )}
        >
          {/* Header */}
          <div className="px-4 pt-4 pb-3 border-b border-gray-100 bg-[#F5F8EC]/50">
            <h4 className="font-heading font-black text-sm text-[#124233]">
              Select Delivery Location
            </h4>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Dispatched fresh twice daily across Coimbatore
            </p>

            {/* Discreet GPS Detect Button */}
            <button
              type="button"
              onClick={() => handleDetectLocation(false)}
              disabled={isDetecting}
              className="mt-3 w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-[#124233] hover:bg-[#0E3529] active:scale-[0.98] text-white text-xs font-bold transition-all shadow-xs"
            >
              {isDetecting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Scanning Current Location...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-3.5 h-3.5 text-[#899545]" />
                  <span>Detect My Location (GPS)</span>
                </>
              )}
            </button>

            {/* Search Input */}
            <div className="relative mt-2.5">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search area (e.g. Kuniyamuthur, RS Puram)..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:border-[#124233]"
              />
            </div>
          </div>

          {/* Zones Scrollable List */}
          <div className="overflow-y-auto max-h-64 divide-y divide-gray-100 flex-1 p-2 text-xs">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Available Delivery Areas
            </div>
            {filteredZones.map((zone) => {
              const isSelected = displayPincode === zone.pincode;
              return (
                <button
                  key={zone.pincode}
                  type="button"
                  onClick={() => handleSelectZone(zone)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors",
                    isSelected
                      ? "bg-[#F5F8EC] text-[#124233] font-bold"
                      : "hover:bg-gray-50 text-gray-700"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <MapPin
                      className={cn(
                        "w-3.5 h-3.5 shrink-0",
                        isSelected ? "text-[#899545]" : "text-gray-400"
                      )}
                    />
                    <span className="font-semibold text-gray-900">{zone.area}</span>
                    <span className="text-[10px] font-mono text-gray-400">
                      ({zone.pincode})
                    </span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#124233] stroke-[3]" />}
                </button>
              );
            })}

            {filteredZones.length === 0 && (
              <div className="py-6 text-center text-gray-500">
                <p className="font-bold">No Coimbatore zone found</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Chat with us below for delivery to your location!
                </p>
              </div>
            )}
          </div>

          {/* Bottom WhatsApp / Call Order Assistance */}
          <div className="p-3.5 bg-[#F5F8EC] border-t border-[#124233]/10">
            <p className="text-[11px] font-bold text-[#124233] mb-2">
              Need custom delivery or have a question?
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/919876543210?text=Hi%20MuscleGrow%2C%20I%20would%20like%20to%20get%20my%20protein%20meal%20box!"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs transition-all shadow-2xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Order</span>
              </a>
              <a
                href="tel:+919876543210"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#124233] hover:bg-[#0E3529] active:scale-[0.98] text-white font-bold text-xs transition-all shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Kitchen</span>
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }
}
