import express from "express";
import { sendResetEmailController, validateEmail } from "../controllers/authController.js";

const router = express.Router();

// Маршрут для скидання пароля
router.post("/auth/send-reset-email", validateEmail, sendResetEmailController);

export default router;
