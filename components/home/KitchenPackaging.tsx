import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Sparkles, ThermometerSun, Recycle, Box } from 'lucide-react';

export function KitchenPackaging() {
  const photos = [
    {
      url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80",
      caption: "Commercial digital scale plating in RS Puram kitchen",
    },
    {
      url: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80",
      caption: "Chef hygiene protocol with hairnets & surgical gloves",
    },
    {
      url: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=600&q=80",
      caption: "BPA-free microwave-safe heat-sealed food trays",
    },
    {
      url: "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=600&q=80",
      caption: "Insulated thermal delivery bags for hot meal delivery",
    },
  ];

  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
            Behind The Scenes
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-gray-900 mt-2">
            Sanitized Kitchen & Premium Packaging
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            No newspapers, no plastic pouch sambar, no oily foil. Designed for cleanliness and effortless reheating.
          </p>
        </div>

        {/* 4-Photo Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.map((item, idx) => (
            <div key={idx} className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 shadow-sm border border-gray-100">
              <Image
                src={item.url}
                alt={item.caption}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
                <p className="text-white text-xs font-medium leading-tight">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 3 Packaging Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="p-4 rounded-2xl bg-background border border-gray-100 flex items-start gap-3">
            <Box className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-heading font-bold text-sm text-gray-900">100% Spill-Proof Heat Seal</h4>
              <p className="text-xs text-gray-500 mt-1">Leak-proof airtight film preserves natural moisture without curd or rasam spilling during bike delivery.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-background border border-gray-100 flex items-start gap-3">
            <ThermometerSun className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-heading font-bold text-sm text-gray-900">Microwave Safe Trays</h4>
              <p className="text-xs text-gray-500 mt-1">BPA-free food grade trays reheat safely in 60-90 seconds right at your desk or home kitchen.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-background border border-gray-100 flex items-start gap-3">
            <Recycle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-heading font-bold text-sm text-gray-900">Zero-Waste Tiffin Option</h4>
              <p className="text-xs text-gray-500 mt-1">Monthly subscribers can opt into our returnable 3-tier insulated stainless steel tiffin exchange program.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
