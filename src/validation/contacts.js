import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name must be at most 20 characters long',
    'any.required': 'Name is required',
  }),
  phoneNumber: Joi.string()
    .min(3)
    .max(20)
    .pattern(/^\+?[1-9]\d{6,14}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Phone number must be a valid number (e.g., +380501234567)',
      'any.required': 'Phone number is required',
    }),
  email: Joi.string().max(50).email().optional().messages({
    'string.email': 'Email must be a valid email address',
  }),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .messages({
      'any.only': "Contact type must be one of: 'work', 'home', 'personal'",
      'any.required': 'Contact type is required',
    }),
  isFavourite: Joi.boolean().optional(),
});
