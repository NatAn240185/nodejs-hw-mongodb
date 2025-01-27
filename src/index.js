import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

async function startApp() {
  try {
    await initMongoConnection(); // Встановлення підключення до MongoDB
    setupServer(); // Запуск сервера
  } catch (error) {
    console.error('Failed to start the application:', error.message);
  }
}

startApp();
