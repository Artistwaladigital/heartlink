'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bot, Send, Sparkles, X, Heart, ArrowRight } from 'lucide-react';
import { PublicProfile } from '@/types';

interface RecommendedCard {
  profile: PublicProfile;
  matchScore: number;
  matchReasons: string[];
}

interface MessageItem {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  recommendedProfiles?: RecommendedCard[];
  actionSuggestion?: {
    label: string;
    href: string;
  };
}

export default function AIAssistantModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'init_1',
      sender: 'bot',
      text: `Hello! I am HeartLink Cupid, your intelligent matchmaking concierge. 💖\n\nTell me what kind of person you are dreaming of meeting in plain words (e.g. "I want to meet someone aged 25 to 32, educated, family-oriented from Kolkata"), or ask me for profile and icebreaker advice!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    'Find someone from Kolkata who wants marriage',
    'Educated professional in New York between 25 and 32',
    'How does Blind Matchmaking work?',
    'Give me a witty icebreaker for an architect',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: MessageItem = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() }),
      });
      const data = await res.json();

      const botMsg: MessageItem = {
        id: `b_${Date.now()}`,
        sender: 'bot',
        text: data.reply || "I've processed your preferences.",
        recommendedProfiles: data.recommendedProfiles,
        actionSuggestion: data.actionSuggestion,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'bot',
          text: 'Oops, I encountered a minor hiccup understanding that. Please try rephrasing!',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="max-w-2xl w-full h-[620px] flex flex-col bg-navy-900 border border-navy-700 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-navy-800 bg-navy-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-rose-500 to-amber-500 p-0.5 shadow-glow-rose">
              <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                HeartLink Cupid
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                  NLP AI
                </span>
              </h3>
              <p className="text-xs text-slate-400">Natural Language Matchmaker & Dating Coach</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-navy-800 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-rose-600 text-white rounded-br-none shadow-glow-rose'
                    : 'bg-navy-800/90 text-slate-200 border border-navy-700/80 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>

                {/* Recommended Candidate Cards */}
                {m.recommendedProfiles && m.recommendedProfiles.length > 0 && (
                  <div className="mt-4 space-y-2.5">
                    {m.recommendedProfiles.map((rec) => (
                      <div
                        key={rec.profile.id}
                        className="p-3 rounded-xl bg-navy-900 border border-navy-700/70 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={rec.profile.photos[0]}
                            alt={rec.profile.name}
                            className="w-11 h-11 rounded-full object-cover ring-2 ring-rose-500/50"
                          />
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-2">
                              {rec.profile.name}, {rec.profile.age}
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold">
                                {rec.matchScore}% Match
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                              {rec.profile.profession} • {rec.profile.location.city}
                            </p>
                          </div>
                        </div>
                        <Link
                          href={`/matchmaking?highlight=${rec.profile.id}`}
                          onClick={onClose}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-500 text-white text-xs font-medium hover:bg-rose-600 transition flex items-center gap-1 shrink-0"
                        >
                          View <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action button suggestion */}
                {m.actionSuggestion && (
                  <div className="mt-3 pt-2 border-t border-navy-700/50">
                    <Link
                      href={m.actionSuggestion.href}
                      onClick={onClose}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 underline"
                    >
                      {m.actionSuggestion.label} &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
              <span>Cupid is analyzing profiles & synthesizing response...</span>
            </div>
          )}
        </div>

        {/* Quick prompt suggestions */}
        <div className="px-6 py-2 bg-navy-950/60 border-t border-navy-800/80 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider shrink-0">
            Ideas:
          </span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="shrink-0 px-3 py-1 rounded-full bg-navy-800 hover:bg-navy-700 border border-navy-700 text-slate-300 hover:text-white transition text-xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-navy-950 border-t border-navy-800 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your preferences in natural English..."
            className="flex-1 bg-navy-900 border border-navy-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 flex items-center justify-center text-white shadow-glow-rose hover:opacity-95 disabled:opacity-40 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
