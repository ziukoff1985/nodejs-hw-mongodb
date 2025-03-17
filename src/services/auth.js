import { UsersCollection } from '../db/models/user.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';

// ✅ Асинхронна функція-сервіс:
// перевірка чи є користувач з такою емейл-адресою в базі --> якщо є --> викидає помилку
// якщо ні --> реєструє нового користувача --> повертає зареєстрованого користувача
// hashedPassword --> хеширований пароль (формується за допомогою bcrypt) --> бере payload.password з req.body і хеширує його
export const registerUser = async (payload) => {
  const existingUser = await UsersCollection.findOne({ email: payload.email });
  if (existingUser) {
    throw createHttpError(409, 'This email is already in use');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  console.log('hashedPassword:', hashedPassword);

  const newUser = await UsersCollection.create({
    ...payload,
    password: hashedPassword,
  });

  return newUser;
};
