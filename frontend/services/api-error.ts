import axios from 'axios';

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage =
    'Ocurrió un error inesperado.',
): string {
  if (!axios.isAxiosError(error)) {
    return fallbackMessage;
  }

  const data =
    error.response
      ?.data as ApiErrorResponse
      | undefined;

  if (
    Array.isArray(data?.message)
  ) {
    return data.message.join(', ');
  }

  if (
    typeof data?.message ===
    'string'
  ) {
    return data.message;
  }

  switch (
    error.response?.status
  ) {
    case 400:
      return 'Los datos enviados no son válidos.';

    case 401:
      return 'Tu sesión ha expirado.';

    case 403:
      return 'No tienes permiso para realizar esta acción.';

    case 404:
      return 'El recurso solicitado no fue encontrado.';

    case 409:
      return 'Ya existe un registro con esos datos.';

    case 500:
      return 'Ocurrió un error en el servidor.';

    default:
      return fallbackMessage;
  }
}