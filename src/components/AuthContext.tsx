'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, PublicProfile } from '@/types';

interface DemoAccount {
  id: string;
  email: string;
  name: string;
  role: string;
  membershipTier: string;
  city: string;
  age: number;
  avatar: string;
  preferredExperience: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  demoAccounts: DemoAccount[];
  metrics: {
    matchesCount: number;
    blindMatchesCount: number;
    likesReceivedCount: number;
  };
  refreshUser: () => Promise<void>;
  switchAccount: (userId: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  demoAccounts: [],
  metrics: { matchesCount: 0, blindMatchesCount: 0, likesReceivedCount: 0 },
  refreshUser: async () => {},
  switchAccount: async () => false,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoAccounts, setDemoAccounts] = useState<DemoAccount[]>([]);
  const [metrics, setMetrics] = useState({ matchesCount: 0, blindMatchesCount: 0, likesReceivedCount: 0 });

  const refreshUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        if (data.metrics) setMetrics(data.metrics);
      } else {
        setUser(null);
      }
      if (data.demoAccounts) {
        setDemoAccounts(data.demoAccounts);
      }
    } catch (err) {
      console.error('Failed to load user session:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const switchAccount = async (userId: string) => {
    try {
      const res = await fetch('/api/auth/switch-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        await refreshUser();
        window.location.reload();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Switch account failed:', err);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        demoAccounts,
        metrics,
        refreshUser,
        switchAccount,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
