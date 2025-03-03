import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
// import { getAllContacts, getContactById } from './services/contacts.js';

const PORT = Number(getEnvVar('PORT', 3000));

export const setupServer = () => {
  const app = express();

  app.use(
    express.json({
      // Вказуємо, що ми очікуємо JSON-дані або JSON:API
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb', // обмеження на розмір тіла запиту
    }),
  );
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'yyyy-mm-dd HH:MM:ss', // Налаштування формату часу
        },
      },
    }),
  );

  app.use(contactsRouter);

  app.get('/', (req, res) => {
    res.status(200).json({
      status: 200,
      message: 'GET request for root route successfully accepted!',
      timestamp: new Date().toISOString(),
    });
  });

  app.post('/', (req, res) => {
    res.status(200).json({
      status: 200,
      message: 'POST request for root route successfully accepted!',
      timestamp: new Date().toISOString(),
    });
  });

  // Старі роути - видалені  і перенесені в src/routers/contacts.js
  // app.get('/contacts', async (req, res) => {
  //   const contacts = await getAllContacts();

  //   res.status(200).json({
  //     status: 200,
  //     message: `Successfully found contacts in the amount of ${contacts.length} pcs!`,
  //     data: contacts,
  //   });
  // });

  // app.get('/contacts/:contactId', async (req, res) => {
  //   const { contactId } = req.params;
  //   const contact = await getContactById(contactId);

  //   if (!contact) {
  //     res.status(404).json({
  //       message: 'Contact not found',
  //     });
  //     return;
  //   }

  //   res.status(200).json({
  //     status: 200,
  //     message: `Successfully found contact with id: ${contactId}!`,
  //     data: contact,
  //   });
  // });

  app.use('*', notFoundHandler);

  // Старий Middleware для обробки помилок 404
  // app.use('*', (req, res, next) => {
  //   res.status(404).json({ message: 'Page Not found' });
  // });

  app.use(errorHandler);

  // Старий Middleware для обробки помилок 500
  // app.use((err, req, res, next) => {
  //   res.status(500).json({
  //     message: 'Something went wrong',
  //     error: err.message,
  //   });
  // });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
