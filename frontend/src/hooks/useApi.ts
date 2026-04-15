import api from "./api-client";
import type { User } from "../types/User";
import type { LoginData, RegisterData, LoginResponse } from "../types/Auth";
import type { Post, PostFull, CreatePostData, UpdatePostData } from "../types/Post";
import type { UpdateUserData } from "../types/User";
import { uploadFile } from "../utils/uploadFile";
import type { Comment } from "../types/Comment";

export const useAPI = () => {
  return {
    auth: {
      login: async (data: LoginData) =>
        (await api.post<LoginResponse>("/auth/login", data)).data,

      register: async (data: RegisterData) => {
        let pfpUrl: string | undefined;

        if (data.profilePicture) {
          pfpUrl = await uploadFile(data.profilePicture);
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

      googleLogin: async (idToken: string) =>
        (await api.post<{ accessToken: string; refreshToken: string }>("/auth/google", { idToken })).data,

      getUserByUsername: async (username: string) =>
        (await api.get<User>(`/user/${username}`)).data,
    },
    posts: {
      getCategories: async () =>
        (await api.get<string[]>("/post/categories")).data,

      getPosts: async (search?: string, page?: number, limit?: number) =>
        (
          await api.get<Post[]>("/post", {
            params: { search, page, limit },
          })
        ).data,

      getPostById: async (id: string) =>
        (await api.get<PostFull>(`/post/${id}`)).data,

      getPostsBySender: async (sender: string, search?: string, page?: number, limit?: number) =>
        (
          await api.get<Post[]>("/post", {
            params: { sender, search, page, limit },
          })
        ).data,
        
      createPost: async ({ image, ...rest }: CreatePostData) => {
        const imageUrl = await uploadFile(image);
        return (await api.post<Post>("/post", { ...rest, imageUrl })).data;
      },

      updatePost: async (id: string, { image, existingImageUrl, ...rest }: UpdatePostData) => {
        const imageUrl = image ? await uploadFile(image) : existingImageUrl;
        return (await api.put<Post>(`/post/${id}`, { ...rest, imageUrl })).data;
      },

      deletePost: async (id: string) =>
        (await api.delete(`/post/${id}`)).data,

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

      updateUser: async (id: string, { image, existingPfpUrl, ...rest }: UpdateUserData) => {
        const pfpUrl = image ? await uploadFile(image) : existingPfpUrl;
        const body = { ...rest, pfpUrl };
        if (!body.password) delete body.password;
        return (await api.patch<User>(`/user/${id}`, body)).data;
      },
    },
  };
};
