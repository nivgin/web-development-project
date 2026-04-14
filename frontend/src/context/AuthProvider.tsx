import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context";
import { useAPI } from "../hooks/useApi";
import type { LoginData, RegisterData } from "../types/Auth";

type JwtPayload = {
  _id: string;
  exp: number;
  iat: number;
};

const parseJwt = (token: string): JwtPayload | null => {
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const api = useAPI();
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (data: LoginData) => {
    const { accessToken, refreshToken } = await api.auth.login(data);

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    const payload = parseJwt(accessToken);

    if (payload) {
      setUser(payload._id);
      setIsAuthenticated(true);
    }
  };

  const register = async (data: RegisterData) => {
    await api.auth.register(data);
  };

  const loginWithGoogle = async (idToken: string) => {
    const { accessToken, refreshToken } = await api.auth.googleLogin(idToken);

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    const payload = parseJwt(accessToken);
    if (payload) {
      setUser(payload._id);
      setIsAuthenticated(true);
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      await api.auth.logout(refreshToken);
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setIsAuthenticated(false);
        localStorage.clear();
        setLoading(false);
        return;
      }

      const payload = parseJwt(token);
      
      if (payload) {
        setUser(payload._id);
        setIsAuthenticated(true);
        setLoading(false);
        return
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setIsAuthenticated(false);
      setLoading(false);
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        loginWithGoogle,
        logout,
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
