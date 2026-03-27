import api from "../hooks/api-client";

export const uploadFile = async (file: File, fieldName = "file"): Promise<string> => {
  const formData = new FormData();
  formData.append(fieldName, file);

  const upload = await api.post<{ url: string }>("/file", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return upload.data.url;
};
