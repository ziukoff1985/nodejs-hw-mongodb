import createHttpError from 'http-errors';

// Middleware для валідації тіла запиту за допомогою схеми Joi
export const validateBody = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (err) {
      const error = createHttpError(400, 'Bad Request', {
        errors: err.details.map((error) => error.message),
        // Або можна просто errors: err.details
      });
      next(error);
    }
  };
};
