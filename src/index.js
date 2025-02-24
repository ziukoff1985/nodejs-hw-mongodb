// Імпортуємо функцію setupServer з файлу server.js
import { startServer } from './server.js';

// Імпортуємо функцію initMongoDB з файлу initMongoDB.js
import { initMongoDB } from './db/initMongoDB.js';

// Функція bootstrap для ініціалізації сервера та підключення до бази даних
const bootstrap = async () => {
  await initMongoDB(); // Ініціалізуємо підключення до бази даних
  startServer(); // Запускаємо сервер
};

// Викликаємо функцію bootstrap
bootstrap();

// Connection string MongoDB:
// mongodb+srv://ziukoff1985:UkYIIN5kZm55c6b0@cluster0.ecvpl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
