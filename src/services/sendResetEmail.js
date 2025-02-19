import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import dotenv from "dotenv";
import { userMon } from "../models/user.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendResetEmail(email) {
  // Перевірка, чи є користувач в базі
  const user = await userMon.findOne({ email });
  if (!user) {
    throw createHttpError(404, "User not found!");
  }

  // Генерація JWT токена (дійсний 5 хвилин)
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "5m" });

  // Формування посилання
  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  // Налаштування листа
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Password Reset",
    text: `Click the link to reset your password: ${resetLink}`,
    html: `<p>Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
  };

  // Відправка листа
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw createHttpError(500, "Failed to send the email, please try again later.");
  }

  return {
    status: 200,
    message: "Reset password email has been successfully sent.",
    data: {},
  };
}
