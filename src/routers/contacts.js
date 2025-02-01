import express from "express";
import { deleteContact, getAllContacts } from "../controllers/contacts.js";

const router = express.Router();

router.get("/", getAllContacts); // Отримати всі контакти
router.delete("/:contactId", deleteContact); // Видалити контакт

export default router;




