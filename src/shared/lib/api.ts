import axios from 'axios';
import Constants from 'expo-constants';
import { router } from 'expo-router';

import { clearStoredAuthToken, getStoredAuthToken } from '@/src/features/auth/api/authStorage';
import { queryClient } from '@/src/shared/lib/queryClient';

const configuredBaseUrl = process.env.EXPO_PUBLIC_API_URL;
const host = Constants.expoConfig?.hostUri?.split(':')[0];
const baseURL = configuredBaseUrl || (host ? `http://${host}:8000/api` : 'http://localhost:8000/api');

const api = axios.create({
  baseURL,
  headers: { Accept: 'application/json' },
  timeout: 15000,
});

let onUnauthorized: (() => Promise<void>) | null = null;

export function setUnauthorizedHandler(handler: (() => Promise<void>) | null) {
  onUnauthorized = handler;
}

api.interceptors.request.use(async (config) => {
  const token = await getStoredAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      if (onUnauthorized) {
        await onUnauthorized();
      } else {
        await clearStoredAuthToken();
        queryClient.clear();
        router.replace('/login');
      }
    }

    return Promise.reject(error);
  },
);

export default api;
