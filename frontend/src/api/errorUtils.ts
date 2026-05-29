import { ApiError } from './apiClient';

export function getFriendlyErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const statusSuffix = ` (Код: ${error.status})`;
    switch (error.status) {
      case 400:
        return (error.message || 'Некорректные данные. Пожалуйста, проверьте введённую информацию.') + statusSuffix;
      case 401:
        // Если сервер прислал конкретное сообщение (например, при ошибке логина), используем его.
        // В противном случае считаем, что сессия истекла.
        return (error.message || 'Сессия истекла. Пожалуйста, войдите снова.') + statusSuffix;
      case 403:
        return 'У вас недостаточно прав для выполнения этого действия.' + statusSuffix;
      case 404:
        return 'Запрашиваемый ресурс не найден.' + statusSuffix;
      case 409:
        return (error.message || 'Конфликт данных. Пожалуйста, попробуйте другое значение.') + statusSuffix;
      case 500:
        return 'Произошла внутренняя ошибка сервера. Попробуйте позже.' + statusSuffix;
      default:
        return (error.message || `Произошла ошибка`) + statusSuffix;
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Произошла непредвиденная ошибка';
}
