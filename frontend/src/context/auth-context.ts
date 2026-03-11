import { createContext } from "react";
import type { LoginData, RegisterData } from "../types/Auth";

export interface AuthContextType {
  user: string | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);