import express from 'express';
import cors from 'cors';
import pino from 'pino';
import dotenv from 'dotenv';
import { getContacts, getContact } from './controllers/contactsController.js';

dotenv.config();

const logger = pino({ level: 'info' });

export function setupServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Routes
  app.get('/contacts', getContacts);
  app.get('/contacts/:contactId', getContact); // Реєстрація роута

  // Handle non-existing routes
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  // Start server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}
