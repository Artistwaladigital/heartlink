'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';
import {
  Heart,
  Sparkles,
  Users,
  EyeOff,
  MessageCircle,
  Crown,
  ShieldCheck,
  User as UserIcon,
  ChevronDown,
  LogOut,
  Bot,
  Flame,
  Search,
} from 'lucide-react';
import AIAssistantModal from './AIAssistantModal';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, demoAccounts, switchAccount, metrics } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const navLinks = [
    { href: '/dating', label: 'Dating', icon: Flame, badge: null },
    { href: '/matchmaking', label: 'Matchmaking', icon: Users, badge: 'AI' },
    { href: '/blind', label: 'Blind Match', icon: EyeOff, badge: 'Popular' },
    {
      href: '/chat',
      label: 'Messages',
      icon: MessageCircle,
      badge: metrics.matchesCount > 0 ? `${metrics.matchesCount}` : null,
    },
    { href: '/membership', label: 'VIP Club', icon: Crown, badge: null },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-navy-700/60 glass-panel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 shadow-glow-rose p-0.5 transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500 group-hover:animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif tracking-[0.25em] text-xl font-bold text-gradient-rose">
                HEARTLINK
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
                Intentional Intimacy
              </span>
            </div>
          </Link>

          {/* Navigation Items (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-glow-rose'
                      : 'text-slate-300 hover:text-white hover:bg-navy-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                        item.badge === 'AI'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : item.badge === 'Popular'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-rose-600 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons & Profile Controls */}
          <div className="flex items-center gap-3">
            {/* AI Cupid Floating Trigger */}
            <button
              onClick={() => setAiModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-900/40 to-navy-800 border border-purple-500/30 text-purple-200 hover:border-purple-400 hover:text-white transition-all text-xs font-medium shadow-sm hover:shadow-glow-rose"
              title="Open AI Cupid Assistant"
            >
              <Bot className="w-4 h-4 text-purple-400" />
              <span className="hidden sm:inline">AI Cupid</span>
            </button>

            {user ? (
              <div className="relative">
                {/* User Capsule */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-navy-800/80 hover:bg-navy-700/80 border border-navy-700 hover:border-navy-600 transition-all text-left"
                >
                  <img
                    src={user.photos[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-rose-500/40"
                  />
                  <div className="hidden lg:flex flex-col">
                    <span className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                      {user.name.split(' ')[0]}
                      {user.verified && <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        user.membershipTier === 'PLATINUM'
                          ? 'text-amber-400'
                          : user.membershipTier === 'GOLD'
                          ? 'text-amber-300'
                          : 'text-slate-400'
                      }`}
                    >
                      {user.membershipTier}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-navy-900/95 border border-navy-700 shadow-2xl p-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2.5 border-b border-navy-800">
                      <div className="font-semibold text-sm text-white flex items-center justify-between">
                        <span>{user.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-navy-800 text-rose-300 border border-rose-500/20">
                          {user.membershipTier}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 truncate">{user.email}</div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        📍 {user.location.city}, {user.location.country}
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-navy-800 transition"
                      >
                        <UserIcon className="w-4 h-4 text-rose-400" />
                        My Profile & Photos
                      </Link>

                      <Link
                        href="/membership"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-navy-800 transition"
                      >
                        <Crown className="w-4 h-4 text-amber-400" />
                        Upgrade Membership
                      </Link>

                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition my-1"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-400" />
                          Admin Panel
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          setSwitcherOpen(true);
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-navy-800 transition"
                      >
                        <Users className="w-4 h-4 text-cyan-400" />
                        Switch Demo Account...
                      </button>
                    </div>

                    <div className="border-t border-navy-800 pt-1">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl gradient-rose text-white text-xs font-semibold shadow-glow-rose hover:opacity-95 transition"
                >
                  Join HeartLink
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around border-t border-navy-800 py-2.5 bg-navy-950/95 backdrop-blur-md px-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-2 rounded-lg ${
                  isActive ? 'text-rose-400' : 'text-slate-400'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge && (
                    <span className="absolute -top-1 -right-2 text-[8px] bg-rose-600 text-white px-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Demo Account Switcher Modal */}
      {switcherOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full bg-navy-900 border border-navy-700 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-navy-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-rose-500" />
                  Quick Account Switcher
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Test different personas and experiences with 1-click
                </p>
              </div>
              <button
                onClick={() => setSwitcherOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-2 max-h-96 overflow-y-auto pr-1">
              {demoAccounts.map((acc) => {
                const isCurrent = user?.id === acc.id;
                return (
                  <button
                    key={acc.id}
                    disabled={isCurrent}
                    onClick={() => {
                      switchAccount(acc.id);
                      setSwitcherOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition text-left ${
                      isCurrent
                        ? 'border-rose-500/50 bg-rose-500/10 cursor-default'
                        : 'border-navy-800 bg-navy-850 hover:border-navy-600 hover:bg-navy-800'
                    }`}
                  >
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-navy-700"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-white truncate">
                          {acc.name} ({acc.age})
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            acc.role === 'ADMIN'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-navy-700 text-slate-300'
                          }`}
                        >
                          {acc.role === 'ADMIN' ? 'ADMIN' : acc.membershipTier}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        📍 {acc.city} • Preferred: {acc.preferredExperience}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-navy-800 text-center">
              <button
                onClick={() => setSwitcherOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Close Switcher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant Modal */}
      <AIAssistantModal open={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </>
  );
}
