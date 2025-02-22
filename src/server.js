// Імпортуємо необхідні модулі
import express from 'express'; // фреймворк для створення сервера
import pino from 'pino-http'; // middleware для логування запитів
import cors from 'cors'; // middleware для дозволу CORS-запитів

// Створюємо об'єкт сервера
export const setupServer = express();

// визначаємо порт для запуску сервера
const PORT = 3000;

// Middleware Pino для інформативного логування запитів
// виводить у консоль інфу про запит, включаючи час, метод, URL, заголовки, параметри, body
setupServer.use(
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

// Middleware для дозволу CORS-запитів
// дозволяє робити запити з інших доменів
setupServer.use(cors());

// Middleware для логування часу запиту
// setupServer.use((req, res, next) => {
//   console.log(`Time: ${new Date().toLocaleString()}`);
//   console.log('\x1b[32mТест зеленим кольором\x1b[0m');
//   next();
// });

// Вбудований у express middleware для обробки (парсингу) JSON-даних у запитах
// наприклад, у запитах POST або PATCH
setupServer.use(express.json());

// Маршрут для обробки GET-запитів на '/'
setupServer.get('/', (req, res) => {
  res.json({ message: 'Hello Цыган!' });
});

// Маршрут для обробки POST-запитів на '/'
// setupServer.post('/', (req, res) => {
//   res.json({ message: 'POST accepted!' });
// });

// Middleware для обробки невідомих запитів (404)
// при запиті на невідомий маршрут:
// повертає JSON-відповідь -> "Page Not found" з кодом 404
setupServer.use('*', (req, res, next) => {
  res.status(404).json({ message: 'Page Not found' });
});

// Middleware для обробки помилок -> "error-handling middleware" (приймає 4 аргументи)
// при помилці:
// повертає JSON-відповідь -> "Something went wrong" з кодом 500
// та текстом помилки
setupServer.use((err, req, res, next) => {
  res.status(500).json({
    message: 'Something went wrong',
    error: err.message,
  });
});

// Запуск сервера (прослуховування порту) на порту 3000
setupServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
