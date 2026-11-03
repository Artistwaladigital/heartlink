import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  demoAccounts: any[];
  refreshUser: () => Promise<void>;
  switchAccount: (userId: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  demoAccounts: [],
  refreshUser: async () => {},
  switchAccount: async () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [demoAccounts, setDemoAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const data = await api.getMe();
      if (data.user) {
        setUser(data.user);
      } else {
        // Automatically default to Sophia for instant mobile testing!
        const auto = await api.switchDemo('usr_sophia');
        if (auto.user) setUser(auto.user);
      }
      if (data.demoAccounts) {
        setDemoAccounts(data.demoAccounts);
      }
    } catch (e) {
      console.log('Mobile getMe error, setting default persona:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const switchAccount = async (userId: string) => {
    try {
      const res = await api.switchDemo(userId);
      if (res.success && res.user) {
        setUser(res.user);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        demoAccounts,
        refreshUser,
        switchAccount,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
