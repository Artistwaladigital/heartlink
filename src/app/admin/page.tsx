'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import {
  ShieldCheck,
  Users,
  Flame,
  EyeOff,
  DollarSign,
  AlertTriangle,
  Camera,
  CheckCircle,
  XCircle,
  Sliders,
  RotateCcw,
  Search,
  Filter,
  Check,
  Ban,
  Trash2,
  Lock,
} from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'METRICS' | 'USERS' | 'PHOTOS' | 'REPORTS' | 'SETTINGS'>('METRICS');

  const [metrics, setMetrics] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [reportsList, setReportsList] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Search filter in users
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('');

  // Notification message
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const notify = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [resM, resU, resR, resS] = await Promise.all([
        fetch('/api/admin/metrics'),
        fetch('/api/admin/users'),
        fetch('/api/admin/reports'),
        fetch('/api/admin/settings'),
      ]);

      const dataM = await resM.json();
      const dataU = await resU.json();
      const dataR = await resR.json();
      const dataS = await resS.json();

      if (dataM.metrics) setMetrics(dataM.metrics);
      if (dataU.users) setUsersList(dataU.users);
      if (dataR.reports) setReportsList(dataR.reports);
      if (dataS.settings) setSettings(dataS.settings);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleUserAction = async (targetUserId: string, action: string, value?: any) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId, action, value }),
      });
      const data = await res.json();
      if (data.success) {
        notify(`User action (${action}) completed successfully.`);
        loadAdminData();
      } else {
        alert(data.error || 'Action failed');
      }
    } catch (err) {
      console.error('User action error:', err);
    }
  };

  const handleReportAction = async (reportId: string, action: string) => {
    try {
      const res = await fetch('/api/admin/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, action }),
      });
      const data = await res.json();
      if (data.success) {
        notify(`Report ${action} processed.`);
        loadAdminData();
      }
    } catch (err) {
      console.error('Report action error:', err);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        notify('System settings updated successfully.');
      }
    } catch (err) {
      console.error('Save settings error:', err);
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4">
        <Lock className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold font-serif text-white">Admin Privileges Required</h2>
        <p className="text-xs text-slate-400 mt-2">
          You are currently signed in as a standard member. Please switch to the Admin demo account from the top menu to view this dashboard.
        </p>
      </div>
    );
  }

  const filteredUsers = usersList.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.location.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTier = filterTier ? u.membershipTier === filterTier : true;
    return matchSearch && matchTier;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-navy-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-amber-400" />
              HEARTLINK Admin Console
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Superadmin
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Global member moderation, match analytics, subscription ledger, and algorithm control.
          </p>
        </div>

        {/* Action Notice */}
        {actionNotice && (
          <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-in fade-in">
            {actionNotice}
          </div>
        )}
      </div>

      {/* KPI Cards Row */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <div className="glass-card p-4 rounded-2xl border border-navy-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Total Users
            </span>
            <span className="text-2xl font-bold text-white mt-1 block">{metrics.totalUsers}</span>
            <span className="text-[10px] text-emerald-400 font-medium">
              {metrics.activeUsers} Active Now
            </span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-navy-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Gross Revenue
            </span>
            <span className="text-2xl font-bold text-gradient-gold mt-1 block">
              ${metrics.totalRevenue}
            </span>
            <span className="text-[10px] text-slate-400">Test mode ledger</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-navy-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Dating Matches
            </span>
            <span className="text-2xl font-bold text-rose-400 mt-1 block">
              {metrics.datingMatches}
            </span>
            <span className="text-[10px] text-slate-400">Mutual swipe pairs</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-navy-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Marriage Matches
            </span>
            <span className="text-2xl font-bold text-amber-400 mt-1 block">
              {metrics.matchmakingMatches}
            </span>
            <span className="text-[10px] text-slate-400">High-synergy links</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-navy-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Blind Matches
            </span>
            <span className="text-2xl font-bold text-purple-400 mt-1 block">
              {metrics.blindMatches}
            </span>
            <span className="text-[10px] text-slate-400">Soulmate handshakes</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-navy-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Safety Reports
            </span>
            <span
              className={`text-2xl font-bold mt-1 block ${
                metrics.pendingReports > 0 ? 'text-rose-500' : 'text-slate-200'
              }`}
            >
              {metrics.pendingReports}
            </span>
            <span className="text-[10px] text-slate-400">Pending review</span>
          </div>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-navy-800 mb-6 overflow-x-auto no-scrollbar">
        {[
          { id: 'METRICS', label: 'Overview & Activity' },
          { id: 'USERS', label: `Manage Users (${usersList.length})` },
          { id: 'PHOTOS', label: 'Photo Moderation' },
          { id: 'REPORTS', label: `Safety Reports (${reportsList.length})` },
          { id: 'SETTINGS', label: 'Algorithm & Pricing' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 transition shrink-0 ${
              activeTab === tab.id
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}

      {/* 1. OVERVIEW & ACTIVITY */}
      {activeTab === 'METRICS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card rounded-3xl p-6 border border-navy-700">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Platform Health & Compliance
              </h3>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between py-1.5 border-b border-navy-800">
                  <span className="text-slate-400">Strict 18+ Age Restriction Policy:</span>
                  <span className="text-emerald-400 font-semibold">Active & Enforced</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-navy-800">
                  <span className="text-slate-400">Blind Match Zero-Leak Cryptography:</span>
                  <span className="text-emerald-400 font-semibold">Guarded & Verified</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-navy-800">
                  <span className="text-slate-400">Password Hashing:</span>
                  <span className="text-slate-200 font-mono">bcryptjs (10 rounds)</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Payment Gateway Integration:</span>
                  <span className="text-amber-400 font-semibold">Sandbox Test Mode</span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6 border border-navy-700">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-400" />
                Membership Distribution
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Platinum VIP Members</span>
                    <span className="font-bold text-rose-400">
                      {usersList.filter((u) => u.membershipTier === 'PLATINUM').length}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-navy-950 overflow-hidden">
                    <div className="h-full bg-rose-500 w-1/3" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Gold Members</span>
                    <span className="font-bold text-amber-400">
                      {usersList.filter((u) => u.membershipTier === 'GOLD').length}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-navy-950 overflow-hidden">
                    <div className="h-full bg-amber-500 w-1/2" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Free Members</span>
                    <span className="font-bold text-slate-400">
                      {usersList.filter((u) => u.membershipTier === 'FREE').length}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-navy-950 overflow-hidden">
                    <div className="h-full bg-slate-600 w-2/3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. USERS MANAGEMENT TABLE */}
      {activeTab === 'USERS' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-navy-950 rounded-xl border border-navy-700">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search member by name or city..."
                className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="bg-navy-950 border border-navy-700 text-xs rounded-xl px-3 py-2 text-white"
            >
              <option value="">All Membership Tiers</option>
              <option value="PLATINUM">Platinum</option>
              <option value="GOLD">Gold</option>
              <option value="FREE">Free</option>
            </select>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-navy-700 overflow-hidden bg-navy-900/60 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-navy-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-navy-800">
                  <tr>
                    <th className="p-3.5">User</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5">Tier</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Verified</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-navy-800/40 transition">
                      <td className="p-3.5 flex items-center gap-3">
                        <img
                          src={u.photos[0]}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-navy-700"
                        />
                        <div>
                          <span className="font-bold text-white block">
                            {u.name} ({u.age})
                          </span>
                          <span className="text-[10px] text-slate-400 truncate max-w-[150px] block">
                            {u.email}
                          </span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span>{u.location.city}</span>
                      </td>

                      <td className="p-3.5">
                        <select
                          value={u.membershipTier}
                          onChange={(e) => handleUserAction(u.id, 'CHANGE_TIER', e.target.value)}
                          className="bg-navy-950 border border-navy-700 rounded-lg px-2 py-1 text-[11px] font-semibold text-amber-300"
                        >
                          <option value="FREE">FREE</option>
                          <option value="GOLD">GOLD</option>
                          <option value="PLATINUM">PLATINUM</option>
                        </select>
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <button
                          onClick={() => handleUserAction(u.id, 'TOGGLE_VERIFY')}
                          className={`text-xs flex items-center gap-1 ${
                            u.verified ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>{u.verified ? 'Verified' : 'Unverified'}</span>
                        </button>
                      </td>

                      <td className="p-3.5 text-right space-x-2">
                        {u.status === 'ACTIVE' ? (
                          <button
                            onClick={() => handleUserAction(u.id, 'CHANGE_STATUS', 'SUSPENDED')}
                            className="px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-[11px]"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUserAction(u.id, 'CHANGE_STATUS', 'ACTIVE')}
                            className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-[11px]"
                          >
                            Activate
                          </button>
                        )}

                        {u.role !== 'ADMIN' && (
                          <button
                            onClick={() => {
                              if (confirm(`Permanently delete ${u.name}?`)) {
                                handleUserAction(u.id, 'DELETE_USER');
                              }
                            }}
                            className="p-1 rounded text-slate-500 hover:text-rose-400"
                            title="Delete Account"
                          >
                            <Trash2 className="w-3.5 h-3.5 inline" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. PHOTO MODERATION QUEUE */}
      {activeTab === 'PHOTOS' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Review submitted profile portraits for quality, realism, and adherence to luxury guidelines.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {usersList.slice(0, 8).map((u) => (
              <div
                key={u.id}
                className="glass-card rounded-2xl overflow-hidden border border-navy-700 p-3 flex flex-col justify-between"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden bg-navy-950 mb-2">
                  <img src={u.photos[0]} alt={u.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-sm">
                    Status: {u.photoStatus || 'APPROVED'}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white truncate">{u.name}</h4>
                  <p className="text-[11px] text-slate-400">📍 {u.location.city}</p>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-navy-800">
                  <button
                    onClick={() => handleUserAction(u.id, 'MODERATE_PHOTO', 'APPROVED')}
                    className="flex-1 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[11px] font-semibold"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleUserAction(u.id, 'MODERATE_PHOTO', 'FLAGGED')}
                    className="flex-1 py-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-[11px] font-semibold"
                  >
                    Flag Photo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SAFETY & CHAT REPORTS */}
      {activeTab === 'REPORTS' && (
        <div className="space-y-4">
          {reportsList.length > 0 ? (
            <div className="space-y-3">
              {reportsList.map((rep) => (
                <div
                  key={rep.id}
                  className="glass-card rounded-2xl p-4 border border-navy-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-rose-400">Reason: {rep.reason}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-navy-800 text-slate-300">
                        {rep.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-light">
                      Details: {rep.details || 'No additional details provided'}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Reported user ID: {rep.reportedUserId} • Reporter ID: {rep.reporterId}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleReportAction(rep.id, 'DISMISS')}
                      className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 text-xs font-semibold"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => handleReportAction(rep.id, 'WARN')}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold"
                    >
                      Issue Warning
                    </button>
                    <button
                      onClick={() => handleReportAction(rep.id, 'BAN_USER')}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                    >
                      Ban User
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 p-8 glass-panel rounded-3xl text-slate-400 text-xs">
              <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <p>No open moderation reports! Member behavior is in good standing.</p>
            </div>
          )}
        </div>
      )}

      {/* 5. ALGORITHM & PRICING SETTINGS */}
      {activeTab === 'SETTINGS' && settings && (
        <div className="max-w-2xl space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-navy-700 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              Matching Algorithm Scoring Weights
            </h3>
            <p className="text-[11px] text-slate-400 font-light">
              Tune how much each dimension contributes to the overall compatibility score (sum equals 1.0).
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Values & Relationship Goals Weight:</span>
                  <span className="font-bold text-amber-400">
                    {Math.round(settings.matchingWeights.valuesWeight * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.5"
                  step="0.05"
                  value={settings.matchingWeights.valuesWeight}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      matchingWeights: {
                        ...settings.matchingWeights,
                        valuesWeight: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Location Proximity Weight:</span>
                  <span className="font-bold text-amber-400">
                    {Math.round(settings.matchingWeights.locationWeight * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.5"
                  step="0.05"
                  value={settings.matchingWeights.locationWeight}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      matchingWeights: {
                        ...settings.matchingWeights,
                        locationWeight: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Personality Quiz Harmony Weight:</span>
                  <span className="font-bold text-amber-400">
                    {Math.round(settings.matchingWeights.quizWeight * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.5"
                  step="0.05"
                  value={settings.matchingWeights.quizWeight}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      matchingWeights: {
                        ...settings.matchingWeights,
                        quizWeight: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Pricing Controls */}
          <div className="glass-card rounded-3xl p-6 border border-navy-700 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Configurable Membership Pricing (USD)
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Gold Monthly ($)</label>
                <input
                  type="number"
                  value={settings.prices.goldMonthly}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      prices: { ...settings.prices, goldMonthly: parseFloat(e.target.value) },
                    })
                  }
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Gold Yearly ($)</label>
                <input
                  type="number"
                  value={settings.prices.goldYearly}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      prices: { ...settings.prices, goldYearly: parseFloat(e.target.value) },
                    })
                  }
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Platinum Monthly ($)</label>
                <input
                  type="number"
                  value={settings.prices.platinumMonthly}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      prices: { ...settings.prices, platinumMonthly: parseFloat(e.target.value) },
                    })
                  }
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Platinum Yearly ($)</label>
                <input
                  type="number"
                  value={settings.prices.platinumYearly}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      prices: { ...settings.prices, platinumYearly: parseFloat(e.target.value) },
                    })
                  }
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              className="mt-4 px-6 py-2.5 rounded-xl gradient-rose text-white text-xs font-bold shadow-glow-rose"
            >
              Save Platform Configuration
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
