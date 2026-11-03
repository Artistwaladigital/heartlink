'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { useAuth } from '@/components/AuthContext';
import { BLIND_QUIZ_QUESTIONS } from '@/lib/quiz-data';
import {
  EyeOff,
  Sparkles,
  Lock,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  MessageCircle,
  Heart,
  Flag,
  UserX,
  Compass,
  Moon,
  Feather,
  Sun,
  Flame,
} from 'lucide-react';
import { AnonymousBlindProfile } from '@/types';

export default function BlindMatchmakingPage() {
  const { user, refreshUser } = useAuth();
  const [hasJoined, setHasJoined] = useState(false);
  const [matches, setMatches] = useState<
    {
      blindMatch: any;
      partnerAnonymousProfile: AnonymousBlindProfile;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Quiz State
  const [quizStep, setQuizStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Match Request State
  const [matchingPool, setMatchingPool] = useState(false);
  const [poolMessage, setPoolMessage] = useState<string | null>(null);

  // Reveal handshake feedback
  const [revealFeedback, setRevealFeedback] = useState<string | null>(null);

  const fetchBlindData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blind/matches');
      const data = await res.json();
      if (data.matches) {
        setMatches(data.matches);
        setHasJoined(data.hasJoinedPool);
      }
    } catch (err) {
      console.error('Failed to load blind matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlindData();
  }, []);

  const handleSelectOption = (questionId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: val }));
  };

  const handleNextQuizQuestion = () => {
    if (quizStep < BLIND_QUIZ_QUESTIONS.length - 1) {
      setQuizStep((s) => s + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setSubmittingQuiz(true);
    try {
      const res = await fetch('/api/blind/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (data.success) {
        setQuizCompleted(true);
        setHasJoined(true);
        confetti({
          particleCount: 80,
          spread: 60,
          colors: ['#A855F7', '#F43F5E', '#38BDF8'],
        });
        await refreshUser();
        fetchBlindData();
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const handleFindBlindMatch = async () => {
    setMatchingPool(true);
    setPoolMessage(null);
    try {
      const res = await fetch('/api/blind/matches', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setPoolMessage('New anonymous soulmate connected! Chatroom open.');
        fetchBlindData();
        confetti({
          particleCount: 70,
          spread: 50,
        });
      } else {
        setPoolMessage(data.error || 'No candidate ready in pool right now.');
      }
    } catch (err) {
      console.error('Find blind match error:', err);
    } finally {
      setMatchingPool(false);
    }
  };

  const handleConsentReveal = async (matchId: string) => {
    try {
      const res = await fetch('/api/blind/reveal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId }),
      });
      const data = await res.json();
      if (data.success) {
        setRevealFeedback(data.message);
        if (data.isNowRevealed) {
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#F43F5E', '#A855F7', '#FBBF24', '#FFFFFF'],
          });
        }
        fetchBlindData();
      }
    } catch (err) {
      console.error('Consent reveal error:', err);
    }
  };

  const handleLeaveMatch = async (matchId: string) => {
    if (!confirm('Are you sure you want to leave this blind match? This action cannot be undone.'))
      return;
    try {
      await fetch('/api/blind/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId }),
      });
      fetchBlindData();
    } catch (err) {
      console.error('Leave match error:', err);
    }
  };

  const getAvatarIcon = (iconName: string) => {
    switch (iconName) {
      case 'moon':
        return <Moon className="w-6 h-6 text-cyan-300" />;
      case 'feather':
        return <Feather className="w-6 h-6 text-purple-300" />;
      case 'sun':
        return <Sun className="w-6 h-6 text-amber-300" />;
      case 'compass':
        return <Compass className="w-6 h-6 text-rose-300" />;
      default:
        return <Sparkles className="w-6 h-6 text-purple-300" />;
    }
  };

  const currentQ = BLIND_QUIZ_QUESTIONS[quizStep];
  const isAnswered = currentQ && !!answers[currentQ.id];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col">
      {/* Header */}
      <div className="max-w-3xl mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
          <EyeOff className="w-3.5 h-3.5 text-purple-400" />
          <span>Soul-First Intentional Matchmaking</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Blind Matchmaking Pool
        </h1>
        <p className="mt-2 text-slate-300 text-sm font-light leading-relaxed">
          Connect beyond appearances. Photographs and real names are kept 100% confidential. Chat with
          your anonymous match and unveil identities only after mutual agreement.
        </p>
      </div>

      {/* 8-Step Visual Process Roadmap */}
      <div className="mb-10 p-5 rounded-3xl bg-navy-900/60 border border-navy-800 text-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
          {[
            '1. Join Pool',
            '2. Soul Quiz',
            '3. AI Analysis',
            '4. Blind Match',
            '5. Anonymous Tag',
            '6. Private Chat',
            '7. Mutual Reveal',
            '8. Normal Dating',
          ].map((step, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-xl border ${
                idx <= 3
                  ? 'border-purple-500/40 bg-purple-500/10 text-purple-200'
                  : 'border-navy-800 bg-navy-950 text-slate-500'
              }`}
            >
              <span className="font-semibold">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Body */}
      {!hasJoined && !quizCompleted ? (
        /* STEP 2: PERSONALITY & PREFERENCE QUIZ */
        <div className="max-w-2xl mx-auto w-full glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-navy-800">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-purple-400">
                Step 2 of 8 • Soulmate Quiz
              </span>
              <h2 className="text-xl font-bold font-serif text-white mt-0.5">
                Question {quizStep + 1} of {BLIND_QUIZ_QUESTIONS.length}
              </h2>
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Category: <span className="text-purple-300 font-semibold">{currentQ.category}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-navy-950 h-1.5 rounded-full my-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-rose-500 h-full transition-all duration-300"
              style={{
                width: `${((quizStep + 1) / BLIND_QUIZ_QUESTIONS.length) * 100}%`,
              }}
            />
          </div>

          {/* Question Text */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white leading-relaxed">
              {currentQ.question}
            </h3>
            {currentQ.description && (
              <p className="text-xs text-slate-400 mt-1 font-light italic">
                {currentQ.description}
              </p>
            )}
          </div>

          {/* Options List */}
          <div className="space-y-3 mb-8">
            {currentQ.options.map((opt) => {
              const selected = answers[currentQ.id] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelectOption(currentQ.id, opt.value)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-xs sm:text-sm leading-relaxed ${
                    selected
                      ? 'border-purple-500 bg-purple-500/20 text-white shadow-glow-rose font-medium'
                      : 'border-navy-800 bg-navy-950/80 text-slate-300 hover:border-navy-700 hover:bg-navy-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        selected
                          ? 'border-purple-400 bg-purple-500 text-white'
                          : 'border-navy-700'
                      }`}
                    >
                      {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p>{opt.label}</p>
                      {opt.archetypeTag && (
                        <span className="mt-1.5 inline-block text-[10px] px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-500/20">
                          Trait: {opt.archetypeTag}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-navy-800">
            <button
              onClick={() => setQuizStep((s) => Math.max(0, s - 1))}
              disabled={quizStep === 0}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white disabled:opacity-30"
            >
              Previous
            </button>

            <button
              onClick={handleNextQuizQuestion}
              disabled={!isAnswered || submittingQuiz}
              className="px-6 py-3 rounded-xl gradient-rose text-white text-xs font-semibold shadow-glow-rose hover:opacity-95 disabled:opacity-40 transition flex items-center gap-2"
            >
              {submittingQuiz ? (
                <span>Generating Pseudonym...</span>
              ) : quizStep === BLIND_QUIZ_QUESTIONS.length - 1 ? (
                <>
                  <span>Complete Quiz & Join Pool</span>
                  <Sparkles className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* BLIND MATCHES STREAM & POOL ACTIONS */
        <div className="space-y-8">
          {/* My Anonymous Identity Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-navy-900 to-navy-900 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-glow-rose shrink-0">
                {getAvatarIcon(user?.blindProfile.avatarIcon || 'sparkles')}
              </div>
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-xs uppercase tracking-wider text-purple-400 font-bold">
                    Your Anonymous Persona
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                    In Pool
                  </span>
                </div>
                <h3 className="text-xl font-bold font-serif text-white mt-0.5">
                  {user?.blindProfile.pseudonym || 'Mystic Soul'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {user?.blindProfile.soulmateSummary ||
                    'Looking for genuine emotional resonance and shared life vision.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleFindBlindMatch}
              disabled={matchingPool}
              className="px-6 py-3 rounded-2xl gradient-rose text-white text-xs font-bold shadow-glow-rose hover:opacity-95 transition flex items-center gap-2 shrink-0"
            >
              {matchingPool ? (
                <span>Matching with Pool...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Find Another Blind Match</span>
                </>
              )}
            </button>
          </div>

          {poolMessage && (
            <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-200 text-xs text-center animate-in fade-in">
              {poolMessage}
            </div>
          )}

          {revealFeedback && (
            <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs text-center animate-in fade-in">
              {revealFeedback}
            </div>
          )}

          {/* Active Anonymous Matches */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <span>Active Anonymous Matches</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-navy-800 text-purple-300 border border-purple-500/30">
                  {matches.length}
                </span>
              </h2>
              <span className="text-xs text-slate-500">
                Guarded identities • Mutual consent reveal
              </span>
            </div>

            {loading ? (
              <div className="py-16 text-center text-slate-400">
                <Sparkles className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-3" />
                <p className="text-sm">Loading your anonymous soulmate connections...</p>
              </div>
            ) : matches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matches.map((item) => {
                  const partner = item.partnerAnonymousProfile;
                  const bm = item.blindMatch;
                  const isRevealed = partner.isRevealed;

                  return (
                    <div
                      key={bm.id}
                      className={`glass-card rounded-3xl p-6 border transition-all ${
                        isRevealed
                          ? 'border-rose-500/50 bg-rose-500/5 shadow-glow-rose'
                          : 'border-purple-500/30 hover:border-purple-500/60'
                      }`}
                    >
                      {/* Top Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {isRevealed && partner.realProfile ? (
                            <img
                              src={partner.realProfile.photos[0]}
                              alt={partner.realProfile.name}
                              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-rose-500 shadow-xl"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-2xl bg-purple-900/40 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-lg">
                              {getAvatarIcon(partner.avatarIcon)}
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold font-serif text-white">
                                {isRevealed && partner.realProfile
                                  ? partner.realProfile.name
                                  : partner.pseudonym}
                              </h3>
                              {isRevealed && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">
                                  Revealed!
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-400 mt-0.5">
                              {partner.age} years old • Region: {partner.city}
                            </p>
                            <span className="text-[10px] uppercase font-bold text-purple-400 mt-1 inline-block">
                              Goal: {partner.relationshipGoals.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>

                        {/* Compatibility Pill */}
                        <div className="px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-bold">
                          {bm.compatibilityScore}% Soul Harmony
                        </div>
                      </div>

                      {/* Soulmate Summary / Quiz Resonance */}
                      <div className="p-3.5 rounded-2xl bg-navy-950/70 border border-navy-800 text-xs space-y-2 mb-4">
                        <p className="text-slate-300 italic">
                          &ldquo;{partner.soulmateSummary || 'Seeks emotional honesty and true partnership.'}&rdquo;
                        </p>
                        <p className="text-[11px] text-purple-300 font-medium pt-1 border-t border-navy-800/80">
                          {bm.quizScoreBreakdown?.aiSummary}
                        </p>
                      </div>

                      {/* Personality Archetypes Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {partner.personalityTraits?.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded bg-purple-900/20 text-purple-300 border border-purple-500/20"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>

                      {/* Reveal Handshake Status Banner */}
                      <div className="mb-4 p-3 rounded-xl border text-xs">
                        {isRevealed ? (
                          <div className="text-emerald-300 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>
                              <strong>Profiles Unlocked!</strong> You both granted mutual consent. Photos and full details are now visible.
                            </span>
                          </div>
                        ) : partner.hasPartnerConsented ? (
                          <div className="text-amber-300 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                              <span>Your match requested to reveal! Click consent to unveil.</span>
                            </div>
                            <button
                              onClick={() => handleConsentReveal(bm.id)}
                              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs shrink-0 shadow-sm"
                            >
                              Accept Reveal
                            </button>
                          </div>
                        ) : partner.hasUserConsented ? (
                          <div className="text-purple-300 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-purple-400 shrink-0" />
                            <span>
                              Reveal request sent! Waiting for <strong>{partner.pseudonym}</strong> to consent.
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between text-slate-400">
                            <span>Identity hidden. Request mutual reveal when ready:</span>
                            <button
                              onClick={() => handleConsentReveal(bm.id)}
                              className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-purple-900 text-purple-300 font-semibold text-xs border border-purple-500/30 transition shrink-0"
                            >
                              Request Reveal
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Chat and Controls */}
                      <div className="flex items-center gap-2 pt-2 border-t border-navy-800">
                        <Link
                          href={`/chat?matchId=${bm.id}`}
                          className="flex-1 py-2.5 rounded-xl gradient-rose text-white text-xs font-semibold text-center shadow-glow-rose hover:opacity-95 transition flex items-center justify-center gap-1.5"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>
                            {isRevealed ? 'Chat with Partner' : 'Enter Anonymous Chat'}
                          </span>
                        </Link>

                        <button
                          onClick={() => handleLeaveMatch(bm.id)}
                          className="p-2.5 rounded-xl bg-navy-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-navy-700 transition"
                          title="Leave Match"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 p-8 glass-panel rounded-3xl">
                <div className="w-14 h-14 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto mb-3">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  Ready to Meet Your First Soulmate?
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4 font-light">
                  Tap below to find your first anonymous match based on your quiz answers!
                </p>
                <button
                  onClick={handleFindBlindMatch}
                  disabled={matchingPool}
                  className="px-6 py-2.5 rounded-xl gradient-rose text-white text-xs font-semibold shadow-glow-rose"
                >
                  {matchingPool ? 'Analyzing Pool...' : 'Match from Pool'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
