import express from "express";
import { deleteContact } from "../controllers/contacts.js";

const router = express.Router();

// DELETE-Route для видалення контакту
router.delete("/:contactId", deleteContact);

export default router;


