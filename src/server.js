import cors from 'cors';
import path from "node:path";
import express from 'express';
import 'dotenv/config';
import pino from 'pino-http';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import routes from './routers/contacts.js';
import cookieParser from "cookie-parser";
import authRouter from "./routers/auth.js";
import { authenticate } from "./middlewares/authenticate.js";


const app = express();

app.use("/photo", express.static(path.resolve("src/public/photo")));

app.use(cors());

app.use(cookieParser());

app.use('/auth', authRouter);

app.use(authenticate, routes);

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
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


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