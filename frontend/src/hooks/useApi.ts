import api from "./api-client";
import type { User } from "../types/User";
import type { LoginData, RegisterData, LoginResponse } from "../types/Auth";

export const useAPI = () => {
  return {
    auth: {
      login: async (data: LoginData) =>
        (await api.post<LoginResponse>("/auth/login", data)).data,

      register: async (data: RegisterData) => {
        let pfpUrl: string | undefined;

        if (data.profilePicture) {
          const formData = new FormData();
          formData.append("file", data.profilePicture);

          const upload = await api.post<{ url: string }>("/file", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          pfpUrl = upload.data.url;
        }

        return (
          await api.post("/auth/register", {
            username: data.username,
            email: data.email,
            password: data.password,
            pfpUrl,
          })
        ).data;
      },

      logout: async (refreshToken: string) => {
        return api.post("/auth/logout", { refreshToken });
      },

      getUserByUsername: async (username: string) =>
        (await api.get<User>(`/user/${username}`)).data,
    },
  };
};
