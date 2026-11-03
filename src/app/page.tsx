'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import {
  Heart,
  Flame,
  Users,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Search,
  Star,
  Compass,
} from 'lucide-react';

export default function HomePage() {
  const { user, switchAccount, demoAccounts } = useAuth();
  const [nlQuery, setNlQuery] = useState('');
  const [nlResults, setNlResults] = useState<any[]>([]);
  const [nlSearching, setNlSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  const sampleQueries = [
    'I want to meet someone aged 25 to 32, educated, family-oriented, preferably from Kolkata',
    'Find someone in New York who loves architecture and acoustic music',
    'Looking for someone in London who values deep philosophical conversations',
  ];

  const handleHeroSearch = async (queryText?: string) => {
    const q = queryText || nlQuery;
    if (!q.trim()) return;
    setNlSearching(true);
    setSearched(true);
    try {
      const res = await fetch('/api/matchmaking/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      if (data.results) {
        setNlResults(data.results);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setNlSearching(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden border-b border-navy-800">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-rose-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-800/80 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-widest shadow-glow-rose mb-6">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>International Dating & Matchmaking Redefined</span>
          </div>

          {/* Luxury Headline */}
          <h1 className="max-w-4xl font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.15]">
            Where Authentic Hearts <br />
            <span className="text-gradient-rose">Connect Globally.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed font-light">
            HEARTLINK offers three bespoke pathways to love for adults aged 18+: modern discovery cards,
            AI natural-language matchmaking, and anonymous soul-first blind connection.
          </p>

          {/* Primary CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dating"
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl gradient-rose text-white text-sm font-semibold shadow-glow-rose hover:opacity-95 transition-all hover:scale-105"
            >
              <Flame className="w-4 h-4" />
              <span>Explore Dating</span>
            </Link>

            <Link
              href="/matchmaking"
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-navy-800 hover:bg-navy-700 border border-navy-600 text-white text-sm font-semibold transition-all hover:scale-105"
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>AI Matchmaking</span>
            </Link>

            <Link
              href="/blind"
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/40 text-purple-200 text-sm font-semibold transition-all hover:scale-105"
            >
              <EyeOff className="w-4 h-4 text-purple-400" />
              <span>Blind Match Pool</span>
            </Link>
          </div>

          {/* 1-Click Persona Test Switcher Banner */}
          <div className="mt-14 w-full max-w-3xl p-4 rounded-3xl bg-navy-900/80 border border-navy-700/80 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-rose-400" />
                1-Click Instant Persona Switcher (For Evaluation & Testing):
              </span>
              {user && (
                <span className="text-xs text-rose-400 font-medium">
                  Logged in as: <strong>{user.name}</strong>
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {demoAccounts.slice(1, 5).map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => switchAccount(acc.id)}
                  className={`flex items-center gap-2.5 p-2 rounded-xl text-left border transition ${
                    user?.id === acc.id
                      ? 'border-rose-500 bg-rose-500/20 ring-1 ring-rose-500'
                      : 'border-navy-800 bg-navy-850 hover:border-navy-600 hover:bg-navy-800'
                  }`}
                >
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-navy-700"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{acc.name.split(' ')[0]}</p>
                    <p className="text-[10px] text-slate-400 truncate">{acc.city}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-2.5 pt-2 border-t border-navy-800 flex items-center justify-between px-2 text-[11px] text-slate-400">
              <span>Admin Demo: admin@heartlink.com (pass: admin123)</span>
              <button
                onClick={() => switchAccount('usr_admin')}
                className="text-amber-400 hover:text-amber-300 font-semibold"
              >
                Switch to Admin &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Core Experiences */}
      <section className="w-full py-20 bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-rose-400 mb-3">
              Three Pathways to Love
            </h2>
            <h3 className="font-serif text-3xl sm:text-5xl font-bold text-white">
              Choose Your Preferred Experience
            </h3>
            <p className="mt-4 text-slate-400 text-sm sm:text-base font-light">
              Whether you prefer visual chemistry, deep compatibility criteria, or pure anonymous connection,
              HeartLink adapts to you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Experience A: Dating */}
            <div className="glass-card rounded-3xl p-8 border border-navy-700/80 hover:border-rose-500/50 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-6 group-hover:scale-110 group-hover:shadow-glow-rose transition-all">
                  <Flame className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-white font-serif">A. Modern Dating</h4>
                <p className="text-xs uppercase tracking-wider font-semibold text-rose-400 mt-1 mb-4">
                  Visual Discovery & Mutual Chemistry
                </p>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 font-light">
                  A high-touch discovery experience with full verified profile photographs, deep bios,
                  interests, lifestyle chips, like, pass, and Super Like gestures.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Rich photo decks with verified badges</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Instant mutual match celebration & chat</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Super Likes to stand out immediately</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/dating"
                className="mt-8 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-navy-800 hover:bg-rose-600 text-white text-xs font-semibold border border-navy-700 hover:border-rose-500 transition-all"
              >
                <span>Launch Dating</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Experience B: Matchmaking */}
            <div className="glass-card rounded-3xl p-8 border border-navy-700/80 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 group-hover:shadow-glow-gold transition-all">
                  <Users className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-white font-serif">B. Compatibility Matchmaking</h4>
                <p className="text-xs uppercase tracking-wider font-semibold text-amber-400 mt-1 mb-4">
                  Natural Language & Long-Term Values
                </p>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 font-light">
                  Type your preferences in normal conversational text. Our algorithm understands age,
                  cities, education, family orientation, and marriage goals.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Natural language preference parser</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Multi-vector compatibility breakdown (0-100%)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Family, marriage, and long-term synergy</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/matchmaking"
                className="mt-8 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-navy-800 hover:bg-amber-600 text-white text-xs font-semibold border border-navy-700 hover:border-amber-500 transition-all"
              >
                <span>Launch Matchmaking</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Experience C: Blind Matchmaking */}
            <div className="glass-card rounded-3xl p-8 border border-navy-700/80 hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute top-4 right-4 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Signature Feature
              </div>
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-all">
                  <EyeOff className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-white font-serif">C. Blind Matchmaking</h4>
                <p className="text-xs uppercase tracking-wider font-semibold text-purple-400 mt-1 mb-4">
                  Soul-First & Mutual Consent Reveal
                </p>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 font-light">
                  No photos, no real names, zero identity leaks. Complete our 8-question personality quiz,
                  chat anonymously with your pseudonym, and unlock profiles only after mutual agreement.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>100% Zero-leak identity shield</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>8-Question soulmate archetype quiz</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Mutual consent reveal handshake</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/blind"
                className="mt-8 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-purple-900/40 hover:bg-purple-600 text-white text-xs font-semibold border border-purple-500/40 transition-all"
              >
                <span>Enter Blind Pool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Natural Language AI Search Section */}
      <section className="w-full py-20 bg-navy-900/60 border-t border-b border-navy-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-widest font-bold text-amber-400 mb-2 block">
              Conversational Search Engine
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Try Matchmaking in Natural Text
            </h3>
            <p className="text-slate-400 text-sm font-light mt-2 max-w-xl mx-auto">
              You don&apos;t need complex dropdowns. Just type who you want to meet in normal everyday words.
            </p>
          </div>

          {/* Search Box */}
          <div className="p-3 sm:p-4 rounded-3xl bg-navy-950 border border-navy-700 shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-navy-900 rounded-2xl border border-navy-700">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={nlQuery}
                  onChange={(e) => setNlQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleHeroSearch()}
                  placeholder='e.g., "I want to meet someone aged 25 to 32, educated, family-oriented, preferably from Kolkata"'
                  className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
              <button
                onClick={() => handleHeroSearch()}
                disabled={nlSearching}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-navy-950 text-sm font-bold shadow-glow-gold hover:opacity-95 transition flex items-center justify-center gap-2 shrink-0"
              >
                {nlSearching ? (
                  <span>Analyzing...</span>
                ) : (
                  <>
                    <span>Find Matches</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Chips */}
            <div className="mt-3 pt-3 border-t border-navy-800 flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-500 font-medium">Try clicking:</span>
              {sampleQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setNlQuery(q);
                    handleHeroSearch(q);
                  }}
                  className="text-[11px] px-3 py-1 rounded-full bg-navy-900 hover:bg-navy-850 text-slate-300 hover:text-white border border-navy-700 transition"
                >
                  &ldquo;{q.slice(0, 45)}...&rdquo;
                </button>
              ))}
            </div>
          </div>

          {/* Live Search Results */}
          {searched && (
            <div className="mt-8 animate-in fade-in">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span>Matched Profiles ({nlResults.length})</span>
                </h4>
                <Link
                  href="/matchmaking"
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  Open in full Matchmaker &rarr;
                </Link>
              </div>

              {nlResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nlResults.slice(0, 3).map((item: any) => (
                    <div
                      key={item.profile.id}
                      className="glass-card rounded-2xl p-4 border border-navy-700 flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={item.profile.photos[0]}
                          alt={item.profile.name}
                          className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-500/40"
                        />
                        <div>
                          <h5 className="font-bold text-white text-sm">
                            {item.profile.name}, {item.profile.age}
                          </h5>
                          <p className="text-xs text-slate-400 truncate max-w-[150px]">
                            {item.profile.profession}
                          </p>
                          <p className="text-[11px] text-slate-500">📍 {item.profile.location.city}</p>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-navy-800">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Compatibility:</span>
                          <span className="font-bold text-amber-400">{item.matchScore}%</span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2">
                          {item.matchReasons?.[0] || 'High personality synergy'}
                        </p>
                      </div>

                      <Link
                        href={`/matchmaking?highlight=${item.profile.id}`}
                        className="mt-3 text-center py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold transition"
                      >
                        View Match Profile
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No direct matches found for this query. Try widening the criteria!
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Trust & Safety Highlights */}
      <section className="w-full py-16 bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-navy-900/50 border border-navy-800 text-center">
              <ShieldCheck className="w-8 h-8 text-rose-500 mx-auto mb-3" />
              <h4 className="font-bold text-white text-base">Strict 18+ Verification</h4>
              <p className="text-xs text-slate-400 mt-2 font-light">
                Zero minors allowed. Strict age gate and date-of-birth validation ensures an adult-only, mature international network.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-navy-900/50 border border-navy-800 text-center">
              <Lock className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h4 className="font-bold text-white text-base">Mutual Consent Reveal</h4>
              <p className="text-xs text-slate-400 mt-2 font-light">
                In Blind Matchmaking, your photographs and identities are cryptographically guarded. They are NEVER leaked until both parties explicitly consent.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-navy-900/50 border border-navy-800 text-center">
              <Star className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <h4 className="font-bold text-white text-base">Configurable VIP Memberships</h4>
              <p className="text-xs text-slate-400 mt-2 font-light">
                Free, Gold, and Platinum tiers with test-mode payment gateway simulation, unlimited likes, and exclusive concierge features.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
