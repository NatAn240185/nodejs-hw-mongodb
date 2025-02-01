import express from "express";
import * as contactsController from "../controllers/contacts.js";

const router = express.Router(); // Оголошуємо router перед використанням

// Отримати всі контакти
router.get("/", contactsController.getAllContacts);

// DELETE-Route для видалення контакту
router.delete("/:contactId", contactsController.deleteContact);

export default router;



