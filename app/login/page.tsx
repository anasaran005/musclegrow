'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { BRAND } from '@/config/brand';
import { Phone, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAppStore();

  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 400);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      login(phone);
      setLoading(false);
      router.push('/onboarding');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center justify-center mb-6 group">
          <Image
            src="/logo.png"
            alt={BRAND.name}
            width={180}
            height={60}
            className="h-16 w-auto object-contain transition-transform group-hover:scale-105"
            priority
          />
        </Link>

        <h2 className="font-heading font-black text-2xl sm:text-3xl text-gray-900">
          {step === 'phone' ? 'Sign In with Mobile' : 'Verify Mobile OTP'}
        </h2>
        <p className="mt-2 text-xs text-gray-500">
          {step === 'phone'
            ? 'Enter your WhatsApp or phone number to manage your meal plan in Coimbatore.'
            : `Enter the 6-digit code sent to +91 ${phone} (Mock OTP: any 6 digits work)`}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-gray-200 shadow-xl">
          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                  Mobile Number
                </label>
                <div className="flex rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <span className="px-4 py-3 text-sm font-bold text-gray-500 bg-gray-100/80 border-r border-gray-200 flex items-center">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="98765 43210"
                    className="w-full px-4 py-3 text-sm font-bold text-gray-900 bg-transparent focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs text-rose-600 font-semibold">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || phone.length < 10}
                className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-extrabold text-sm py-3.5 px-4 rounded-2xl shadow-md transition-all tap-active flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Sending OTP...' : 'Get 6-Digit OTP'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center">
                <span className="text-[11px] text-gray-400">
                  By signing in, you agree to {BRAND.name}&apos;s Terms of Service and Privacy Policy.
                </span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-3 text-center">
                  Enter 6-Digit Verification Code
                </label>
                <div className="flex justify-between gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-12 h-14 text-center font-heading font-black text-xl rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-xs text-rose-600 font-semibold text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || otp.join('').length < 6}
                className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-extrabold text-sm py-3.5 px-4 rounded-2xl shadow-md transition-all tap-active"
              >
                <span>{loading ? 'Verifying...' : 'Verify & Continue'}</span>
              </button>

              <div className="flex items-center justify-between text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-gray-500 hover:text-gray-800"
                >
                  Change Number
                </button>
                <button
                  type="button"
                  onClick={() => setOtp(['1', '2', '3', '4', '5', '6'])}
                  className="text-primary hover:underline"
                >
                  Fill Sample OTP
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Security badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Encrypted session • No spam calls</span>
        </div>
      </div>
    </div>
  );
}
