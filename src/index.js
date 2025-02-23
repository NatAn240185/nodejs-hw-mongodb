import dotenv from 'dotenv';
import { initMongoDB } from './db/initMongoConnection.js';
import { startServer } from './server.js';

dotenv.config();

const bootstrap = async () => {
  await initMongoDB();
  startServer();
};

bootstrap();