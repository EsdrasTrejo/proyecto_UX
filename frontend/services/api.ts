import axios from 'axios';

import { authStorage } from './auth-storage';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,

  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token =
      authStorage.getToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
);

/*
 * Manejo global de respuestas.
 */
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401
    ) {
      authStorage.removeToken();

      if (
        typeof window !==
        'undefined'
      ) {
        const currentPath =
          window.location.pathname;

        /*
         * No redirigir si ya estamos
         * en login o registro.
         *
         * Así un login incorrecto puede
         * mostrar su propio mensaje.
         */
        const isPublicAuthPage =
          currentPath === '/login' ||
          currentPath ===
            '/register';

        if (!isPublicAuthPage) {
          window.location.replace(
            '/login',
          );
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;