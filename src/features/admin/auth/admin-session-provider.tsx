"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { services } from "@/lib/api";
import type { AdminSession } from "@/lib/types/admin";

const sessionKey = "daily-crumb-admin-session";
type SessionContextValue = {
  session: AdminSession | null;
  ready: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
const SessionContext = createContext<SessionContextValue | null>(null);

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = window.sessionStorage.getItem(sessionKey);
    if (raw) {
      const stored = JSON.parse(raw) as AdminSession;
      // Browser-only mock hydration is intentionally deferred until after mount.
      if (new Date(stored.expiresAt) > new Date()) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSession(stored);
      } else window.sessionStorage.removeItem(sessionKey);
    }
    setReady(true);
  }, []);

  const value: SessionContextValue = {
    session,
    ready,
    async login(username, password) {
      const nextSession = await services.admin.auth.login({ username, password });
      window.sessionStorage.setItem(sessionKey, JSON.stringify(nextSession));
      setSession(nextSession);
    },
    async logout() {
      await services.admin.auth.logout();
      window.sessionStorage.removeItem(sessionKey);
      setSession(null);
    },
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useAdminSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useAdminSession must be used inside AdminSessionProvider");
  return context;
}
