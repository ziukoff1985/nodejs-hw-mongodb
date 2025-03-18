import { UsersCollection } from '../db/models/user.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';

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
// existingUser --> об'єкт користувача, який повертає метод findOne({ email: payload.email }) або null, якщо користувача не знайдено
// isPasswordEqual --> булева змінна (true або false), яка вказує, чи паролі (який ввів користувач і хешований з бази) співпадають
export const loginUser = async (payload) => {
  const existingUser = await UsersCollection.findOne({ email: payload.email });

  if (!existingUser) {
    throw createHttpError(404, 'User not found');
  }

  // метод bcrypt.compare --> використовується для порівняння хешованих паролів (який ввів користувач і хешований з бази)
  const isPasswordEqual = await bcrypt.compare(
    payload.password,
    existingUser.password,
  );

  if (!isPasswordEqual) {
    throw createHttpError(401, 'Unauthorized');
  }
};
