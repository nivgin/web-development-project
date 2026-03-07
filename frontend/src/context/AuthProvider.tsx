import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context";
import { useAPI } from "../hooks/useApi";
import { useLocalStorage } from "usehooks-ts";
import type { User } from "../types/User";
import type { LoginData, RegisterData } from "../types/Auth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const api = useAPI();
  const [user, setUser, removeUser] = useLocalStorage<User | null>("user", null);
  const [loading, setLoading] = useState(true);

  const login = async (data: LoginData) => {
    const { accessToken, refreshToken, user } = await api.auth.login(data);

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    setUser(user);
  };

  const register = async (data: RegisterData) => {
    await api.auth.register(data);
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      await api.auth.logout(refreshToken);
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    removeUser();
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setLoading(false);
        return;
      }

      if (user) {
        setLoading(false);
        return;
      }

      try {
        const me = await api.auth.getUserByUsername("me");
        setUser(me);
      } catch {
        removeUser();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
