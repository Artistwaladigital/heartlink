'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '@/components/AuthContext';
import {
  Crown,
  Check,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Zap,
  Lock,
  ArrowRight,
} from 'lucide-react';

export default function MembershipPage() {
  const { user, refreshUser } = useAuth();
  const [interval, setInterval] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [selectedPlan, setSelectedPlan] = useState<'GOLD' | 'PLATINUM' | null>(null);
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState<any | null>(null);

  const handleCheckout = async () => {
    if (!selectedPlan) return;
    setProcessing(true);
    try {
      const res = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan,
          interval,
          paymentMethod: 'Test Card (•••• 4242)',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReceipt(data.transaction);
        confetti({
          particleCount: 120,
          spread: 80,
          colors: ['#F59E0B', '#FCD34D', '#F43F5E', '#FFFFFF'],
        });
        await refreshUser();
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1 flex flex-col items-center">
      {/* Header */}
      <div className="text-center max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-3">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>VIP & Premium Access</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Elevate Your Search for Love
        </h1>
        <p className="mt-3 text-slate-300 text-sm sm:text-base font-light max-w-xl mx-auto">
          Unlock unlimited daily likes, advanced matchmaking filters, priority discovery placement,
          and exclusive concierge support.
        </p>

        {/* Billing Interval Toggle */}
        <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-navy-900 border border-navy-800">
          <button
            onClick={() => setInterval('MONTHLY')}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition ${
              interval === 'MONTHLY'
                ? 'bg-navy-800 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setInterval('YEARLY')}
            className={`px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              interval === 'YEARLY'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-navy-950 font-bold shadow-glow-gold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-bold">
              Save 40%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mb-16 items-stretch">
        {/* FREE PLAN */}
        <div className="glass-card rounded-3xl p-8 border border-navy-700/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold font-serif text-white">Free Member</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-navy-800 text-slate-400">
                Default
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-6 font-light">
              Essential dating discovery and blind matchmaking introduction.
            </p>
            <div className="mb-6">
              <span className="text-4xl font-bold font-serif text-white">$0</span>
              <span className="text-xs text-slate-400"> / forever</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-slate-400 shrink-0" />
                <span>15 Likes daily</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-slate-400 shrink-0" />
                <span>1 Super Like daily</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-slate-400 shrink-0" />
                <span>1 Blind Match weekly</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Standard chatroom messaging</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-navy-800">
            <button
              disabled
              className="w-full py-3 rounded-xl bg-navy-800 text-slate-400 text-xs font-semibold cursor-default"
            >
              {user?.membershipTier === 'FREE' ? 'Current Active Tier' : 'Included'}
            </button>
          </div>
        </div>

        {/* GOLD PLAN */}
        <div className="glass-card rounded-3xl p-8 border border-amber-500/40 hover:border-amber-500/70 transition flex flex-col justify-between relative shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold font-serif text-white">Gold Tier</h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                Popular
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-6 font-light">
              Unlimited connections with advanced compatibility filters.
            </p>
            <div className="mb-6">
              <span className="text-4xl font-bold font-serif text-gradient-gold">
                ${interval === 'YEARLY' ? '199.99' : '29.99'}
              </span>
              <span className="text-xs text-slate-400">
                {' '}
                {interval === 'YEARLY' ? '/ year' : '/ month'}
              </span>
            </div>

            <ul className="space-y-3 text-xs text-slate-200">
              <li className="flex items-center gap-2.5 font-medium">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Unlimited daily likes</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>5 Super Likes daily</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>5 Blind Matches weekly</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Advanced Matchmaking criteria filters</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Read receipts in chat</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-navy-800">
            <button
              onClick={() => setSelectedPlan('GOLD')}
              disabled={user?.membershipTier === 'GOLD'}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-navy-950 font-bold text-xs shadow-glow-gold hover:opacity-95 transition"
            >
              {user?.membershipTier === 'GOLD' ? 'Current Tier ✓' : 'Upgrade to Gold'}
            </button>
          </div>
        </div>

        {/* PLATINUM PLAN (VIP) */}
        <div className="glass-card rounded-3xl p-8 border border-rose-500/50 hover:border-rose-500 shadow-glow-rose flex flex-col justify-between relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-rose text-white text-[10px] uppercase font-bold tracking-widest shadow">
            Executive VIP
          </div>

          <div>
            <div className="flex items-center justify-between mb-4 mt-2">
              <h3 className="text-xl font-bold font-serif text-white">Platinum VIP</h3>
              <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <p className="text-xs text-slate-400 mb-6 font-light">
              Maximum prominence, 3x match visibility, and unlimited blind matches.
            </p>
            <div className="mb-6">
              <span className="text-4xl font-bold font-serif text-gradient-rose">
                ${interval === 'YEARLY' ? '399.99' : '59.99'}
              </span>
              <span className="text-xs text-slate-400">
                {' '}
                {interval === 'YEARLY' ? '/ year' : '/ month'}
              </span>
            </div>

            <ul className="space-y-3 text-xs text-slate-200">
              <li className="flex items-center gap-2.5 font-semibold text-rose-300">
                <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
                <span>3x Priority Discovery Deck Visibility</span>
              </li>
              <li className="flex items-center gap-2.5 font-medium">
                <Check className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Unlimited daily likes & rewinds</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-rose-400 shrink-0" />
                <span>20 Super Likes daily</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Unlimited Blind Matches</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-rose-400 shrink-0" />
                <span>AI Concierge Matchmaker Unlimited Access</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Gold VIP verified badge on profile</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-navy-800">
            <button
              onClick={() => setSelectedPlan('PLATINUM')}
              disabled={user?.membershipTier === 'PLATINUM'}
              className="w-full py-3 rounded-xl gradient-rose text-white font-bold text-xs shadow-glow-rose hover:opacity-95 transition"
            >
              {user?.membershipTier === 'PLATINUM' ? 'Current Tier ✓' : 'Upgrade to Platinum'}
            </button>
          </div>
        </div>
      </div>

      {/* CHECKOUT MODAL (TEST MODE GATEWAY) */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full bg-navy-900 border border-navy-700 rounded-3xl p-6 sm:p-8 shadow-2xl">
            {receipt ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold font-serif text-white">Payment Successful!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  You are now upgraded to <strong>{receipt.plan}</strong> tier.
                </p>

                <div className="my-6 p-4 rounded-2xl bg-navy-950 border border-navy-800 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reference:</span>
                    <span className="font-mono text-slate-200">{receipt.transactionRef}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Amount Paid:</span>
                    <span className="font-bold text-white">${receipt.amount} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment Mode:</span>
                    <span className="text-slate-300">{receipt.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-emerald-400 font-bold">SUCCEEDED</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setReceipt(null);
                    setSelectedPlan(null);
                  }}
                  className="w-full py-3 rounded-xl gradient-rose text-white text-xs font-bold shadow-glow-rose"
                >
                  Continue to HeartLink
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-navy-800">
                  <div>
                    <h3 className="text-lg font-bold font-serif text-white">
                      Upgrade to {selectedPlan}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Billing interval: {interval.toLowerCase()}
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    TEST MODE
                  </span>
                </div>

                <div className="my-4 p-3 rounded-xl bg-navy-950 border border-navy-800 text-xs text-slate-300 flex items-center justify-between">
                  <span>Total Amount Due:</span>
                  <span className="text-base font-bold text-white">
                    $
                    {selectedPlan === 'GOLD'
                      ? interval === 'YEARLY'
                        ? '199.99'
                        : '29.99'
                      : interval === 'YEARLY'
                      ? '399.99'
                      : '59.99'}{' '}
                    USD
                  </span>
                </div>

                {/* Simulated Card Form */}
                <div className="space-y-3 text-xs mb-6">
                  <div>
                    <label className="text-slate-400 block mb-1">Card Number (Simulated)</label>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white font-mono">
                      <CreditCard className="w-4 h-4 text-slate-400" />
                      <span>4242 •••• •••• 4242</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Expires</label>
                      <input
                        type="text"
                        disabled
                        value="12 / 28"
                        className="w-full p-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">CVC</label>
                      <input
                        type="text"
                        disabled
                        value="888"
                        className="w-full p-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="px-4 py-2.5 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCheckout}
                    disabled={processing}
                    className="px-6 py-2.5 rounded-xl gradient-rose text-white text-xs font-bold shadow-glow-rose hover:opacity-95 disabled:opacity-50 transition"
                  >
                    {processing ? 'Processing Simulator...' : 'Complete Test Checkout'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
