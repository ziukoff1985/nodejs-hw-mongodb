// ✅ Утиліта для надсилання листів
// ✅ Використовуємо в src/services/auth.js

import nodemailer from 'nodemailer';

import { SMTP } from '../constants/index.js';
import { getEnvVar } from './getEnvVar.js';

// ✅ Налаштування SMTP
// створюємо об'єкт transporter із налаштуваннями SMTP (хост, порт, авторизація)
const transporter = nodemailer.createTransport({
  host: getEnvVar(SMTP.SMTP_HOST),
  port: Number(getEnvVar(SMTP.SMTP_PORT)),
  auth: {
    user: getEnvVar(SMTP.SMTP_USER),
    pass: getEnvVar(SMTP.SMTP_PASSWORD),
  },
});

// ✅ Функція-сервіс для надсилання листів
// Приймає об'єкт options (кому, від кого, тема, текст) і відправляє лист за допомогою методу sendMail (метод з nodemailer)
export const sendEmail = async (options) => {
  return await transporter.sendMail(options);
};
