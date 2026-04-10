// src/services/api.js

import axios from "axios";
import { TOKEN_KEY } from "../utils/constants";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

// 👉 INTERCEPTOR DE REQUEST: agrega token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 👉 INTERCEPTOR DE RESPONSE: detecta token expirado o inválido
api.interceptors.response.use(
  (response) => response, // si todo OK
  (error) => {
    // Si el backend devuelve 401 → Token expirado o inválido
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);

      // Redirige inmediatamente al login
      window.location.href = "/login";

      return;
    }

    return Promise.reject(error);
  }
);
