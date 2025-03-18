import express, { Router } from 'express';
import {
  createNewContactController,
  deleteContactController,
  getAllContactsController,
  getContactByIdController,
  patchContactController,
  putContactController,
} from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

// ❗ Парсер JSON для req.body --> обов'язково прописувати у всіх файлах роутерів
const jsonParser = express.json({
  // Вказуємо, що ми очікуємо JSON-дані або JSON:API
  type: ['application/json', 'application/vnd.api+json'],
  limit: '100kb', // обмеження на розмір тіла запиту
});

// прибираємо path "/contacts" --> оскільки створили хаб маршрутів src/routers/index.js (було '/contacts' --> стало '/')
router.get('/', ctrlWrapper(getAllContactsController));

// ✅ Важливо! ❗ Порядок middleware: isValidId → ctrlWrapper
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

// ✅ Важливо! ❗ Порядок middleware: jsonParser → validateBody → ctrlWrapper
router.post(
  '/',
  jsonParser,
  validateBody(createContactSchema),
  ctrlWrapper(createNewContactController),
);
router.put(
  '/:contactId',
  jsonParser,
  isValidId,
  validateBody(createContactSchema),
  ctrlWrapper(putContactController),
);
router.patch(
  '/:contactId',
  jsonParser,
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

export default router;
