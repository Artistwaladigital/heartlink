'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import {
  User as UserIcon,
  Camera,
  ShieldCheck,
  Save,
  Crown,
  Heart,
  Eye,
  EyeOff,
  Sparkles,
  Lock,
  Plus,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { RelationshipGoal } from '@/types';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  // Form states
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profession, setProfession] = useState('');
  const [education, setEducation] = useState('');
  const [heightCm, setHeightCm] = useState(170);
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  // Lifestyle states
  const [smoking, setSmoking] = useState('NEVER');
  const [drinking, setDrinking] = useState('OCCASIONALLY');
  const [diet, setDiet] = useState('OMNIVORE');
  const [exercise, setExercise] = useState('DAILY');
  const [pets, setPets] = useState('');
  const [astrologySign, setAstrologySign] = useState('Aries');
  const [relationshipGoals, setRelationshipGoals] = useState<RelationshipGoal>('SERIOUS_RELATIONSHIP');

  // Privacy toggles
  const [showProfile, setShowProfile] = useState(true);
  const [incognitoMode, setIncognitoMode] = useState(false);
  const [showAge, setShowAge] = useState(true);

  // Status message
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Likes received
  const [likesReceived, setLikesReceived] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setBio(user.bio);
      setProfession(user.profession);
      setEducation(user.education);
      setHeightCm(user.heightCm || 170);
      setInterests(user.interests || []);
      setPhotos(user.photos || []);
      setSmoking(user.lifestyle?.smoking || 'NEVER');
      setDrinking(user.lifestyle?.drinking || 'OCCASIONALLY');
      setDiet(user.lifestyle?.diet || 'OMNIVORE');
      setExercise(user.lifestyle?.exercise || 'DAILY');
      setPets(user.lifestyle?.pets || '');
      setAstrologySign(user.lifestyle?.astrologySign || 'Aries');
      setRelationshipGoals(user.relationshipGoals || 'SERIOUS_RELATIONSHIP');
      setShowProfile(user.privacy?.showProfile ?? true);
      setIncognitoMode(user.privacy?.incognitoMode ?? false);
      setShowAge(user.privacy?.showAge ?? true);
    }
  }, [user]);

  const handleAddInterest = () => {
    if (!newInterest.trim() || interests.includes(newInterest.trim())) return;
    setInterests((prev) => [...prev, newInterest.trim()]);
    setNewInterest('');
  };

  const handleRemoveInterest = (target: string) => {
    setInterests((prev) => prev.filter((i) => i !== target));
  };

  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim() || photos.includes(newPhotoUrl.trim())) return;
    setPhotos((prev) => [...prev, newPhotoUrl.trim()]);
    setNewPhotoUrl('');
  };

  const handleRemovePhoto = (idx: number) => {
    if (photos.length <= 1) {
      alert('You must maintain at least one profile photo.');
      return;
    }
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          bio,
          profession,
          education,
          heightCm,
          interests,
          photos,
          relationshipGoals,
          lifestyle: {
            smoking,
            drinking,
            diet,
            exercise,
            pets,
            astrologySign,
          },
          privacy: {
            showProfile,
            incognitoMode,
            showAge,
            showDistance: true,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        refreshUser();
      }
    } catch (err) {
      console.error('Save profile error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="py-20 text-center text-slate-400">
        Please sign in to view your profile settings.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-navy-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              My Profile & Preferences
            </h1>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                user.membershipTier === 'PLATINUM'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : user.membershipTier === 'GOLD'
                  ? 'bg-amber-500/10 text-amber-200 border border-amber-500/20'
                  : 'bg-navy-800 text-slate-400'
              }`}
            >
              {user.membershipTier} Member
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage your public presentation, lifestyle metrics, and privacy controls.
          </p>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl gradient-rose text-white text-xs font-bold shadow-glow-rose hover:opacity-95 transition flex items-center justify-center gap-2 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Changes...' : 'Save Profile'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center animate-in fade-in">
          Profile changes saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Photos Gallery */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-navy-700">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
              <Camera className="w-4 h-4 text-rose-500" />
              Profile Photographs ({photos.length})
            </h3>
            <p className="text-[11px] text-slate-400 mb-4 font-light">
              High resolution portraits increase mutual match frequency by 400%.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {photos.map((url, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-2xl overflow-hidden aspect-square bg-navy-950 border border-navy-800"
                >
                  <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white backdrop-blur-sm">
                      Primary
                    </span>
                  )}
                  <button
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 text-rose-400 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Photo Input */}
            <div className="space-y-2">
              <input
                type="text"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="Paste new image URL (e.g. Unsplash)..."
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
              <button
                onClick={handleAddPhoto}
                disabled={!newPhotoUrl.trim()}
                className="w-full py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white text-xs font-semibold border border-navy-700 flex items-center justify-center gap-1.5 transition disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Photo</span>
              </button>
            </div>
          </div>

          {/* Privacy & Visibility Settings */}
          <div className="glass-card rounded-3xl p-6 border border-navy-700 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              Privacy & Visibility
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-2 rounded-xl bg-navy-950/60 border border-navy-800 cursor-pointer">
                <div>
                  <span className="text-slate-200 font-medium block">Show Public Profile</span>
                  <span className="text-[10px] text-slate-500">Visible in Dating & Matchmaking</span>
                </div>
                <input
                  type="checkbox"
                  checked={showProfile}
                  onChange={(e) => setShowProfile(e.target.checked)}
                  className="w-4 h-4 accent-rose-500"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-navy-950/60 border border-navy-800 cursor-pointer">
                <div>
                  <span className="text-slate-200 font-medium block">Incognito Mode</span>
                  <span className="text-[10px] text-slate-500">Only people you like can view you</span>
                </div>
                <input
                  type="checkbox"
                  checked={incognitoMode}
                  onChange={(e) => setIncognitoMode(e.target.checked)}
                  className="w-4 h-4 accent-rose-500"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-navy-950/60 border border-navy-800 cursor-pointer">
                <div>
                  <span className="text-slate-200 font-medium block">Display Age</span>
                  <span className="text-[10px] text-slate-500">Show exact age on card deck</span>
                </div>
                <input
                  type="checkbox"
                  checked={showAge}
                  onChange={(e) => setShowAge(e.target.checked)}
                  className="w-4 h-4 accent-rose-500"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Bio, Interests, Lifestyle Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Details */}
          <div className="glass-card rounded-3xl p-6 border border-navy-700 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-rose-500" />
              Personal Story & Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Profession</label>
                <input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Education / Alma Mater</label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(parseInt(e.target.value) || 170)}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Bio / About Me</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your passions, philosophy, and what brings you joy..."
                className="w-full bg-navy-950 border border-navy-700 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Relationship Goals */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">Relationship Vision</label>
              <select
                value={relationshipGoals}
                onChange={(e) => setRelationshipGoals(e.target.value as RelationshipGoal)}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="MARRIAGE">Marriage / Ready to settle down</option>
                <option value="SERIOUS_RELATIONSHIP">Serious, committed relationship</option>
                <option value="LONG_TERM_DATING">Long-term intentional dating</option>
                <option value="CASUAL_DATING">Casual dating</option>
                <option value="NOT_SURE_YET">Not sure yet / Open to spark</option>
              </select>
            </div>
          </div>

          {/* Interests & Passions */}
          <div className="glass-card rounded-3xl p-6 border border-navy-700 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Interests & Hobbies
            </h3>

            <div className="flex flex-wrap gap-2">
              {interests.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-navy-950 border border-navy-700 text-xs text-slate-200"
                >
                  <span>#{tag}</span>
                  <button
                    onClick={() => handleRemoveInterest(tag)}
                    className="text-slate-400 hover:text-rose-400 ml-1 text-sm font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddInterest()}
                placeholder="Add a new interest (e.g. Scuba Diving, Jazz, Sourdough)..."
                className="flex-1 bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white"
              />
              <button
                onClick={handleAddInterest}
                className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-white text-xs font-semibold"
              >
                Add
              </button>
            </div>
          </div>

          {/* Lifestyle Synergy Form */}
          <div className="glass-card rounded-3xl p-6 border border-navy-700 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              Lifestyle & Daily Habits
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Diet</label>
                <select
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="OMNIVORE">Omnivore / Everything</option>
                  <option value="VEGETARIAN">Vegetarian</option>
                  <option value="VEGAN">Vegan</option>
                  <option value="PESCATARIAN">Pescatarian</option>
                  <option value="HALAL">Halal</option>
                  <option value="KOSHER">Kosher</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Exercise Habit</label>
                <select
                  value={exercise}
                  onChange={(e) => setExercise(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="DAILY">Active Daily</option>
                  <option value="FEW_TIMES_A_WEEK">A Few Times a Week</option>
                  <option value="OCCASIONALLY">Occasionally</option>
                  <option value="RARELY">Rarely</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Smoking</label>
                <select
                  value={smoking}
                  onChange={(e) => setSmoking(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="NEVER">Never</option>
                  <option value="OCCASIONALLY">Occasionally</option>
                  <option value="SOCIALLY">Socially</option>
                  <option value="REGULARLY">Regularly</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Drinking</label>
                <select
                  value={drinking}
                  onChange={(e) => setDrinking(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="NEVER">Never</option>
                  <option value="OCCASIONALLY">Occasionally</option>
                  <option value="SOCIALLY">Socially</option>
                  <option value="REGULARLY">Regularly</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Pets</label>
                <input
                  type="text"
                  value={pets}
                  onChange={(e) => setPets(e.target.value)}
                  placeholder="e.g. Golden Retriever, None"
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Astrology Sign</label>
                <input
                  type="text"
                  value={astrologySign}
                  onChange={(e) => setAstrologySign(e.target.value)}
                  placeholder="e.g. Scorpio, Gemini"
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
