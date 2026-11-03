'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { Heart, ShieldCheck, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('WOMAN');
  const [interestedIn, setInterestedIn] = useState('MEN');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('International');
  const [preferredExperience, setPreferredExperience] = useState('ALL');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Calculate age live
  const calculateAge = (dobString: string) => {
    if (!dobString) return null;
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const currentAge = calculateAge(dateOfBirth);
  const isUnderage = currentAge !== null && currentAge < 18;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isUnderage) {
      setError('Strict Age Policy: HEARTLINK is exclusively for adults aged 18 and above.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          dateOfBirth,
          gender,
          interestedIn,
          city,
          country,
          preferredExperience,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed.');
        return;
      }

      await refreshUser();
      router.push('/dating');
    } catch (err) {
      setError('An unexpected error occurred during account creation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] font-semibold uppercase tracking-widest mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
          <span>Strict 18+ Verified Platform</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-white tracking-wide">
          Join HEARTLINK
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Begin your journey across Dating, Matchmaking & Blind Connection
        </p>
      </div>

      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-navy-700 shadow-2xl">
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {isUnderage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-600/30 border border-rose-500 text-rose-200 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-300" />
            <span>
              Underage Warning: Calculated age is {currentAge}. HEARTLINK requires members to be at least 18 years old.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Elena Rostova"
                className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">
                Date of Birth (18+ Mandatory)
              </label>
              <input
                type="date"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                  .toISOString()
                  .split('T')[0]}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-300 block mb-1">I Am A</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="WOMAN">Woman</option>
                <option value="MAN">Man</option>
                <option value="NON_BINARY">Non-Binary</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Interested In</label>
              <select
                value={interestedIn}
                onChange={(e) => setInterestedIn(e.target.value)}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="MEN">Men</option>
                <option value="WOMEN">Women</option>
                <option value="EVERYONE">Everyone</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-300 block mb-1">City</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Kolkata, London, New York"
                className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Preferred Pathway</label>
              <select
                value={preferredExperience}
                onChange={(e) => setPreferredExperience(e.target.value)}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="ALL">All Three Experiences</option>
                <option value="DATING">Modern Dating Focus</option>
                <option value="MATCHMAKING">Compatibility Matchmaking Focus</option>
                <option value="BLIND_MATCHMAKING">Blind Matchmaking Focus</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || isUnderage}
              className="w-full py-3 rounded-xl gradient-rose text-white text-xs font-bold shadow-glow-rose hover:opacity-95 disabled:opacity-40 transition"
            >
              {loading ? 'Creating Membership...' : 'Create Account (18+ Certified)'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already a member?{' '}
          <Link href="/login" className="text-rose-400 hover:text-rose-300 font-semibold underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
