// Імпорт бібліотеки mongoose
import mongoose from 'mongoose';

// Імпорт функції getEnvVar з utils/getEnvVar.js
import { getEnvVar } from '../utils/getEnvVar.js';

// Функція ініціалізації підключення до бази даних
export const initMongoDB = async () => {
  try {
    // Отримання значень змінних середовища з .env-файлу
    const user = getEnvVar('MONGODB_USER');
    const password = getEnvVar('MONGODB_PASSWORD');
    const url = getEnvVar('MONGODB_URL');
    const db = getEnvVar('MONGODB_DB');

    // Підключення до бази даних
    // Використовуємо "Connection String" з MongoDB Atlas
    await mongoose.connect(
      `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority`,
    );
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Error while setting up mongo connection', error);
    throw error;
  }
};
