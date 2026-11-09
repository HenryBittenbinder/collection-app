import axios from 'axios';

export type ApiErrorInfo = { message: string; fieldErrors: Record<string, string> };

export function getApiError(error: unknown): ApiErrorInfo {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: unknown; errors?: Record<string, string[]> }
      | undefined;
    const fieldErrors = Object.fromEntries(
      Object.entries(data?.errors ?? {}).flatMap(([field, messages]) =>
        messages[0] ? [[field, messages[0]]] : [],
      ),
    );

    if (!error.response) {
      return {
        message: error.code === 'ECONNABORTED'
          ? 'A conexão demorou demais. Tente novamente.'
          : 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
        fieldErrors,
      };
    }

    return {
      message: typeof data?.message === 'string' ? data.message : 'Não foi possível concluir a solicitação.',
      fieldErrors,
    };
  }

  return { message: 'Ocorreu um erro inesperado. Tente novamente.', fieldErrors: {} };
}
