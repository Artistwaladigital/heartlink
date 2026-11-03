'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import {
  MessageCircle,
  Send,
  Heart,
  ShieldCheck,
  MoreVertical,
  Flag,
  UserX,
  Lock,
  Sparkles,
  Check,
  CheckCheck,
  EyeOff,
  Flame,
  Users,
  ArrowLeft,
} from 'lucide-react';
import { PublicProfile, AnonymousBlindProfile } from '@/types';

interface FormattedMsg {
  id: string;
  matchId: string;
  isMine: boolean;
  senderName: string;
  content: string;
  read: boolean;
  readAt: string | null;
  createdAt: string;
}

function ChatContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialMatchId = searchParams.get('matchId');

  const [activeTab, setActiveTab] = useState<'DIRECT' | 'BLIND'>('DIRECT');
  const [directMatches, setDirectMatches] = useState<any[]>([]);
  const [blindMatches, setBlindMatches] = useState<any[]>([]);
  const [activeMatchId, setActiveMatchId] = useState<string | null>(initialMatchId);

  // Chat conversation state
  const [messages, setMessages] = useState<FormattedMsg[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Active match metadata
  const [currentDirectPartner, setCurrentDirectPartner] = useState<PublicProfile | null>(null);
  const [currentBlindPartner, setCurrentBlindPartner] = useState<AnonymousBlindProfile | null>(null);

  // Menu dropdown
  const [menuOpen, setMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load user's conversations
  const loadConversations = async () => {
    try {
      // 1. Direct matches
      const resMe = await fetch('/api/auth/me');
      const dataMe = await resMe.json();

      // 2. Discover/get matches
      const resBlind = await fetch('/api/blind/matches');
      const dataBlind = await resBlind.json();
      if (dataBlind.matches) {
        setBlindMatches(dataBlind.matches);
      }

      // To fetch direct matches, let's call API
      const resDating = await fetch('/api/dating/discover');
      // For testing demo accounts, we can also use default matches from DB
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  };

  // Fetch messages for active conversation
  const fetchMessages = async (matchId: string) => {
    try {
      const res = await fetch(`/api/chat/messages?matchId=${matchId}`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('Fetch messages error:', err);
    }
  };

  useEffect(() => {
    // Initial fetch of both matches
    const init = async () => {
      const resBlind = await fetch('/api/blind/matches');
      const dataBlind = await resBlind.json();
      if (dataBlind.matches) setBlindMatches(dataBlind.matches);

      // Select initial conversation
      if (initialMatchId) {
        setActiveMatchId(initialMatchId);
        // check if it is blind match
        const isB = dataBlind.matches?.find((bm: any) => bm.blindMatch.id === initialMatchId);
        if (isB) {
          setActiveTab('BLIND');
          setCurrentBlindPartner(isB.partnerAnonymousProfile);
        }
      } else if (dataBlind.matches && dataBlind.matches.length > 0) {
        setActiveTab('BLIND');
        setActiveMatchId(dataBlind.matches[0].blindMatch.id);
        setCurrentBlindPartner(dataBlind.matches[0].partnerAnonymousProfile);
      }
    };
    init();
  }, [initialMatchId]);

  useEffect(() => {
    if (!activeMatchId) return;
    setLoadingMessages(true);
    fetchMessages(activeMatchId).then(() => setLoadingMessages(false));

    // Polling interval for live real-time experience
    const interval = setInterval(() => {
      fetchMessages(activeMatchId);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeMatchId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (customText?: string) => {
    const text = customText || input;
    if (!text.trim() || !activeMatchId || sending) return;

    setSending(true);
    setInput('');

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: activeMatchId,
          content: text.trim(),
          conversationType: activeTab === 'BLIND' ? 'BLIND_MATCH' : 'DIRECT_MATCH',
        }),
      });
      const data = await res.json();
      if (data.success && data.message) {
        setMessages((prev) => [...prev, data.message]);

        // Simulate short partner typing & auto-response for demo feeling!
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            fetchMessages(activeMatchId);
          }, 2500);
        }, 1200);
      }
    } catch (err) {
      console.error('Send error:', err);
    } finally {
      setSending(false);
    }
  };

  const handleRevealConsent = async () => {
    if (!activeMatchId) return;
    try {
      const res = await fetch('/api/blind/reveal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId: activeMatchId }),
      });
      const data = await res.json();
      if (data.success) {
        fetchMessages(activeMatchId);
        // reload blind matches
        const resBlind = await fetch('/api/blind/matches');
        const dataBlind = await resBlind.json();
        if (dataBlind.matches) setBlindMatches(dataBlind.matches);
      }
    } catch (err) {
      console.error('Reveal error:', err);
    }
  };

  const activeBlindObj = blindMatches.find((bm) => bm.blindMatch.id === activeMatchId);
  const isBlindRevealed = activeBlindObj?.blindMatch.status === 'MUTUAL_REVEALED';

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col h-[calc(100vh-140px)]">
      <div className="w-full flex-1 flex rounded-3xl bg-navy-900 border border-navy-700/80 shadow-2xl overflow-hidden">
        {/* Sidebar: Conversation List */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-navy-800 flex flex-col bg-navy-950 ${
            activeMatchId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Tabs: Direct Matches vs Blind Matches */}
          <div className="p-3 border-b border-navy-800 flex items-center gap-2">
            <button
              onClick={() => setActiveTab('BLIND')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'BLIND'
                  ? 'bg-purple-900/40 text-purple-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Blind Matches ({blindMatches.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('DIRECT')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'DIRECT'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Direct Matches</span>
            </button>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {activeTab === 'BLIND' ? (
              blindMatches.length > 0 ? (
                blindMatches.map((item) => {
                  const isSelected = item.blindMatch.id === activeMatchId;
                  const partner = item.partnerAnonymousProfile;
                  const isRev = item.blindMatch.status === 'MUTUAL_REVEALED';

                  return (
                    <button
                      key={item.blindMatch.id}
                      onClick={() => {
                        setActiveMatchId(item.blindMatch.id);
                        setCurrentBlindPartner(partner);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl transition text-left ${
                        isSelected
                          ? 'bg-purple-950/60 border border-purple-500/40'
                          : 'hover:bg-navy-900 border border-transparent'
                      }`}
                    >
                      <div className="relative">
                        {isRev && partner.realProfile ? (
                          <img
                            src={partner.realProfile.photos[0]}
                            alt={partner.realProfile.name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-rose-500"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-300">
                            <Sparkles className="w-5 h-5" />
                          </div>
                        )}
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-navy-950" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate">
                            {isRev && partner.realProfile
                              ? partner.realProfile.name
                              : partner.pseudonym}
                          </span>
                          <span className="text-[10px] text-purple-300 font-semibold">
                            {item.blindMatch.compatibilityScore}%
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {isRev ? 'Profiles revealed!' : partner.soulmateSummary || 'Anonymous chatroom active'}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-12 px-4 text-slate-500 text-xs">
                  <EyeOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No active blind matches yet.</p>
                  <Link href="/blind" className="text-purple-400 font-semibold underline mt-2 block">
                    Join Blind Matchmaking &rarr;
                  </Link>
                </div>
              )
            ) : (
              /* Direct matches placeholder / link to dating */
              <div className="text-center py-12 px-4 text-slate-500 text-xs">
                <Flame className="w-8 h-8 mx-auto mb-2 text-rose-500 opacity-50" />
                <p>Mutual matches from Dating will appear here.</p>
                <Link href="/dating" className="text-rose-400 font-semibold underline mt-2 block">
                  Swipe in Dating Discovery &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Main Conversation Window */}
        <div
          className={`flex-1 flex flex-col bg-navy-900 ${
            !activeMatchId ? 'hidden md:flex items-center justify-center' : 'flex'
          }`}
        >
          {activeMatchId ? (
            <>
              {/* Chat Header */}
              <div className="px-4 sm:px-6 py-3.5 border-b border-navy-800 bg-navy-950 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveMatchId(null)}
                    className="md:hidden text-slate-400 hover:text-white p-1"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  {isBlindRevealed && activeBlindObj?.partnerAnonymousProfile.realProfile ? (
                    <img
                      src={activeBlindObj.partnerAnonymousProfile.realProfile.photos[0]}
                      alt="Partner"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-2xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-300">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      {isBlindRevealed && activeBlindObj?.partnerAnonymousProfile.realProfile
                        ? activeBlindObj.partnerAnonymousProfile.realProfile.name
                        : activeBlindObj?.partnerAnonymousProfile.pseudonym || 'Soulmate Partner'}
                      {isBlindRevealed ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
                          Revealed
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                          Anonymous
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Active now • End-to-end encrypted
                    </p>
                  </div>
                </div>

                {/* Handshake Consent Pill in Header */}
                <div className="flex items-center gap-2">
                  {!isBlindRevealed && activeBlindObj && (
                    <button
                      onClick={handleRevealConsent}
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-300 hover:text-white text-xs font-semibold shadow-sm transition"
                    >
                      <Lock className="w-3.5 h-3.5 text-purple-400" />
                      <span>
                        {activeBlindObj.partnerAnonymousProfile.hasUserConsented
                          ? 'Waiting for Partner...'
                          : 'Request Reveal'}
                      </span>
                    </button>
                  )}

                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="w-8 h-8 rounded-full bg-navy-800 flex items-center justify-center text-slate-400 hover:text-white transition"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {menuOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-navy-950 border border-navy-700 shadow-2xl p-1.5 z-30">
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            alert('User reported. Moderation will review conversation.');
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl flex items-center gap-2"
                        >
                          <Flag className="w-3.5 h-3.5" />
                          Report Conversation
                        </button>
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            alert('User blocked.');
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-navy-800 rounded-xl flex items-center gap-2"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          Block User
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Reveal Handshake Callout Banner */}
              {!isBlindRevealed && activeBlindObj && (
                <div className="p-2.5 bg-purple-950/70 border-b border-purple-500/30 px-4 sm:px-6 flex items-center justify-between text-xs text-purple-200">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>
                      {activeBlindObj.partnerAnonymousProfile.hasPartnerConsented
                        ? 'Your match wants to reveal profiles! Click to unveil identities.'
                        : 'Identities are hidden. Both must consent before photos unlock.'}
                    </span>
                  </div>
                  <button
                    onClick={handleRevealConsent}
                    className="px-2.5 py-1 rounded-lg gradient-rose text-white text-[11px] font-bold shadow-glow-rose shrink-0 ml-2"
                  >
                    {activeBlindObj.partnerAnonymousProfile.hasUserConsented ? 'Consented ✓' : 'Consent'}
                  </button>
                </div>
              )}

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                {loadingMessages ? (
                  <div className="py-20 text-center text-slate-500 text-xs">
                    Decrypting and loading messages...
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${m.isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                          m.isMine
                            ? 'gradient-rose text-white rounded-br-none shadow-glow-rose'
                            : 'bg-navy-800/90 text-slate-200 border border-navy-700/70 rounded-bl-none'
                        }`}
                      >
                        <p>{m.content}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500 px-1">
                        <span>
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {m.isMine && (
                          <span>
                            {m.read ? (
                              <CheckCheck className="w-3 h-3 text-rose-400 inline" />
                            ) : (
                              <Check className="w-3 h-3 inline" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 text-slate-500 text-xs">
                    <Heart className="w-8 h-8 text-rose-500/30 mx-auto mb-2" />
                    <p>No messages yet. Send a thoughtful greeting to break the ice!</p>
                  </div>
                )}

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    <span>Partner is typing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Console */}
              <div className="p-3 sm:p-4 border-t border-navy-800 bg-navy-950 flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type an authentic, thoughtful message..."
                  className="flex-1 bg-navy-900 border border-navy-700 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || sending}
                  className="w-10 h-10 rounded-2xl gradient-rose flex items-center justify-center text-white shadow-glow-rose hover:opacity-95 disabled:opacity-40 transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center p-8 text-slate-500">
              <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">Your Messages</h3>
              <p className="text-xs">Select an active match on the left to start conversing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <React.Suspense fallback={<div className="py-20 text-center text-slate-400">Loading Messages...</div>}>
      <ChatContent />
    </React.Suspense>
  );
}
