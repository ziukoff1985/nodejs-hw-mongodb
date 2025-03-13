import { ContactsCollection } from '../db/models/contacts.js';

// ✅ Константа --> динамічно витягує значення зі схеми -> властивості "contactType" -> enum (['personal', 'work', 'home'])
const VALID_CONTACT_TYPES =
  ContactsCollection.schema.path('contactType').enumValues || [];

// console.log('VALID_CONTACT_TYPES:', VALID_CONTACT_TYPES);

// ✅ Функція для парсингу параметру "type" (для поля contactType)
// 🍳 Перевіряє чи є задане значення "contactType" валідним
// 🚀 Повертає:
// -> рядок (наприклад, "personal"), якщо "contactType" валідний
// -> undefined, якщо "contactType" НЕ є валідним
const parseContactType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;
  // 🍳 Альтернативний варіант #1: const validTypes = ['personal', 'work', 'home'];
  // 🍳 Альтернативний варіант #2: const validTypes =
  //   ContactsCollection.schema.path('contactType').enumValues || [];
  return VALID_CONTACT_TYPES.includes(type) ? type : undefined;
};

// ✅ Функція для парсингу параметру "isFavourite"
// 🍳 Перевіряє чи є задане значення "isFavourite" валідним
// 🚀 Повертає:
// -> true або false, якщо "isFavourite" валідний ("true" або "false")
// -> undefined, якщо "isFavourite" НЕ є валідним
const parseBoolean = (value) => {
  const isString = typeof value === 'string';
  if (!isString) return;
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;
};

// ✅ Функція-парсер параметрів фільтрації з запиту клієнта (req_query)
// 🍳 Приймає --> req.query
// 🚀 Повертає --> об'єкт із contactType (рядок, наприклад, "personal") і isFavourite (true/false)
export const parseFilterParams = (req_query) => {
  const { type, isFavourite } = req_query;

  const parsedContactType = parseContactType(type);
  const parsedIsFavourite = parseBoolean(isFavourite);

  return {
    contactType: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
};
