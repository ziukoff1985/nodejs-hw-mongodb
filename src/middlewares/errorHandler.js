import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.name,
      data: err,
    });
    return;
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
};

// Старий варіант Middleware для обробки помилок 500
// export const errorHandler = (err, req, res, next) => {
//     res.status(500).json({
//       message: 'Something went wrong',
//       error: err.message,
//     });
//   };
