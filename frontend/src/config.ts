const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';
const enableAuth = String(import.meta.env.VITE_ENABLE_AUTH ?? 'false').toLowerCase() === 'true';

export const config = {
  apiUrl,
  enableAuth,
};
