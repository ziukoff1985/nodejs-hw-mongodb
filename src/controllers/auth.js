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
// Викликає асинхронну функцію-сервіс loginUser --> передає req.body
export const loginUserController = async (req, res) => {
  await loginUser(req.body);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in!',
  });
};
