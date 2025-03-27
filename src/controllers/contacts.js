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
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

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
  const photo = req.file; // отримуємо об'єкт файлу (зображення) -> 'multer' парсить запит 'multipart/form-data', знаходить поле photo і додає його дані в 'req.file'
  /* в 'photo' лежить обʼєкт файлу
		{
		  fieldname: 'photo',
		  originalname: 'download.jpeg',
		  encoding: '7bit',
		  mimetype: 'image/jpeg',
		  destination: '/home/node_js/nodejs-hw-mongodb/contact-app/temp',
		  filename: '1710709919677_download.jpeg',
		  path: '/home/node_js/nodejs-hw-mongodb/contact-app/temp/1710709919677_download.jpeg',
		  size: 7
	  }
	*/

  let photoUrl = null; // змінна для зберігання URL фото

  // перевіряємо чи був завантажений файл -> якщо так -> saveFileToUploadDir(photo) — переміщує файл із 'temp' у 'uploads' і повертає URL
  if (photo) {
    photoUrl = await saveFileToUploadDir(photo);
  }

  const newContact = await createNewContact({
    ...req.body,
    userId: req.user._id, // Додаємо userId із req.user (посилання на id користувача), який створив контакт до req.body
    photo: photoUrl, // Додаємо поле photo до req.body (посилання на фото контакту) -> URL зображення
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

  const photo = req.file;

  let photoUrl = null;

  if (photo) {
    photoUrl = await saveFileToUploadDir(photo);
  }

  const userId = req.user._id; // Додаємо userId із req.user (посилання на id користувача), який створив контакт

  const result = await patchUpdateContact(
    contactId,
    { ...req.body, photo: photoUrl },
    userId,
  );

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

  const photo = req.file; // отримуємо об'єкт файлу (зображення) -> 'multer' парсить запит 'multipart/form-data', знаходить поле photo і додає його дані в 'req.file'

  let photoUrl = null;

  if (photo) {
    photoUrl = await saveFileToUploadDir(photo);
  }

  const userId = req.user._id; // Додаємо userId із req.user (посилання на id користувача), який створив контакт

  const result = await putUpdateContact(
    contactId,
    { ...req.body, photo: photoUrl },
    userId,
    {
      upsert: true,
    },
  );

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
