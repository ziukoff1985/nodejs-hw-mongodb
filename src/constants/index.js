// ✅ Константи для визначення порядку сортування
// "asc" - зростання, "desc" - спадання
export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

// ✅ Константи для визначення тривалості життя токену (в мс):
// Тривалість для Access Token --> 15 хвилин
export const FIFTEEN_MINUTES = 15 * 60 * 1000;

// Тривалість для Refresh Token --> 30 днів
export const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

// ✅ Константи для SMTP (SMTP - Simple Mail Transfer Protocol)
// Будуть використовуватись при відновленні пароля, дані беремо після реєстрації в Brevo (SMTP-сервер Brevo)
export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};
