'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { useAuth } from '@/components/AuthContext';
import {
  Heart,
  X,
  Star,
  ShieldCheck,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  RotateCcw,
  Flag,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  LayoutGrid,
  Layers,
  Info,
} from 'lucide-react';
import { PublicProfile } from '@/types';

export default function DatingPage() {
  const { user, refreshUser } = useAuth();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'CARD' | 'GRID'>('CARD');
  const [expandedInfo, setExpandedInfo] = useState(false);

  // Match celebration state
  const [mutualMatch, setMutualMatch] = useState<{
    partner: PublicProfile;
    matchId: string;
  } | null>(null);

  // Report modal state
  const [reportModalUser, setReportModalUser] = useState<PublicProfile | null>(null);
  const [reportReason, setReportReason] = useState('Inappropriate content');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Limits state
  const [likesLeft, setLikesLeft] = useState(15);
  const [superLikesLeft, setSuperLikesLeft] = useState(1);
  const [limitError, setLimitError] = useState<string | null>(null);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dating/discover');
      const data = await res.json();
      if (data.profiles) {
        setProfiles(data.profiles);
        setLikesLeft(data.likesRemainingToday ?? 15);
        setSuperLikesLeft(data.superLikesRemainingToday ?? 1);
      }
    } catch (err) {
      console.error('Failed to load discovery profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F43F5E', '#FDA4AF', '#F59E0B', '#FFFFFF'],
    });
  };

  const handleSwipe = async (type: 'LIKE' | 'PASS' | 'SUPER_LIKE') => {
    if (currentIndex >= profiles.length) return;
    const target = profiles[currentIndex];

    try {
      const res = await fetch('/api/dating/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: target.id, type }),
      });
      const data = await res.json();

      if (data.limitReached) {
        setLimitError(data.error);
        return;
      }

      setLikesLeft(data.likesRemainingToday);
      setSuperLikesLeft(data.superLikesRemainingToday);
      setLimitError(null);

      if (data.matched) {
        triggerConfetti();
        setMutualMatch({
          partner: data.partner || target,
          matchId: data.match.id,
        });
        refreshUser();
      }

      // Next card
      setCurrentIndex((prev) => prev + 1);
      setCurrentPhotoIdx(0);
      setExpandedInfo(false);
    } catch (err) {
      console.error('Swipe error:', err);
    }
  };

  const handleReport = async () => {
    if (!reportModalUser) return;
    try {
      await fetch('/api/user/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportedUserId: reportModalUser.id,
          reason: reportReason,
          details: reportDetails,
          blockUser: true,
        }),
      });
      setReportSubmitted(true);
      setTimeout(() => {
        setReportModalUser(null);
        setReportSubmitted(false);
        // remove reported user from deck
        setProfiles((prev) => prev.filter((p) => p.id !== reportModalUser.id));
      }, 1500);
    } catch (err) {
      console.error('Report error:', err);
    }
  };

  // Keyboard navigation for power-users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mutualMatch || reportModalUser) return;
      if (e.key === 'ArrowLeft') handleSwipe('PASS');
      if (e.key === 'ArrowRight') handleSwipe('LIKE');
      if (e.key === 'ArrowUp') handleSwipe('SUPER_LIKE');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, profiles, mutualMatch, reportModalUser]);

  const currentProfile = profiles[currentIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col items-center">
      {/* Top Controller Bar */}
      <div className="w-full max-w-xl flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-white flex items-center gap-2">
            <span>Dating Discovery</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Live
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Swipe right to like, left to pass, or up to Super Like
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-navy-900 border border-navy-800">
          <button
            onClick={() => setViewMode('CARD')}
            className={`p-2 rounded-lg text-xs font-medium transition ${
              viewMode === 'CARD' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="Card Deck Mode"
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('GRID')}
            className={`p-2 rounded-lg text-xs font-medium transition ${
              viewMode === 'GRID' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="Grid Mode"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quotas & Limits Reminder */}
      <div className="w-full max-w-xl mb-4 flex items-center justify-between text-xs px-3 py-2 rounded-xl bg-navy-900/60 border border-navy-800 text-slate-300">
        <div className="flex items-center gap-4">
          <span>
            Likes remaining today:{' '}
            <strong className="text-rose-400">
              {user?.membershipTier === 'FREE' ? likesLeft : 'Unlimited (VIP)'}
            </strong>
          </span>
          <span>
            Super Likes: <strong className="text-amber-400">{superLikesLeft}</strong>
          </span>
        </div>
        {user?.membershipTier === 'FREE' && (
          <Link href="/membership" className="text-amber-400 hover:underline font-semibold">
            Get Unlimited &rarr;
          </Link>
        )}
      </div>

      {limitError && (
        <div className="w-full max-w-xl mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between animate-in fade-in">
          <span>{limitError}</span>
          <Link
            href="/membership"
            className="px-3 py-1 rounded-lg bg-rose-600 text-white font-semibold text-xs shrink-0 ml-2"
          >
            Upgrade Plan
          </Link>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Sparkles className="w-8 h-8 text-rose-500 animate-spin mb-3" />
          <p className="text-sm">Curating compatible profiles near you...</p>
        </div>
      ) : viewMode === 'CARD' ? (
        /* CARD DECK MODE */
        <div className="w-full max-w-md flex flex-col items-center">
          {currentProfile ? (
            <div className="w-full relative rounded-3xl bg-navy-900 border border-navy-700/80 shadow-2xl overflow-hidden group">
              {/* Image Section */}
              <div className="relative w-full h-[460px] bg-navy-950">
                <img
                  src={
                    currentProfile.photos[currentPhotoIdx] ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800'
                  }
                  alt={currentProfile.name}
                  className="w-full h-full object-cover"
                />

                {/* Dark Vignette Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-black/30 pointer-events-none" />

                {/* Photo pagination dots */}
                {currentProfile.photos.length > 1 && (
                  <div className="absolute top-3 inset-x-0 flex justify-center gap-1.5 px-4 z-10">
                    {currentProfile.photos.map((_: any, pIdx: number) => (
                      <div
                        key={pIdx}
                        className={`h-1 rounded-full flex-1 transition-all ${
                          pIdx === currentPhotoIdx ? 'bg-white shadow' : 'bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Photo navigation tap zones */}
                {currentProfile.photos.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentPhotoIdx((p) =>
                          p > 0 ? p - 1 : currentProfile.photos.length - 1
                        )
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPhotoIdx((p) =>
                          p < currentProfile.photos.length - 1 ? p + 1 : 0
                        )
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Compatibility Badge */}
                <div className="absolute top-6 left-4 z-10 px-3 py-1 rounded-full bg-navy-900/80 backdrop-blur-md border border-rose-500/40 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  <span>{currentProfile.compatibilityScore || 90}% Match</span>
                </div>

                {/* Report button */}
                <button
                  onClick={() => setReportModalUser(currentProfile)}
                  className="absolute top-6 right-4 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-slate-300 hover:text-rose-400 flex items-center justify-center transition"
                  title="Report or Block"
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>

                {/* Card Primary Info */}
                <div className="absolute bottom-4 inset-x-4 z-10">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold font-serif text-white tracking-wide flex items-center gap-2">
                      {currentProfile.name}, {currentProfile.age}
                      {currentProfile.verified && (
                        <span title="Verified Member">
                          <ShieldCheck className="w-5 h-5 text-blue-400" />
                        </span>
                      )}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      {currentProfile.location.city}, {currentProfile.location.country}
                    </span>
                    {currentProfile.profession && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        {currentProfile.profession}
                      </span>
                    )}
                  </div>

                  {/* Goal Pill */}
                  <div className="mt-2.5 inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Seeking: {currentProfile.relationshipGoals.replace(/_/g, ' ')}
                  </div>
                </div>
              </div>

              {/* Bio & Details Section */}
              <div className="p-5 space-y-3.5 bg-navy-900 text-slate-200">
                <p className="text-xs leading-relaxed text-slate-300 italic">
                  &ldquo;{currentProfile.bio}&rdquo;
                </p>

                {/* Interests Chips */}
                {currentProfile.interests && currentProfile.interests.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentProfile.interests.map((interest: string, i: number) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-0.5 rounded-lg bg-navy-800 border border-navy-700 text-slate-300"
                      >
                        #{interest}
                      </span>
                    ))}
                  </div>
                )}

                {/* Expand details button */}
                <button
                  onClick={() => setExpandedInfo(!expandedInfo)}
                  className="w-full text-center text-[11px] text-slate-400 hover:text-white flex items-center justify-center gap-1 pt-1"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>{expandedInfo ? 'Hide Details' : 'View Lifestyle & Compatibility Breakdown'}</span>
                </button>

                {/* Extended Details */}
                {expandedInfo && (
                  <div className="pt-3 border-t border-navy-800 space-y-2.5 text-xs text-slate-300 animate-in fade-in">
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-500 block">Education:</span>
                        <span className="font-medium">{currentProfile.education}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Diet:</span>
                        <span className="font-medium">{currentProfile.lifestyle?.diet}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Smoking / Drinking:</span>
                        <span className="font-medium">
                          {currentProfile.lifestyle?.smoking} / {currentProfile.lifestyle?.drinking}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Pets:</span>
                        <span className="font-medium">{currentProfile.lifestyle?.pets || 'None'}</span>
                      </div>
                    </div>

                    {currentProfile.compatibilityBreakdown && (
                      <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 text-[11px] space-y-1.5 mt-2">
                        <span className="font-bold text-rose-400 block">AI Match Breakdown:</span>
                        <div className="flex justify-between">
                          <span>Values Synergy:</span>
                          <span className="font-semibold">{currentProfile.compatibilityBreakdown.values}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Lifestyle Harmony:</span>
                          <span className="font-semibold">{currentProfile.compatibilityBreakdown.lifestyle}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Interests Overlap:</span>
                          <span className="font-semibold">{currentProfile.compatibilityBreakdown.interests}%</span>
                        </div>
                        <p className="text-[10px] text-slate-400 pt-1 italic">
                          {currentProfile.compatibilityBreakdown.aiAnalysis}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons Bar */}
              <div className="p-4 bg-navy-950 border-t border-navy-800 flex items-center justify-around">
                {/* PASS */}
                <button
                  onClick={() => handleSwipe('PASS')}
                  className="w-14 h-14 rounded-full bg-navy-900 border border-navy-700 hover:border-slate-400 text-slate-400 hover:text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
                  title="Pass (Left Arrow)"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* SUPER LIKE */}
                <button
                  onClick={() => handleSwipe('SUPER_LIKE')}
                  className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-navy-950 flex items-center justify-center shadow-glow-gold transition-transform hover:scale-110 active:scale-95"
                  title="Super Like (Up Arrow)"
                >
                  <Star className="w-5 h-5 fill-amber-400" />
                </button>

                {/* LIKE */}
                <button
                  onClick={() => handleSwipe('LIKE')}
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-rose-500 text-white flex items-center justify-center shadow-glow-rose transition-transform hover:scale-110 active:scale-95"
                  title="Like (Right Arrow)"
                >
                  <Heart className="w-8 h-8 fill-white" />
                </button>
              </div>
            </div>
          ) : (
            /* No more cards */
            <div className="text-center py-20 p-8 glass-panel rounded-3xl max-w-md">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 mx-auto mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-serif text-white mb-2">You Have Explored Everyone!</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6 font-light">
                You have reached the end of new discovery profiles for your current filters. New members join daily,
                or you can try our Matchmaking Search or Blind Match pool!
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setCurrentIndex(0);
                    fetchProfiles();
                  }}
                  className="py-2.5 px-4 rounded-xl bg-navy-800 hover:bg-navy-700 text-white text-xs font-semibold border border-navy-700 transition"
                >
                  Restart Deck
                </button>
                <Link
                  href="/matchmaking"
                  className="py-2.5 px-4 rounded-xl gradient-rose text-white text-xs font-semibold shadow-glow-rose transition"
                >
                  Try AI Matchmaking Search
                </Link>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* GRID DISCOVERY MODE */
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile, pIdx) => (
            <div
              key={profile.id}
              className="glass-card rounded-3xl overflow-hidden border border-navy-700 hover:border-rose-500/50 transition flex flex-col justify-between"
            >
              <div className="relative h-64 bg-navy-950">
                <img
                  src={profile.photos[0]}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-navy-900/80 backdrop-blur-md text-white text-[11px] font-bold border border-rose-500/30">
                  {profile.compatibilityScore || 90}% Match
                </div>
                <div className="absolute bottom-3 left-3">
                  <h3 className="font-bold text-white text-lg flex items-center gap-1.5">
                    {profile.name}, {profile.age}
                    {profile.verified && <ShieldCheck className="w-4 h-4 text-blue-400" />}
                  </h3>
                  <p className="text-xs text-slate-300">
                    📍 {profile.location.city} • {profile.profession}
                  </p>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <p className="text-xs text-slate-300 line-clamp-2 italic">
                  &ldquo;{profile.bio}&rdquo;
                </p>

                <div className="flex flex-wrap gap-1">
                  {profile.interests?.slice(0, 3).map((item: string, i: number) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded bg-navy-800 text-slate-300"
                    >
                      #{item}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-navy-800">
                  <button
                    onClick={() => {
                      setCurrentIndex(pIdx);
                      setViewMode('CARD');
                    }}
                    className="flex-1 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-white text-xs font-semibold border border-navy-700 transition"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      setCurrentIndex(pIdx);
                      handleSwipe('LIKE');
                    }}
                    className="px-4 py-2 rounded-xl gradient-rose text-white text-xs font-semibold shadow-glow-rose hover:opacity-95 transition"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MUTUAL MATCH CELEBRATION MODAL */}
      {mutualMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in zoom-in-95">
          <div className="max-w-md w-full bg-navy-900 border border-rose-500/50 rounded-3xl p-6 sm:p-8 text-center shadow-glow-rose">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white mx-auto mb-4 shadow-lg animate-bounce">
              <Heart className="w-8 h-8 fill-white" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-wide">
              It&apos;s a Match!
            </h2>
            <p className="text-xs text-rose-300 mt-1 uppercase tracking-widest font-semibold">
              Mutual Spark Connected
            </p>

            <p className="text-xs text-slate-300 mt-3 font-light">
              You and <strong>{mutualMatch.partner.name}</strong> have both liked each other!
            </p>

            {/* Overlapping Photos */}
            <div className="flex items-center justify-center my-6">
              <img
                src={
                  user?.photos[0] ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
                }
                alt="You"
                className="w-20 h-20 rounded-full object-cover ring-4 ring-rose-500 shadow-2xl -mr-3 z-10"
              />
              <img
                src={mutualMatch.partner.photos[0]}
                alt={mutualMatch.partner.name}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-rose-400 shadow-2xl z-0"
              />
            </div>

            <div className="space-y-2.5">
              <Link
                href={`/chat?matchId=${mutualMatch.matchId}`}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl gradient-rose text-white text-xs font-bold shadow-glow-rose hover:opacity-95 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send a Message Now</span>
              </Link>

              <button
                onClick={() => setMutualMatch(null)}
                className="w-full py-2.5 text-xs text-slate-400 hover:text-white transition font-medium"
              >
                Keep Exploring
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT & BLOCK MODAL */}
      {reportModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full bg-navy-900 border border-navy-700 rounded-3xl p-6 shadow-2xl">
            {reportSubmitted ? (
              <div className="text-center py-6">
                <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white">Report Submitted</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Thank you. {reportModalUser.name} has been blocked and our moderation team will review this report.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Flag className="w-4 h-4 text-rose-500" />
                  Report or Block {reportModalUser.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Help us maintain a luxury, safe environment. User will be immediately removed from your discovery.
                </p>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Reason for report:</label>
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="Inappropriate content">Inappropriate photos or bio</option>
                      <option value="Suspected underage (Under 18)">Suspected under 18</option>
                      <option value="Harassment or abusive behavior">Harassment or rude behavior</option>
                      <option value="Spam or fraudulent commercial profile">Spam or fake profile</option>
                      <option value="Other">Other violation</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Additional details:</label>
                    <textarea
                      value={reportDetails}
                      onChange={(e) => setReportDetails(e.target.value)}
                      rows={3}
                      placeholder="Please provide any helpful context..."
                      className="w-full bg-navy-950 border border-navy-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setReportModalUser(null)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReport}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                  >
                    Submit Report & Block
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
