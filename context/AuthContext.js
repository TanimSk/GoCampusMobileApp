import React, { createContext, useContext, useState } from 'react';
import * as api from '../api/gocampus';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);

  const signIn = async ({ id, password }) => {
    const payload = await api.login(id, password);

    const nextSession = {
      accessToken: payload.access,
      refreshToken: payload.refresh,
      role: payload.role,
      user: payload.user,
    };

    setSession(nextSession);
    return nextSession;
  };

  const signOut = async () => {
    const token = session?.accessToken;

    setSession(null);

    if (!token) {
      return;
    }

    try {
      await api.logout(token);
    } catch {
      // Ignore logout failures after local session is cleared.
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        signIn,
        signOut,
        setSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
