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

export async function resetPasswordController(req, res, next) {
  const { token, password } = req.body;

  try {
    // Перевірка токену та скидання паролю
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userMon.findOne({ email: decoded.email });
    
    if (!user) {
      throw createHttpError(404, "User not found!");
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();
    
    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    next(error);
  }
}

