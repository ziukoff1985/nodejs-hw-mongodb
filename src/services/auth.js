import { UsersCollection } from '../db/models/user.js';

// ✅ Асинхронна функція-сервіс --> реєстрація нового користувача
export const registerUser = async (payload) => {
  const newUser = await UsersCollection.create(payload);
  return newUser;
};
