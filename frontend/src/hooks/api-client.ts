import axios from 'axios';
import type { AxiosInstance } from 'axios'

let api: AxiosInstance | null = null;

export const getApi = (): AxiosInstance => {
  if (api) return api;

  const backendURL: string = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/';

  api = axios.create({
    baseURL: backendURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  api.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    res => res,
    async err => {
      const originalRequest = err.config;
      if (err.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          const response = await axios.post(
            backendURL + 'auth/refreshToken',
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`
              }
            }
          );
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
          
          const body = JSON.parse(originalRequest.data || '{}');
          if (body.refreshToken) {
            body.refreshToken = response.data.refreshToken;
            originalRequest.data = JSON.stringify(body);
          }

          return axios(originalRequest);
        } catch (refreshErr) {
          localStorage.clear()
          
          window.location.href = '/auth';

          throw refreshErr;
        }
      }
      throw err;
    }
  );

  return api;
};

export default getApi();