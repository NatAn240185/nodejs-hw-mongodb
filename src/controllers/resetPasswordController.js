import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import User from "../models/user.js";
import Session from "../models/session.js";

export async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;

    // Перевіряємо, чи прийшли всі необхідні дані
    if (!token || !password) {
      throw createHttpError(400, "Token and password are required.");
    }

    // Перевіряємо токен
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw createHttpError(401, "Token is expired or invalid.");
    }

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      throw createHttpError(404, "User not found!");
    }

    // Хешуємо новий пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Оновлюємо пароль
    await User.updateOne({ _id: user._id }, { password: hashedPassword });

    // Видаляємо всі сесії користувача
    await Session.deleteMany({ userId: user._id });

    res.status(200).json({
      status: 200,
      message: "Password has been successfully reset.",
      data: {},
    });
  } catch (err) {
    next(err);
  }
}
