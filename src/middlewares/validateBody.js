// ✅ Middleware для валідації тіла запиту (req.body) за допомогою схеми Joi
import createHttpError from 'http-errors';

export const validateBody = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (err) {
      const error = createHttpError(400, 'Bad Request', {
        errors: err.details.map((error) => error.message),
        // Повний об'єкт помилок доступний через 'err.details'
      });
      next(error);
    }
  };
};
