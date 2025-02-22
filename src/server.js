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

app.use("/contacts", contactRoutes); // Видаляємо /api
app.use("/auth", authRoutes); // Видаляємо /api


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

export function setupServer() {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
  });
}


export default app; 



