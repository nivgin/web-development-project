import type { User } from "../types/User";

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  profilePicture?: File;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}