import { registerUser } from '../services/auth.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  // Видаляємо пароль з об'єкта користувача
  // user --> об'єкт, який повертає метод UsersCollection.create(payload) з сервісу src/services/auth.js
  // У Mongoose --> це не звичайний JavaScript-об'єкт, а спеціальний об'єкт типу Document
  // user.toObject() --> перетворює Mongoose-документ у звичайний JavaScript-об'єкт
  const { password, ...userData } = user.toObject();

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a new user!',
    data: userData,
  });
};
