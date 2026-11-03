'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { Heart, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, Users } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser, demoAccounts, switchAccount } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed. Please check credentials.');
        return;
      }

      await refreshUser();
      router.push('/dating');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 max-w-md mx-auto w-full">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-gradient-to-tr from-rose-600 to-amber-500 p-0.5 shadow-glow-rose mb-4">
          <div className="w-full h-full bg-navy-950 rounded-[22px] flex items-center justify-center">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
          </div>
        </div>
        <h1 className="font-serif text-3xl font-bold text-white tracking-wide">
          Welcome to HEARTLINK
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Sign in to your private dating & matchmaking account
        </p>
      </div>

      {/* Main Login Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-navy-700 shadow-2xl">
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Email Address
            </label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-700 focus-within:border-rose-500 transition">
              <Mail className="w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-700 focus-within:border-rose-500 transition">
              <Lock className="w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl gradient-rose text-white text-xs font-bold shadow-glow-rose hover:opacity-95 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {loading ? <span>Signing In...</span> : <span>Sign In to Account</span>}
          </button>
        </form>

        {/* 1-Click Test Logins Box */}
        <div className="mt-6 pt-5 border-t border-navy-800">
          <span className="text-[11px] font-bold text-slate-400 block mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-rose-400" />
            Instant 1-Click Demo Logins:
          </span>

          <div className="grid grid-cols-2 gap-2 text-left">
            <button
              onClick={() => switchAccount('usr_sophia')}
              className="p-2 rounded-xl bg-navy-950 hover:bg-navy-800 border border-navy-850 hover:border-navy-700 text-left transition flex items-center gap-2"
            >
              <img
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80"
                alt="Sophia"
                className="w-7 h-7 rounded-full object-cover"
              />
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-white block truncate">Sophia (26)</span>
                <span className="text-[9px] text-slate-400 block truncate">Architect, NY</span>
              </div>
            </button>

            <button
              onClick={() => switchAccount('usr_aryan')}
              className="p-2 rounded-xl bg-navy-950 hover:bg-navy-800 border border-navy-850 hover:border-navy-700 text-left transition flex items-center gap-2"
            >
              <img
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80"
                alt="Aryan"
                className="w-7 h-7 rounded-full object-cover"
              />
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-white block truncate">Aryan (29)</span>
                <span className="text-[9px] text-slate-400 block truncate">Kolkata Seeker</span>
              </div>
            </button>

            <button
              onClick={() => switchAccount('usr_marcus')}
              className="p-2 rounded-xl bg-navy-950 hover:bg-navy-800 border border-navy-850 hover:border-navy-700 text-left transition flex items-center gap-2"
            >
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80"
                alt="Marcus"
                className="w-7 h-7 rounded-full object-cover"
              />
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-white block truncate">Marcus (31)</span>
                <span className="text-[9px] text-slate-400 block truncate">London Blind</span>
              </div>
            </button>

            <button
              onClick={() => switchAccount('usr_admin')}
              className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-left transition flex items-center gap-2"
            >
              <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-300 font-bold text-[10px]">
                ADM
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-amber-300 block truncate">Admin Panel</span>
                <span className="text-[9px] text-slate-400 block truncate">Full Access</span>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-rose-400 hover:text-rose-300 font-semibold underline">
            Join HeartLink (18+)
          </Link>
        </div>
      </div>
    </div>
  );
}
