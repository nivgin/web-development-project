import axios from 'axios';
import type { AxiosInstance } from 'axios'

let api: AxiosInstance | null = null;

export const getApi = (): AxiosInstance => {
  if (api) return api;

  api = axios.create({
    baseURL: 'http://localhost:4000/',
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
          const response = await axios.post('http://localhost:4000/auth/refreshToken', { token: refreshToken });
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;

          return axios(originalRequest);
        } catch (refreshErr) {
          console.log('Refresh token failed', refreshErr);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
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