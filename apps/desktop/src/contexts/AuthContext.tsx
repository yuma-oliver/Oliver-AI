import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { initMsal, signIn, signOut, getCurrentUser } from "@oliver/graph";
import type { AccountInfo } from "@azure/msal-browser";

interface AuthContextValue {
  user: AccountInfo | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initMsal()
      .then(() => setUser(getCurrentUser()))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function login() {
    try {
      await signIn();
      setUser(getCurrentUser());
    } catch (e) {
      console.error("Login failed", e);
    }
  }

  async function logout() {
    try {
      await signOut();
      setUser(null);
    } catch (e) {
      console.error("Logout failed", e);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
