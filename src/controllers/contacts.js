import { getAllContacts, getContactById } from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getAllContactsController = async (req, res) => {
  const contacts = await getAllContacts();

  // Код для тестування обробки помилок
  // throw new Error('Test error: Failed to fetch contacts');

  res.status(200).json({
    status: 200,
    message: `Successfully found contacts in the amount of ${contacts.length} pcs!`,
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  // Старий варіант перевірки на відсутність контакту
  // Код змінили на throw createHttpError(404, 'Contact not found');
  // if (!contact) {
  // next(new Error('Contact not found'));
  // return;
  // }

  // Старий варіант коду обробки помилок
  // Код змінили на next(new Error('Contact not found'));
  //   if (!contact) {
  //     res.status(404).json({
  //       message: 'Contact not found',
  //     });
  //     return;
  //   }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id: ${contactId}!`,
    data: contact,
  });
};
