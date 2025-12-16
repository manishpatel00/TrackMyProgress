import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for saved user on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to parse saved user:', err);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Mock login function (in a real app this would call an API)
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // First allow the demo account
      if (email === 'demo@example.com' && password === 'password') {
        const newUser: User = {
          id: '1',
          name: 'Demo User',
          email: 'demo@example.com',
          createdAt: new Date().toISOString(),
        };

        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
      } else {
        // Check locally persisted users (demo only — replace with server auth in production)
        const usersRaw = localStorage.getItem('users');
        const users = usersRaw ? JSON.parse(usersRaw) : {};
        const entry = users[email];
        if (entry && entry.password === password) {
          setUser(entry.user as User);
          localStorage.setItem('user', JSON.stringify(entry.user));
        } else {
          throw new Error('Invalid email or password');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Mock register function
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Prevent registering demo user
      if (email === 'demo@example.com') {
        throw new Error('Email already in use');
      }

      const newUser: User = {
        id: crypto.randomUUID ? crypto.randomUUID() : `user-${Date.now()}`,
        name,
        email,
        createdAt: new Date().toISOString(),
      };

      // Persist user and credentials locally for demo purposes
      const usersRaw = localStorage.getItem('users');
      const users = usersRaw ? JSON.parse(usersRaw) : {};
      if (users[email]) {
        throw new Error('Email already in use');
      }
      users[email] = { user: newUser, password };
      localStorage.setItem('users', JSON.stringify(users));

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));

      // Attempt to notify backend to send a welcome email (best-effort)
      try {
        const base = (import.meta as any).env?.VITE_API_BASE || '';
        await fetch(`${base}/api/send-registration`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name }),
        });
      } catch (err) {
        // ignore network or server errors — this is best-effort in demo app
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
