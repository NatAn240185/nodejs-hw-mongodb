import { sendResetEmail } from "../services/sendResetEmail.js";
import { validateBody } from "../middlewares/validateBody.js";
import { body, validationResult } from "express-validator";

export const sendResetEmailController = async (req, res, next) => {
  try {
    // Валідація email
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Відправка email
    const response = await sendResetEmail(req.body.email);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Middleware для перевірки валідності email
export const validateEmail = [
  body("email").isEmail().withMessage("Invalid email format"),
  validateBody,
];
