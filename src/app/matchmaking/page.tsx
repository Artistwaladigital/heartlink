'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import {
  Users,
  Search,
  Sparkles,
  SlidersHorizontal,
  ShieldCheck,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  ChevronDown,
  CheckCircle,
  MessageCircle,
  Check,
} from 'lucide-react';
import { PublicProfile } from '@/types';

function MatchmakingContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('highlight');

  const [query, setQuery] = useState(
    'I want to meet someone aged 25 to 32, educated, family-oriented, preferably from Kolkata'
  );
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Structured filters
  const [minAge, setMinAge] = useState(24);
  const [maxAge, setMaxAge] = useState(33);
  const [city, setCity] = useState('');
  const [relationshipGoal, setRelationshipGoal] = useState('');
  const [profession, setProfession] = useState('');

  // Connect / Match action state
  const [connectedIds, setConnectedIds] = useState<Record<string, string>>({});

  const samplePrompts = [
    'I want to meet someone aged 25 to 32, educated, family-oriented, preferably from Kolkata',
    'Find an architect or designer in New York looking for a serious relationship',
    'Meet someone in London who values deep conversation and emotional intelligence',
    'Looking for a vegetarian who loves travel and wants to get married',
  ];

  const handleSearch = async (overrideQuery?: string) => {
    const q = overrideQuery !== undefined ? overrideQuery : query;
    setLoading(true);
    try {
      const res = await fetch('/api/matchmaking/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          structuredFilters: {
            minAge,
            maxAge,
            city,
            relationshipGoal,
            profession,
          },
        }),
      });
      const data = await res.json();
      if (data.results) {
        setResults(data.results);
      }
    } catch (err) {
      console.error('Matchmaking search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleConnect = async (targetId: string) => {
    try {
      const res = await fetch('/api/dating/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: targetId, type: 'SUPER_LIKE' }),
      });
      const data = await res.json();
      setConnectedIds((prev) => ({
        ...prev,
        [targetId]: data.match ? data.match.id : 'SENT',
      }));
    } catch (err) {
      console.error('Connect error:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col">
      {/* Header */}
      <div className="max-w-3xl mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Intelligent Compatibility Engine</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Compatibility Matchmaking
        </h1>
        <p className="mt-2 text-slate-300 text-sm font-light leading-relaxed">
          Express your life vision, desired partner traits, and location preferences in everyday language.
          Our multi-vector algorithm evaluates long-term synergy across values, family goals, and personality.
        </p>
      </div>

      {/* Natural Language Search Console */}
      <div className="p-4 sm:p-6 rounded-3xl bg-navy-900 border border-navy-700 shadow-2xl mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-navy-950 rounded-2xl border border-navy-700 focus-within:border-amber-500 transition">
            <Search className="w-5 h-5 text-amber-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. I want to meet someone aged 25 to 32, educated, family-oriented, preferably from Kolkata..."
              className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition ${
                showFilters
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-navy-950 border-navy-700 text-slate-300 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-navy-950 text-xs font-bold shadow-glow-gold hover:opacity-95 transition flex items-center gap-2 shrink-0"
            >
              {loading ? (
                <span>Analyzing...</span>
              ) : (
                <>
                  <span>Search Matches</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Query Chips */}
        <div className="mt-3 pt-3 border-t border-navy-800 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-500 font-semibold">Try examples:</span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(p);
                handleSearch(p);
              }}
              className="text-[11px] px-3 py-1 rounded-full bg-navy-950 hover:bg-navy-800 border border-navy-800 text-slate-400 hover:text-amber-300 transition"
            >
              &ldquo;{p.slice(0, 38)}...&rdquo;
            </button>
          ))}
        </div>

        {/* Structured Filter Drawer */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-navy-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in">
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Age Range: {minAge} - {maxAge}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="18"
                  max="50"
                  value={minAge}
                  onChange={(e) => setMinAge(parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <input
                  type="range"
                  min="25"
                  max="65"
                  value={maxAge}
                  onChange={(e) => setMaxAge(parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Preferred City:</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Kolkata, New York"
                className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Relationship Goal:</label>
              <select
                value={relationshipGoal}
                onChange={(e) => setRelationshipGoal(e.target.value)}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="">Any Intent</option>
                <option value="MARRIAGE">Marriage / Family</option>
                <option value="SERIOUS_RELATIONSHIP">Serious Relationship</option>
                <option value="LONG_TERM_DATING">Long-term Dating</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Profession Keyword:</label>
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="e.g. Engineer, Doctor"
                className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Results Stream */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <span>Compatible Candidates</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-navy-800 text-amber-400 border border-amber-500/20">
              {results.length} found
            </span>
          </h2>
          <span className="text-xs text-slate-500">Sorted by multi-vector synergy score</span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <Sparkles className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-3" />
            <p className="text-sm">Evaluating compatibility parameters across profiles...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-6">
            {results.map((item) => {
              const profile: PublicProfile = item.profile;
              const isHighlighted = highlightId === profile.id;
              const connectStatus = connectedIds[profile.id];

              return (
                <div
                  key={profile.id}
                  className={`glass-card rounded-3xl p-6 border transition-all duration-300 ${
                    isHighlighted
                      ? 'border-amber-500 bg-amber-500/5 shadow-glow-gold'
                      : 'border-navy-700 hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* Left: Candidate Photo & Quick Bio */}
                    <div className="flex items-start gap-4 w-full lg:w-72 shrink-0">
                      <img
                        src={profile.photos[0]}
                        alt={profile.name}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-2 ring-amber-500/40 shadow-xl shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold font-serif text-white flex items-center gap-1.5">
                          {profile.name}, {profile.age}
                          {profile.verified && (
                            <span title="Verified">
                              <ShieldCheck className="w-4 h-4 text-blue-400" />
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-amber-300 font-medium mt-0.5">
                          {profile.profession}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-rose-400" />
                          {profile.location.city}, {profile.location.country}
                        </p>
                        <span className="mt-2 inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-navy-800 text-slate-300 border border-navy-700">
                          {profile.relationshipGoals.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Middle: Compatibility Radar & AI Analysis */}
                    <div className="flex-1 w-full space-y-3">
                      {/* Overall Score Capsule */}
                      <div className="flex items-center justify-between pb-2 border-b border-navy-800">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-400">Synergy Score:</span>
                          <span className="text-xl font-bold font-serif text-gradient-gold">
                            {item.matchScore}%
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Education: <span className="text-slate-200">{profile.education}</span>
                        </div>
                      </div>

                      {/* Multi-Criteria Breakdown Bars */}
                      {item.compatibilityBreakdown && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                          <div className="p-2 rounded-xl bg-navy-950/80 border border-navy-800">
                            <span className="text-slate-400 block text-[10px]">Values</span>
                            <span className="font-bold text-amber-400">
                              {item.compatibilityBreakdown.values}%
                            </span>
                          </div>
                          <div className="p-2 rounded-xl bg-navy-950/80 border border-navy-800">
                            <span className="text-slate-400 block text-[10px]">Lifestyle</span>
                            <span className="font-bold text-amber-400">
                              {item.compatibilityBreakdown.lifestyle}%
                            </span>
                          </div>
                          <div className="p-2 rounded-xl bg-navy-950/80 border border-navy-800">
                            <span className="text-slate-400 block text-[10px]">Interests</span>
                            <span className="font-bold text-amber-400">
                              {item.compatibilityBreakdown.interests}%
                            </span>
                          </div>
                          <div className="p-2 rounded-xl bg-navy-950/80 border border-navy-800">
                            <span className="text-slate-400 block text-[10px]">Location</span>
                            <span className="font-bold text-amber-400">
                              {item.compatibilityBreakdown.ageLocation}%
                            </span>
                          </div>
                        </div>
                      )}

                      {/* AI Match Reasons */}
                      <div className="p-3 rounded-2xl bg-navy-950/60 border border-navy-800/80">
                        <p className="text-xs text-slate-300 leading-relaxed font-light">
                          <strong className="text-amber-400 font-medium">Why you match: </strong>
                          {item.matchReasons?.join(' • ') || item.compatibilityBreakdown?.aiAnalysis}
                        </p>
                      </div>

                      {/* Bio Quote */}
                      <p className="text-xs text-slate-400 italic line-clamp-2">
                        &ldquo;{profile.bio}&rdquo;
                      </p>

                      {/* Interests Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {profile.interests?.map((interest, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2.5 py-0.5 rounded-lg bg-navy-800 text-slate-300 border border-navy-700"
                          >
                            #{interest}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right: Connect Action Button */}
                    <div className="w-full lg:w-44 flex flex-col gap-2 justify-center shrink-0 self-stretch border-t lg:border-t-0 lg:border-l border-navy-800 pt-4 lg:pt-0 lg:pl-6">
                      {connectStatus ? (
                        <div className="text-center p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                          <Check className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                          <span className="text-xs font-bold block">Connected!</span>
                          {connectStatus !== 'SENT' && (
                            <Link
                              href={`/chat?matchId=${connectStatus}`}
                              className="mt-2 text-[11px] text-white underline block font-medium"
                            >
                              Open Chatroom &rarr;
                            </Link>
                          )}
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleConnect(profile.id)}
                            className="w-full py-3 rounded-xl gradient-rose text-white text-xs font-bold shadow-glow-rose hover:opacity-95 transition flex items-center justify-center gap-1.5"
                          >
                            <Heart className="w-4 h-4 fill-white" />
                            <span>Connect & Like</span>
                          </button>

                          <Link
                            href={`/dating?profileId=${profile.id}`}
                            className="w-full py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white text-xs font-semibold text-center border border-navy-700 transition"
                          >
                            View Card Profile
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 p-8 glass-panel rounded-3xl">
            <h3 className="text-lg font-bold text-white mb-2">No Matching Profiles Found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-4 font-light">
              We couldn&apos;t find an exact match for those specific filters. Try loosening the age range or searching for a broader interest keyword.
            </p>
            <button
              onClick={() => {
                setQuery('I want to meet an educated person who wants a serious relationship');
                handleSearch('I want to meet an educated person who wants a serious relationship');
              }}
              className="px-4 py-2 rounded-xl gradient-rose text-white text-xs font-semibold"
            >
              Reset to General Criteria
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MatchmakingPage() {
  return (
    <React.Suspense fallback={<div className="py-20 text-center text-slate-400">Loading Matchmaker...</div>}>
      <MatchmakingContent />
    </React.Suspense>
  );
}
