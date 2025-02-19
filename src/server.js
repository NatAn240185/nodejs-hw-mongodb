import cors from 'cors';
import express from 'express';
import 'dotenv/config';
import pino from 'pino-http';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import contactRoutes from './routers/contacts.js';
import authRoutes from './routers/auth.js'; // Додаємо імпорт

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/contacts", contactRoutes); // Додаємо префікс /api/contacts
app.use("/api/auth", authRoutes); //  Фікс шляху для auth

app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

app.get('/', (req, res) => {
    res.json({
      message: 'Hello World!',
    });
});

app.use('*', notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Видаляємо setupServer() та просто запускаємо сервер тут
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export function setupServer() {
  try {
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
      });
  } catch (error) {
      console.error(error);
  }
}



