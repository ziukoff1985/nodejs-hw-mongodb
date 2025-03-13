// ✅ Middleware для перевірки валідності ID контакту
// 🍳 isValidObjectId --> функція з бібліотеки Mongoose
// 🍳 isValidObjectId --> перевіряє, чи є рядок валідним MongoDB ObjectId (захищає від невалідних ObjectId)
// 🍳 Валідний ObjectId — це 24-символьний шістнадцятковий рядок

import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    next(createHttpError(400, 'Invalid contact ID'));
    // ✅ Альтернативний варіант
    // throw createHttpError(400, 'Invalid contact ID');
  }
  next();
};
