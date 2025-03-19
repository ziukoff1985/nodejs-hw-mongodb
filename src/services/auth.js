import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';

import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';

import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';

// ✅ Асинхронна функція-сервіс:
// перевірка чи є користувач з такою емейл-адресою в базі --> якщо є --> викидає помилку
// якщо ні --> реєструє нового користувача --> повертає зареєстрованого користувача
// hashedPassword --> хешований пароль (формується за допомогою bcrypt) --> бере payload.password з req.body і хеширує його
// 10 --> кількість раундів хешування
export const registerUser = async (payload) => {
  const existingUser = await UsersCollection.findOne({ email: payload.email });
  if (existingUser) {
    throw createHttpError(409, 'This email is already in use');
  }

  // метод bcrypt.hash --> хеширує пароль
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  // ❗ можна просто перевизначити payload.password не створюючи hashedPassword

  // Для дебагу --> виводить в консоль пароль, який ввів користувач і хешований пароль
  if (process.env.NODE_ENV === 'development') {
    console.log('payload.password:', payload.password);
    console.log('hashedPassword:', hashedPassword);
  }

  // метод create() використовується для створення нового документу в колекції UsersCollection
  // payload --> об'єкт, який містить дані нового користувача (без паролю)
  // payload.password --> пароль нового користувача (хешований) --> додається до об'єкта payload
  const newUser = await UsersCollection.create({
    ...payload,
    password: hashedPassword,
  });

  return newUser;
};

// ✅ Асинхронна функція-сервіс для входу користувача
// payload --> об'єкт, який містить дані користувача (email і пароль)

export const loginUser = async (payload) => {
  // existingUser --> об'єкт користувача, який повертає метод findOne({ email: payload.email }) або null, якщо користувача не знайдено
  const existingUser = await UsersCollection.findOne({ email: payload.email });

  // якщо користувача не знайдено (existingUser === null) --> викидає помилку
  if (!existingUser) {
    throw createHttpError(404, 'User not found');
  }

  // isPasswordEqual --> булева змінна (true або false), яка вказує, чи паролі (який ввів користувач і хешований з бази) співпадають
  // метод bcrypt.compare --> використовується для порівняння хешованих паролів (який ввів користувач і хешований з бази)
  const isPasswordEqual = await bcrypt.compare(
    payload.password,
    existingUser.password,
  );

  // якщо паролі не співпадають (isPasswordEqual === false) --> викидає помилку
  if (!isPasswordEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  // асинхронний запит до колекції SessionsCollection для видалення попередньої сесії користувача з відповідним _id (видалення старої сесії)
  await SessionsCollection.deleteOne({ userId: existingUser._id });

  // генерація токенів (за допомогою randomBytes)
  // accessToken --> токен доступу
  // refreshToken --> токен оновлення (для accessToken)
  // 30 --> кількість байтів, які будуть згенеровані
  // base64 --> кодування в base64
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  // асинхронний запит до колекції SessionsCollection для створення нової сесії користувача
  // existingUser._id --> _id користувача, який залогінився (тобто -> ця сесія належить користувачу з таким _id у users)
  // accessToken --> токен доступу на 15 хвилин
  // refreshToken --> токен оновлення (для accessToken) на 30 днів
  return await SessionsCollection.create({
    userId: existingUser._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
};
