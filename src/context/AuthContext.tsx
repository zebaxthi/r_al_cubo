import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

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

// Web UI-only: guardamos la sesión en memoria (sin expo-secure-store).
let webUser: SessionUser | null = null;
let webRememberMe = true;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [rememberMe, setRememberMe] = useState(webRememberMe);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setUser(webRememberMe ? webUser : null);
    setRememberMe(webRememberMe);
    setIsReady(true);
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
    webUser = session;
    webRememberMe = remember;
    setRememberMe(remember);
    setUser(session);
  }, []);

  const signOut = useCallback(async () => {
    webUser = null;
    webRememberMe = true;
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
