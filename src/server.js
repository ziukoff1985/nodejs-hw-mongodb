import express from 'express'; // фреймворк для створення сервера
import pino from 'pino-http'; // middleware для логування запитів
import cors from 'cors'; // middleware для дозволу CORS-запитів
import { getEnvVar } from './utils/getEnvVar.js'; // функція для отримання значення змінної середовища

// Отримання значення змінної середовища PORT
// Якщо змінна PORT не вказана, то використовується значення 3000
// Якщо змінна PORT не вказана та значення 3000 не вказано, то викидається помилка
const PORT = Number(getEnvVar('PORT', 3000));

// Функція для налаштування сервера
export const setupServer = () => {
  // Створення екземпляру сервера express
  const app = express();

  // Middleware для парсингу JSON-об'єктів в тілі запиту
  app.use(express.json());

  // Middleware для дозволу CORS-запитів
  app.use(cors());

  // Middleware "pino" для логування запитів
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'yyyy-mm-dd HH:MM:ss', // Налаштування формату часу
        },
      },
    }),
  );

  // Маршрут для обробки GET-запитів на '/'
  app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
  });

  // Маршрут для обробки POST-запитів на '/'
  app.post('/', (req, res) => {
    res.json({ message: 'POST accepted!' });
  });

  // Middleware для обробки помилок 404 - якщо маршрут не знайдено,
  // то відправляємо відповідь з кодом 404 та повідомленням "Page Not found"
  app.use('*', (req, res, next) => {
    res.status(404).json({ message: 'Page Not found' });
  });

  // Middleware для обробки помилок сервера
  app.use((err, req, res, next) => {
    // Встановлення статусу відповіді на 500 та відправка JSON з повідомленням про помилку
    res.status(500).json({
      message: 'Something went wrong', // Повідомлення про помилку
      error: err.message, // Деталі помилки
    });
  });

  // Запуск сервера на вказаному порту
  app.listen(PORT, () => {
    // Виводимо повідомлення про запуск сервера
    console.log(`Server is running on port ${PORT}`);
  });
};

// Middleware для логування часу запиту
// setupServer.use((req, res, next) => {
//   console.log(`Time: ${new Date().toLocaleString()}`);
//   console.log('\x1b[32mТест зеленим кольором\x1b[0m');
//   next();
// });
