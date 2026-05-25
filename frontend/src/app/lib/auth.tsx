import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { fetchCurrentUser, login, register, type CurrentUser, type LoginInput, type RegisterInput } from './api';

type AuthContextValue = {
  currentUser: CurrentUser | null;
  loading: boolean;
  signIn: (input: LoginInput) => Promise<CurrentUser>;
  signUp: (input: RegisterInput) => Promise<CurrentUser>;
  signOut: () => void;
};

const STORAGE_KEY = 'freelancehub.currentUser';

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser() {
  const rawValue = localStorage.getItem(STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as CurrentUser;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function storeUser(user: CurrentUser | null) {
  if (!user) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => readStoredUser());
  const [loading, setLoading] = useState(Boolean(currentUser));

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    fetchCurrentUser(currentUser.userId)
      .then((freshUser) => {
        if (cancelled) {
          return;
        }

        setCurrentUser(freshUser);
        storeUser(freshUser);
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setCurrentUser(null);
        storeUser(null);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    currentUser,
    loading,
    async signIn(input) {
      const user = await login(input);
      setCurrentUser(user);
      storeUser(user);
      return user;
    },
    async signUp(input) {
      const user = await register(input);
      setCurrentUser(user);
      storeUser(user);
      return user;
    },
    signOut() {
      setCurrentUser(null);
      storeUser(null);
    },
  }), [currentUser, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return value;
}
