'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import {
  Flame,
  Users,
  EyeOff,
  MessageCircle,
  Crown,
  Heart,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Settings,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, metrics } = useAuth();

  if (!user) {
    return (
      <div className="py-20 text-center text-slate-400">
        Please sign in to view your dashboard.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-navy-700/80 shadow-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={user.photos[0]}
            alt={user.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-rose-500 shadow-xl shrink-0"
          />
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Welcome back, {user.name.split(' ')[0]}
              </h1>
              {user.verified && <ShieldCheck className="w-5 h-5 text-blue-400" />}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              📍 {user.location.city}, {user.location.country} • Tier:{' '}
              <strong className="text-amber-400">{user.membershipTier}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition"
          >
            <Settings className="w-4 h-4" />
            <span>Edit Profile</span>
          </Link>
          <Link
            href="/membership"
            className="px-5 py-2.5 rounded-xl gradient-rose text-white text-xs font-bold shadow-glow-rose hover:opacity-95 transition flex items-center gap-2"
          >
            <Crown className="w-4 h-4 text-amber-300" />
            <span>VIP Club</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="glass-card rounded-2xl p-4 border border-navy-700">
          <span className="text-xs text-slate-400 block">Dating Matches</span>
          <span className="text-2xl font-bold font-serif text-rose-400 mt-1 block">
            {metrics.matchesCount}
          </span>
          <span className="text-[11px] text-slate-500">Mutual sparks</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-navy-700">
          <span className="text-xs text-slate-400 block">Blind Matches</span>
          <span className="text-2xl font-bold font-serif text-purple-400 mt-1 block">
            {metrics.blindMatchesCount}
          </span>
          <span className="text-[11px] text-slate-500">Anonymous pool</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-navy-700">
          <span className="text-xs text-slate-400 block">Likes Left Today</span>
          <span className="text-2xl font-bold font-serif text-amber-400 mt-1 block">
            {user.membershipTier === 'FREE' ? user.likesRemainingToday : '∞ VIP'}
          </span>
          <span className="text-[11px] text-slate-500">Daily quota</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-navy-700">
          <span className="text-xs text-slate-400 block">Likes Received</span>
          <span className="text-2xl font-bold font-serif text-white mt-1 block">
            {metrics.likesReceivedCount}
          </span>
          <span className="text-[11px] text-slate-500">Members who liked you</span>
        </div>
      </div>

      {/* Experience Launchers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Dating */}
        <Link
          href="/dating"
          className="glass-card rounded-3xl p-6 border border-navy-700 hover:border-rose-500/50 transition group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-110 transition">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-serif text-white">Modern Dating</h3>
            <p className="text-xs text-slate-400 mt-1 font-light leading-relaxed">
              Explore card discovery decks, swipe like or pass, and celebrate mutual matches with instant chat.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-rose-400">
            <span>Launch Deck</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Matchmaking */}
        <Link
          href="/matchmaking"
          className="glass-card rounded-3xl p-6 border border-navy-700 hover:border-amber-500/50 transition group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-serif text-white">AI Matchmaking</h3>
            <p className="text-xs text-slate-400 mt-1 font-light leading-relaxed">
              Search by typing what you want in plain words. View detailed compatibility breakdowns across values and lifestyle.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-amber-400">
            <span>Natural Search</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Blind Matchmaking */}
        <Link
          href="/blind"
          className="glass-card rounded-3xl p-6 border border-navy-700 hover:border-purple-500/50 transition group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition">
              <EyeOff className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-serif text-white">Blind Matchmaking</h3>
            <p className="text-xs text-slate-400 mt-1 font-light leading-relaxed">
              Soul-first anonymous matching with zero identity leaks until mutual consent reveal.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-purple-400">
            <span>Enter Pool</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>
    </div>
  );
}
