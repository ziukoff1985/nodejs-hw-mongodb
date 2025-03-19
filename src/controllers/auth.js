import { THIRTY_DAYS } from '../constants/index.js';
import { loginUser, registerUser } from '../services/auth.js';

// ✅ Контролер для реєстрації користувача
// Викликає асинхронну функцію-сервіс registerUser --> передає req.body
// ✅ Реєструє нового користувача --> повертає статус 201, повідомлення і об'єкт зареєстрованого користувача
export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  // Варіант Видалення пароля з об'єкта користувача
  // ✅ Актуальна реєстрації в моделі src/db/models/user.js
  // ✅ const { password, ...userData } = user.toObject();

  // user --> об'єкт, який повертає метод UsersCollection.create(payload) з сервісу src/services/auth.js
  // У Mongoose --> це не звичайний JavaScript-об'єкт, а спеціальний об'єкт типу Document
  // user.toObject() --> перетворює Mongoose-документ у звичайний JavaScript-об'єкт

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a new user!',
    data: user,
  });
};

// ✅ Контролер для входу користувача
// session --> об'єкт, який повертає метод UsersCollection.login(payload) з сервісу src/services/auth.js
// Викликає асинхронну функцію-сервіс loginUser --> передає req.body
export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  // ✅ Встановлюємо cookie --> для refreshToken
  // httpOnly --> вказує, що cookie доступний тільки для HTTP-запитів
  // expires --> вказує, скільки часу cookie буде діяти
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
    // secure: true, // cookies надсилаються тільки через HTTPS
    // sameSite: 'none', // дозволяє крос-доменні запити (якщо потрібен фронтенд на іншому домені)
  });

  // ✅ Встановлюємо cookie --> для sessionId
  // ❗ додаємо toString() --> для явного перетворення session._id у рядок перед передачею в res.cookie()
  // ❗ Це потрібно щоб sessionId в файлі cookie і _id в базі даних збігалися
  res.cookie('sessionId', session._id.toString(), {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
    // secure: true,
    // sameSite: 'none',
  });

  // відповідь --> повертає статус 200, повідомлення і об'єкт з accessToken
  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
