// ✅ Функція-обгортка для контролерів -> використовується для обробки помилок -> використовується в роутах -> в разі помилки викликається next(error) -> передається в middleware errorHandler
export const ctrlWrapper = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
