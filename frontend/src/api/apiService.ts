import api from "./axios";

interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  profilePicture?: File;
}

const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/file", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  
  return res.data.url;
};

export const apiService = {
  login: async (data: LoginData) => {
    const res = await api.post("/auth/login", data);
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);

    return res.data;
  },

  register: async (data: Omit<RegisterData, "profilePicture"> & { profilePicture?: File }) => {
    let pfpUrl: string | undefined;
    if (data.profilePicture) {
      pfpUrl = await uploadImage(data.profilePicture);
    }

    const res = await api.post("/auth/register", {
      username: data.username,
      email: data.email,
      password: data.password,
      pfpUrl,
    });

    return res.data;
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};