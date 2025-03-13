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

const jsonParser = express.json({
  // Вказуємо, що ми очікуємо JSON-дані або JSON:API
  type: ['application/json', 'application/vnd.api+json'],
  limit: '100kb', // обмеження на розмір тіла запиту
});

router.get('/contacts', ctrlWrapper(getAllContactsController));

// ✅ Важливо! ❗ Порядок middleware: isValidId → ctrlWrapper
router.get(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
);
router.delete(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
);

// ✅ Важливо! ❗ Порядок middleware: jsonParser → validateBody → ctrlWrapper
router.post(
  '/contacts',
  jsonParser,
  validateBody(createContactSchema),
  ctrlWrapper(createNewContactController),
);
router.put(
  '/contacts/:contactId',
  jsonParser,
  isValidId,
  validateBody(createContactSchema),
  ctrlWrapper(putContactController),
);
router.patch(
  '/contacts/:contactId',
  jsonParser,
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

export default router;
