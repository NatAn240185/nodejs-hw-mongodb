import fs from 'node:fs/promises';
import path from 'node:path';

export const saveFileToUploadDir = async (file) => {
  const uploadDir = path.join(__dirname, '../uploads');
  const filePath = path.join(uploadDir, file.originalname);

  // Переконайтеся, що директорія існує
  await fs.mkdir(uploadDir, { recursive: true });

  // Переміщаємо файл до локальної директорії
  await fs.copyFile(file.path, filePath);
  await fs.unlink(file.path); // Видаляємо тимчасовий файл

  return filePath; // Повертаємо шлях до збереженого файлу
};
