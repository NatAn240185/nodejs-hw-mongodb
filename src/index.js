import express from "express";
import contactRouter from "./routers/contacts.js";

const app = express();

app.use(express.json()); // Middleware для парсингу JSON
app.use("/contacts", contactRouter); // Підключення маршруту для контактів

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
