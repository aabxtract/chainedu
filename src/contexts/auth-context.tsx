
"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect, useCallback } from 'react';
import { User, users } from '@/lib/mock-data';
import { userSession, stacksWalletManager } from '@/lib/stacks-manager';
import { UserData } from '@stacks/connect';

type AuthContextType = {
  user: User | null;
  userData: UserData | null;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const handleSignIn = useCallback(() => {
    if (userSession.isUserSignedIn()) {
      const sessionData = userSession.loadUserData();
      setUserData(sessionData);
      const walletAddress = sessionData.profile.stxAddress.testnet;
      const foundUser = users.find(u => u.walletAddress === walletAddress);
      setUser(foundUser || null);
    } else {
      setUserData(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then(() => {
        handleSignIn();
      });
    } else {
      handleSignIn();
    }
  }, [handleSignIn]);

  const login = () => {
    stacksWalletManager.connectWallet(handleSignIn);
  };

  const logout = () => {
    stacksWalletManager.disconnectWallet();
    setUser(null);
    setUserData(null);
  };

  const value = useMemo(() => ({ user, userData, login, logout }), [user, userData]);

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
