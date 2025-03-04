import { Router } from 'express';
// import { getAllContacts, getContactById } from '../services/contacts.js';
import {
  createNewContactController,
  deleteContactController,
  getAllContactsController,
  getContactByIdController,
  putContactController,
} from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getAllContactsController));

router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

router.post('/contacts', ctrlWrapper(createNewContactController));

router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));

router.put('/contacts/:contactId', ctrlWrapper(putContactController));

export default router;
