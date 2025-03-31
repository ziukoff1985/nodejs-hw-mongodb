import { OAuth2Client } from 'google-auth-library';
import path from 'node:path';
import fs from 'node:fs/promises';
import { getEnvVar } from './getEnvVar.js';

// ✅ Утиліта для створення googleOAuthClient та генерації URL для авторизації через Google OAuth 2.0

// ✅ Шлях до файлу google-oauth.json (файл з налаштуваннями для Google OAuth -> client_id, client_secret, redirect_uri -> з Google Cloud Console)
const PATH_JSON = path.join(process.cwd(), 'google-oauth.json');

// ✅ Читаємо і парсимо файл google-oauth.json для отримання конфігурації
const oAuthConfig = JSON.parse(
  await fs.readFile(PATH_JSON, { encoding: 'utf-8' }),
);

// ✅ Створюємо новий екземпляр OAuth2Client (клас із бібліотеки google-auth-library)
const googleOAuthClient = new OAuth2Client({
  clientId: getEnvVar('GOOGLE_AUTH_CLIENT_ID'),
  clientSecret: getEnvVar('GOOGLE_AUTH_CLIENT_SECRET'),
  redirectUri: oAuthConfig.web.redirect_uris[0], // redirect_uri -> з google-oauth.json
  // альтернативно -> redirectUri: getEnvVar('GOOGLE_AUTH_REDIRECT_URI'),
});

// ✅ Генерація URL-адреси для авторизації через метод generateAuthUrl.
// Використовує googleOAuthClient із scope:
// - userinfo.email: доступ до email користувача
// - userinfo.profile: доступ до базової інформації профілю (імя, фото тощо)
// scope — це набір дозволів (permissions), які наш додаток запитує у Google
export const generateGoogleOAuthUrl = () => {
  return googleOAuthClient.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });
};

// Повертає -> приклад URL-адреси для авторизації:
// https://accounts.google.com/o/oauth2/auth?client_id=...&redirect_uri=...&scope=...&response_type=code
