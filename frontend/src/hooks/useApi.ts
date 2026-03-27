import api from "./api-client";
import type { User } from "../types/User";
import type { LoginData, RegisterData, LoginResponse } from "../types/Auth";
import type { Post, PostFull } from "../types/Post";
import type { Comment } from "../types/Comment";

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
    posts: {
      getPosts: async (search?: string, page?: number, limit?: number) =>
        (
          await api.get<Post[]>("/post", {
            params: { search, page, limit },
          })
        ).data,

      getPostById: async (id: string) =>
        (await api.get<PostFull>(`/post/${id}`)).data,

      likePost: async (id: string) =>
        (await api.post(`/post/${id}/like`)).data,

      unlikePost: async (id: string) =>
        (await api.post(`/post/${id}/unlike`)).data,
    },
    comments: {
      getCommentsByPostId: async (postId: string, page?: number, limit?: number) =>
        (await api.get<Comment[]>("/comment", { params: { postId, page, limit, populateUsers: true } })).data,

      publishComment: async (postId: string, content: string) =>
        (await api.post<Comment>("/comment", { postId, content })).data,
    },
    chefai: {
      chat: async (message: string, sessionId?: string) =>
        (await api.post("/chefai", { message, sessionId })).data,
    },
    users: {
      getUserById: async (id: string) =>
        (await api.get<User>(`/user/${id}`)).data,
    },
  };
};
