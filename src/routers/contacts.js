// Імпорт Router з express
// Express Router - об'єкт, який використовується для групування роутів
import { Router } from 'express';

// Імпорт контролерів
import {
  createNewContactController,
  deleteContactController,
  getAllContactsController,
  getContactByIdController,
  patchContactController,
  putContactController,
} from '../controllers/contacts.js';

// Імпорт ctrlWrapper - утиліта для огортання контролерів
// Для обробки помилок (try...catch) і захищення від падіння сервера (unhandled promise rejection)
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

// Створення екземпляру Router
const router = Router();

// Роути для різних видів запитів
router.get('/contacts', ctrlWrapper(getAllContactsController));
router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));
router.post('/contacts', ctrlWrapper(createNewContactController));
router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));
router.put('/contacts/:contactId', ctrlWrapper(putContactController));
router.patch('/contacts/:contactId', ctrlWrapper(patchContactController));

// Експорт екземпляру Router
export default router;
