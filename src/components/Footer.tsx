import React from 'react';
import Link from 'next/link';
import { Heart, ShieldCheck, Lock, Sparkles, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-navy-800 bg-navy-950/80 text-slate-400 text-xs">
      {/* Trust & Safety Banner */}
      <div className="border-b border-navy-850 py-6 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200">Strict 18+ Verification</h4>
              <p className="text-[11px] text-slate-500">Only verified adults aged 18 and above.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200">Zero-Leak Blind Match Shield</h4>
              <p className="text-[11px] text-slate-500">True anonymity until mutual consent reveal.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200">Global Matchmaking</h4>
              <p className="text-[11px] text-slate-500">Connecting intentional hearts across continents.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className="font-serif tracking-widest font-bold text-sm text-white">HEARTLINK</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            The premier international platform uniting modern dating, compatibility matchmaking, and anonymous blind connection.
          </p>
        </div>

        <div>
          <h5 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
            3 Experiences
          </h5>
          <ul className="space-y-2 text-[11px]">
            <li>
              <Link href="/dating" className="hover:text-rose-400 transition">
                Dating & Discovery
              </Link>
            </li>
            <li>
              <Link href="/matchmaking" className="hover:text-rose-400 transition">
                AI Natural Matchmaking
              </Link>
            </li>
            <li>
              <Link href="/blind" className="hover:text-rose-400 transition">
                Blind Matchmaking & Quiz
              </Link>
            </li>
            <li>
              <Link href="/membership" className="hover:text-rose-400 transition">
                Gold & Platinum Plans
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
            Safety & Terms
          </h5>
          <ul className="space-y-2 text-[11px]">
            <li>Strict 18+ Age Policy</li>
            <li>Photo Moderation Standards</li>
            <li>Zero Harassment Guarantee</li>
            <li>Secure Data Hashing & Encryption</li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
            Global Hubs
          </h5>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            New York • London • Kolkata • Mumbai • Paris • Tokyo • San Francisco • Toronto
          </p>
          <div className="mt-4 text-[10px] text-slate-600">
            © {new Date().getFullYear()} HEARTLINK International. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
