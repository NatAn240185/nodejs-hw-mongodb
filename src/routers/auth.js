import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { loginSchema, registerSchema, resetEmail, resetPasswordSchema } from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { loginController, logoutController, refreshController, registerController, resetPasswordController, sendResetPasswordController } from '../controllers/auth.js';

const router = express.Router();
const jsonParser = express.json();

router.post("/register", jsonParser, validateBody(registerSchema), ctrlWrapper(registerController));

router.post("/login", jsonParser, validateBody(loginSchema), ctrlWrapper(loginController));

router.post('/logout', ctrlWrapper(logoutController));

router.post('/refresh', ctrlWrapper(refreshController));

router.post('/send-reset-email', jsonParser, validateBody(resetEmail), ctrlWrapper(sendResetPasswordController));

router.post('/reset-pwd', jsonParser, validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));

export default router;

