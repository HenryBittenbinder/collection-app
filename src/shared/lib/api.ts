import axios from 'axios';
import Constants from 'expo-constants';

const configuredBaseUrl = process.env.EXPO_PUBLIC_API_URL;
const host = Constants.expoConfig?.hostUri?.split(':')[0];
const baseURL = configuredBaseUrl || (host ? `http://${host}:8000/api` : 'http://localhost:8000/api');

const api = axios.create({
  baseURL,
  headers: { Accept: 'application/json' },
  timeout: 15000,
});

export default api;
