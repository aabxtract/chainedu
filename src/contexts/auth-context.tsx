"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { ADMIN_WALLET, STUDENT_WALLET_1, STUDENT_WALLET_2, type User, users } from '@/lib/mock-data';

type AuthContextType = {
  user: User | null;
  login: (walletAddress: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (walletAddress: string) => {
    const foundUser = users.find(u => u.walletAddress === walletAddress);
    setUser(foundUser || null);
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
