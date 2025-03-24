import Joi from 'joi'; // Joi - бібліотека для валідації даних

// ✅ Валідатор для реєстрації користувача
export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must be at least {#limit} characters long',
  }),
  email: Joi.string().max(50).email().required().messages({
    'string.email':
      'Email must be a valid email address (e.g., 2mGxO@example.com)',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).max(128).required().messages({
    'string.base': 'Password must be a string',
    'string.min': 'Password must be at least {#limit} characters long',
  }),
});

// ✅ Валідатор для логіну користувача
export const loginUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email':
      'Email must be a valid email address (e.g., 2mGxO@example.com)',
    'any.required': 'Email is required',
  }),
  password: Joi.string().max(128).required().messages({
    'any.required': 'Password is required',
  }),
});

// ✅ Валідатор для запиту на відновлення пароля
export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email':
      'Email must be a valid email address (e.g., 2mGxO@example.com)',
    'any.required': 'Email is required',
  }),
});
