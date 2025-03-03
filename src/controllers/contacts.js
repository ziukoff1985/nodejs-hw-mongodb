import {
  createNewContact,
  getAllContacts,
  getContactById,
} from '../services/contacts.js';

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

export const createNewContactController = async (req, res) => {
  if (!req.body.name || !req.body.phoneNumber || !req.body.contactType) {
    const missingFields = [];

    if (!req.body.name) {
      missingFields.push('name');
    }
    if (!req.body.phoneNumber) {
      missingFields.push('phoneNumber');
    }
    if (!req.body.contactType) {
      missingFields.push('contactType');
    }

    throw createHttpError(
      400,
      `Missing required fields: ${missingFields.join(', ')}`,
    );

    // res.status(400).json({
    //   status: 400,
    //   message: `Missing required fields: ${missingFields.join(', ')}`,
    // });
    // return;
  }

  const newContact = await createNewContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a new contact!',
    data: newContact,
  });
};
