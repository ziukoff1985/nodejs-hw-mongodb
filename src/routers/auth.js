// ✅ Роутер для реєстрації користувача

import express, { Router } from 'express';
import { registerUserSchema } from '../validation/auth.js';
import { registerUserController } from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = Router();

const jsonParser = express.json({
  // Вказуємо, що ми очікуємо JSON-дані або JSON:API
  type: ['application/json', 'application/vnd.api+json'],
  limit: '100kb', // обмеження на розмір тіла запиту
});

// path: '/auth/register' --> jsonParser --> валідація тіла запиту (через схему registerUserSchema) --> контролер реєстрації (registerUserController)
router.post(
  '/register',
  jsonParser,
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

export default router;
