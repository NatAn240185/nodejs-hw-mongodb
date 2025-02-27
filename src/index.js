import { initMongoConnection } from "./db/initMongoConnection.js";
import { setupServer } from "./server.js";
import 'dotenv/config';


initMongoConnection().then(() => {
  setupServer();
});