import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const SESSION_KEY = "r3_session";
const REMEMBER_KEY = "r3_remember";

export type SessionUser = {
  email: string;
  name: string;
};

type AuthContextValue = {
  user: SessionUser | null;
  isReady: boolean;
  rememberMe: boolean;
  signIn: (email: string, password: string, remember: boolean) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [rememberMe, setRememberMe] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await SecureStore.getItemAsync(SESSION_KEY);
        const rememberRaw = await SecureStore.getItemAsync(REMEMBER_KEY);
        if (cancelled) return;
        if (raw) setUser(JSON.parse(raw) as SessionUser);
        if (rememberRaw !== null) setRememberMe(rememberRaw !== "0");
      } finally {
        if (!cancelled) setIsReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string, remember: boolean) => {
    if (!email.trim() || !password) {
      throw new Error("Completa correo y contraseña.");
    }
    const localPart = email.split("@")[0] ?? "Usuario";
    const name =
      localPart.length > 1
        ? localPart.charAt(0).toUpperCase() + localPart.slice(1)
        : "Usuario";
    const session: SessionUser = { email: email.trim().toLowerCase(), name };
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
    await SecureStore.setItemAsync(REMEMBER_KEY, remember ? "1" : "0");
    setRememberMe(remember);
    setUser(session);
  }, []);

  const signOut = useCallback(async () => {
    await SecureStore.deleteItemAsync(SESSION_KEY).catch(() => {});
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isReady, rememberMe, signIn, signOut }),
    [user, isReady, rememberMe, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

