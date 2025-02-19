import express from "express";
import { validateBody } from "../middlewares/validateBody.js";
import { loginSchema, registerSchema, resetPasswordSchema } from "../validation/auth.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { 
    loginController, 
    logoutController, 
    refreshController, 
    registerController, 
    resetPasswordController // ✅ Додаємо новий контролер
} from "../controllers/auth.js";

const router = express.Router();
const jsonParser = express.json();

router.post("/register", jsonParser, validateBody(registerSchema), ctrlWrapper(registerController));
router.post("/login", jsonParser, validateBody(loginSchema), ctrlWrapper(loginController));
router.post("/logout", ctrlWrapper(logoutController));
router.post("/refresh", ctrlWrapper(refreshController));

// Додаємо новий ендпоінт для скидання пароля
router.post("/auth/reset-pwd", jsonParser, validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));

export default router;
