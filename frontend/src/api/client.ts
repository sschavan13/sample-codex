import axios from 'axios';

import { config } from '../config';

export const apiClient = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((requestConfig) => {
  if (!config.enableAuth) {
    return requestConfig;
  }
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('linklens.token');
    if (token) {
      requestConfig.headers = {
        ...requestConfig.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }
  return requestConfig;
});
