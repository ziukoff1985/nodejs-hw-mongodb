import express from 'express';
import { Router } from 'express';
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
import { createContactSchema } from '../validation/contacts.js';

const router = Router();

const jsonParser = express.json({
  // Вказуємо, що ми очікуємо JSON-дані або JSON:API
  type: ['application/json', 'application/vnd.api+json'],
  limit: '100kb', // обмеження на розмір тіла запиту
});

router.get('/contacts', ctrlWrapper(getAllContactsController));
router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));
router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));

router.post(
  '/contacts',
  jsonParser,
  validateBody(createContactSchema),
  ctrlWrapper(createNewContactController),
);
router.put(
  '/contacts/:contactId',
  jsonParser,
  ctrlWrapper(putContactController),
);
router.patch(
  '/contacts/:contactId',
  jsonParser,
  ctrlWrapper(patchContactController),
);

export default router;
