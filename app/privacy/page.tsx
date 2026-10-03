import React from 'react';
import { BRAND } from '@/config/brand';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-14 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-gray-900 pb-4 border-b border-gray-100">
          Privacy Policy
        </h1>
        <p className="text-gray-500 text-xs">Last updated: October 2026 • {BRAND.legalName}</p>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-gray-900">1. Information We Collect</h2>
          <p>
            We collect your phone number, delivery address in Coimbatore, dietary choices, height/weight metrics (for macro calculations), and order preferences to deliver your personalized meal subscription.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-gray-900">2. How We Use Your Data</h2>
          <p>
            Your delivery address is shared only with our assigned Coimbatore delivery riders for fulfilling daily food drop-offs. We never sell, rent, or trade your personal health parameters or contact information to any third-party marketing brokers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-gray-900">3. Payment Security</h2>
          <p>
            All financial transactions and recurring UPI AutoPay mandates are processed securely via certified PCI-DSS compliant payment gateways (Cashfree). MuscleGrow never stores your credit card numbers, CVVs, or bank account PINs on our servers.
          </p>
        </section>
      </div>
    </div>
  );
}
