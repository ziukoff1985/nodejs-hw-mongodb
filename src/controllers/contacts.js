import createHttpError from 'http-errors';

import {
  createNewContact,
  deleteContact,
  getAllContacts,
  getContactById,
  patchUpdateContact,
  putUpdateContact,
} from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

// ✅ Контроллер-обробник для отримання всіх контактів
// Витягує:
// параметри пагінації (page і perPage) --> використовуючи утиліту parsePaginationParams для валідації
// параметри сортування (sortBy і sortOrder) --> використовуючи утиліту parseSortParams для валідації
// Викликає сервіс-логіку getAllContacts
// Повертає: статус 200, повідомлення про успішне отримання контактів, і contacts --> об'єкт з масивом контактів та інформацією про пагінацію (метадані)
export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.status(200).json({
    status: 200,
    message: `Successfully found contacts in the amount of ${contacts.data.length} pcs!`,
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id: ${contactId}!`,
    data: contact,
  });
};

export const createNewContactController = async (req, res) => {
  // ✅ Старий варіант валідації --> до підключення валідатора Joi
  // if (!req.body.name || !req.body.phoneNumber || !req.body.contactType) {
  //   const missingFields = [];

  //   if (!req.body.name) {
  //     missingFields.push('name');
  //   }
  //   if (!req.body.phoneNumber) {
  //     missingFields.push('phoneNumber');
  //   }
  //   if (!req.body.contactType) {
  //     missingFields.push('contactType');
  //   }

  //   throw createHttpError(
  //     400,
  //     `Missing required fields: ${missingFields.join(', ')}`,
  //   );
  // }

  const newContact = await createNewContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a new contact!',
    data: newContact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const deletedContact = await deleteContact(contactId);

  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  // ✅ Альтернативний варіант обробки помилки
  // if (!deletedContact) {
  //   next(createHttpError(404, 'Contact not found'));
  //   return;
  // }

  res.status(204).send();
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await patchUpdateContact(contactId, req.body);

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
};

export const putContactController = async (req, res, next) => {
  const { contactId } = req.params;

  // ✅ Старий варіант валідації --> до підключення валідатора Joi
  // const existingContact = await getContactById(contactId);

  // if (!existingContact) {
  //   if (!req.body.name || !req.body.phoneNumber || !req.body.contactType) {
  //     const missingFields = [];

  //     if (!req.body.name) missingFields.push('name');
  //     if (!req.body.phoneNumber) missingFields.push('phoneNumber');
  //     if (!req.body.contactType) missingFields.push('contactType');

  //     throw createHttpError(
  //       400,
  //       `Missing required fields for upsert: ${missingFields.join(', ')}`,
  //     );
  //   }
  // }

  const result = await putUpdateContact(contactId, req.body, { upsert: true });

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }
  const statusCode = result.isNew ? 201 : 200;

  res.status(statusCode).json({
    status: statusCode,
    message: 'Successfully upserted a contact!',
    data: result.contact,
  });
};
