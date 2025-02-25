import express from 'express'; // фреймворк для створення сервера
import pino from 'pino-http'; // middleware для логування запитів
import cors from 'cors'; // middleware для дозволу CORS-запитів
import { getEnvVar } from './utils/getEnvVar.js'; // функція для отримання значення змінної середовища
import { getAllStudents, getStudentById } from './services/students.js';

// Отримання значення змінної середовища PORT
// Якщо змінна PORT не вказана, то використовується значення 3000
// Якщо змінна PORT не вказана та значення 3000 не вказано, то викидається помилка
const PORT = Number(getEnvVar('PORT', 3000));

// Функція для налаштування сервера
export const startServer = () => {
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
    res.json({ message: 'GET accepted! Node.js - is awesome' });
  });

  // Маршрут для обробки GET-запитів на '/students'
  // Викликаємо функцію getAllStudents для отримання всіх студентів
  // Якщо відповідь сервера 200, то відправляємо JSON зі списком студентів
  app.get('/students', async (req, res) => {
    const students = await getAllStudents();

    res.status(200).json({
      data: students, // Список студентів
    });
  });

  // Маршрут для обробки GET-запитів на '/students/:studentId'
  // Отримуємо ID студента з параметрів запиту
  // Викликаємо функцію getStudentById для отримання студента по ID
  app.get('/students/:studentId', async (req, res) => {
    const { studentId } = req.params;
    const student = await getStudentById(studentId);

    // Якщо студент НЕ знайдений (student === null), то відправляємо відповідь з кодом 404 та повідомленням "Student not found"
    if (!student) {
      res.status(404).json({
        message: 'Student not found',
      });
      return;
    }
    // Якщо студент знайдений, то відправляємо відповідь з кодом 200 та даними про студента
    res.status(200).json({
      data: student,
    });
  });

  // Маршрут для обробки POST-запитів на '/'
  app.post('/', (req, res) => {
    res.json({ message: 'POST accepted! MongoDB - you are awesome' });
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
