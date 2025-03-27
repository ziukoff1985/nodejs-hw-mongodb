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
export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const userId = req.user._id; // Додаємо userId із req.user (посилання на id користувача), який створив контакт

  // Викликаємо функцію-сервіс для отримання контактів
  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId, // Додаємо userId із req.user (посилання на id користувача), який створив контакт
  });

  res.status(200).json({
    status: 200,
    message: `Successfully found contacts! Page ${contacts.page} of ${contacts.totalPages}, shown ${contacts.data.length} pcs of ${contacts.totalItems} contacts`,
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id; // Додаємо userId із req.user (посилання на id користувача), який створив контакт

  const contact = await getContactById(contactId, userId);

  if (!contact) {
    throw createHttpError(
      404,
      'Contact not found or you do not have permission',
    );
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id: ${contactId}!`,
    data: contact,
  });
};

export const createNewContactController = async (req, res) => {
  // eslint-disable-next-line no-unused-vars
  const photo = req.file;

  /* в 'photo' лежить обʼєкт файлу
		{
		  fieldname: 'photo',
		  originalname: 'download.jpeg',
		  encoding: '7bit',
		  mimetype: 'image/jpeg',
		  destination: '/Users/borysmeshkov/Projects/goit-study/students-app/temp',
		  filename: '1710709919677_download.jpeg',
		  path: '/Users/borysmeshkov/Projects/goit-study/students-app/temp/1710709919677_download.jpeg',
		  size: 7
	  }
	*/

  const newContact = await createNewContact({
    ...req.body,
    userId: req.user._id, // Додаємо userId із req.user (посилання на id користувача), який створив контакт
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a new contact!',
    data: newContact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const userId = req.user._id; // Додаємо userId із req.user (посилання на id користувача), який створив контакт

  const deletedContact = await deleteContact(contactId, userId);

  if (!deletedContact) {
    throw createHttpError(
      404,
      'Contact not found or you do not have permission',
    );
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

  // eslint-disable-next-line no-unused-vars
  const photo = req.file;

  const userId = req.user._id; // Додаємо userId із req.user (посилання на id користувача), який створив контакт

  const result = await patchUpdateContact(contactId, req.body, userId);

  if (!result) {
    throw createHttpError(
      404,
      'Contact not found or you do not have permission',
    );
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
};

export const putContactController = async (req, res, next) => {
  const { contactId } = req.params;

  // eslint-disable-next-line no-unused-vars
  const photo = req.file; // отримуємо об'єкт файлу (зображення) -> 'multer' парсить запит 'multipart/form-data', знаходить поле photo і додає його дані в 'req.file'

  const userId = req.user._id; // Додаємо userId із req.user (посилання на id користувача), який створив контакт

  const result = await putUpdateContact(contactId, req.body, userId, {
    upsert: true,
  });

  if (!result) {
    throw createHttpError(
      404,
      'Contact not found or you do not have permission',
    );
  }
  const statusCode = result.isNew ? 201 : 200;

  res.status(statusCode).json({
    status: statusCode,
    message: 'Successfully upserted a contact!',
    data: result.contact,
  });
};
