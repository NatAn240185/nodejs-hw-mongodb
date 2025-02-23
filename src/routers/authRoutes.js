import express from "express";
import { sendResetEmailController, validateEmail } from "../controllers/authController.js";

const router = express.Router();


router.post("/auth/send-reset-email", validateEmail, sendResetEmailController);
router.post("/auth/reset-pwd", validateBody(resetPasswordSchema), resetPasswordController);


export default router;
