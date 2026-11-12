"use client";

import * as React from "react";
import { apiFetch } from "./api-client";

export interface AuthUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  /** Re-read the user from the API (e.g. after profile updates or login) */
  refresh: () => Promise<AuthUser | null>;
}

const AuthContext = React.createContext<AuthContextValue>({
  user: null,
  status: "loading",
  refresh: async () => null,
});

/**
 * Lightweight replacement for NextAuth's SessionProvider.
 * The JWT lives in an httpOnly cookie relayed through the same-origin API
 * proxy; this context reads /api/auth/me to know whether the user is logged in.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [status, setStatus] = React.useState<AuthStatus>("loading");

  const refresh = React.useCallback(async () => {
    try {
      const res = await apiFetch("/api/auth/me");
      if (!res.ok) {
        setUser(null);
        setStatus("unauthenticated");
        return null;
      }
      const data = await res.json();
      setUser(data.user ?? null);
      setStatus(data.user ? "authenticated" : "unauthenticated");
      return data.user ?? null;
    } catch {
      setUser(null);
      setStatus("unauthenticated");
      return null;
    }
  }, []);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async auth check; state updates happen after await
    refresh();
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ user, status, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}
