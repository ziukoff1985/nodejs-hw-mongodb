import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

export const createNewContact = async (payload) => {
  const newContact = await ContactsCollection.create(payload);
  return newContact;
};

export const deleteContact = async (contactId) => {
  const deletedContact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
  });
  return deletedContact;
};

export const patchUpdateContact = async (contactId, payload, options = {}) => {
  const updatedContact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    { $set: payload }, // $set для часткового оновлення документа
    { new: true, ...options },
  );
  if (!updatedContact) {
    return null;
  }
  return updatedContact;
};

export const putUpdateContact = async (contactId, payload, options = {}) => {
  const updatedContact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    { new: true, includeResultMetadata: true, ...options },
  );
  if (!updatedContact || !updatedContact.value) {
    return null;
  }
  return {
    contact: updatedContact.value,
    isNew: Boolean(updatedContact?.lastErrorObject?.upserted),
  };
};

// ❗❗❗ Альтернативний варіант putUpdateContact, якщо потрібно замінити весь документ на новий
// ✅ В цьому варіанті ми використовуємо метод findOneAndReplace, який замінює весь документ на новий (непередані поля в body -> будуть видалені з документа)
// ----------------------------------------------------------
// export const putUpdateContact = async (contactId, payload, options = {}) => {
//   const existingContact = await ContactsCollection.findById(contactId);
//   const updatedContact = await ContactsCollection.findOneAndReplace(
//     { _id: contactId },
//     { _id: contactId, ...payload },
//     { new: true, ...options },
//   );
//   if (!updatedContact) {
//     return null;
//   }
//   return {
//     contact: updatedContact,
//     isNew: options.upsert && !existingContact,
//   };
// };
