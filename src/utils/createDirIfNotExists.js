import fs from 'node:fs/promises';

// ✅ Утиліта -> скрипт для автоматичного створення директорій, якщо вона не існує
// Приймає -> шлях до директорії
// Алгоритм: перевіряємо чи існує директорія -> якщо існує -> нічого не робимо
// якщо немає -> кидає помилку з кодом ENOENT (немає такої директорії) -> створюємо директорію
// fs.access -> перевіряє чи можна отримати доступ до вказаної директорії (права доступу) -> якщо немає -> кидає помилку -> ми ловимо помилку й створюємо нову директорію
// fs.mkdir -> створює директорію
export const createDirIfNotExists = async (dirPath) => {
  try {
    await fs.access(dirPath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(dirPath);
    }
  }
};
