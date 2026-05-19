import type { AuthSession } from "@/types/auth";

const STORAGE_KEY = "atracio.session";

export const atracioAuthClient = {
  async login(email: string, _password: string): Promise<AuthSession> {
    await new Promise((r) => setTimeout(r, 600));
    const session: AuthSession = {
      token: `mock-token-${Math.random().toString(36).slice(2)}`,
      email: email || "demo@atracio.com",
      tenant: "demo",
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
    return session;
  },
  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  },
  getSession(): AuthSession | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthSession;
    } catch {
      return null;
    }
  },
};
