import jwt from 'jsonwebtoken';
import { userMon } from "../models/user.js";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import { sessionMon } from "../models/session.js";
import crypto from "node:crypto";
import { SMTP } from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendMail.js';

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  await sendEmail({
    from: getEnvVar(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetToken}">here</a> to reset your password!</p>`,
  });
};


export async function registerUser(payload) {
    const existingUser = await userMon.findOne({ email: payload.email });

    if (existingUser) {
        throw createHttpError(409, "Email is already in use");
    }

    const salt = await bcrypt.genSalt(10);
    payload.password = await bcrypt.hash(payload.password, salt);

    return userMon.create(payload);
}

export async function loginUser(email, password) {
    const user = await userMon.findOne({ email });

    if (!user) {
        throw createHttpError(401, "Email or password is incorrect");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw createHttpError(401, "Email or password is incorrect");
    }

    await sessionMon.deleteOne({ userId: user._id });

    return sessionMon.create({
        userId: user._id,
        accessToken: crypto.randomBytes(30).toString("base64"),
        refreshToken: crypto.randomBytes(30).toString("base64"),
        accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 хвилин
        refreshTokenValidUntil: new Date(Date.now() + 720 * 60 * 60 * 1000), // 30 днів
    });
}

export async function logoutUser(sessionId) {
    await sessionMon.deleteOne({ _id: sessionId });
}

export async function refreshSession(sessionId, refreshToken) {
    const session = await sessionMon.findById(sessionId);

    if (!session) {
        throw createHttpError(401, "Session not found");
    }

    if (session.refreshToken !== refreshToken) {
        throw createHttpError(401, "Invalid refresh token");
    }

    if (session.refreshTokenValidUntil < new Date()) {
        throw createHttpError(401, "Refresh token is expired");
    }

    await sessionMon.deleteOne({ _id: session._id });

    return sessionMon.create({
        userId: session.userId,
        accessToken: crypto.randomBytes(30).toString("base64"),
        refreshToken: crypto.randomBytes(30).toString("base64"),
        accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
        refreshTokenValidUntil: new Date(Date.now() + 720 * 60 * 60 * 1000),
    });
}
export const resetPassword = async (payload) => {
    let entries;
  
    try {
      entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
    } catch (err) {
      if (err instanceof Error) throw createHttpError(401, err.message);
      throw err;
    }
  
    const user = await UsersCollection.findOne({
      email: entries.email,
      _id: entries.sub,
    });
  
    if (!user) {
      throw createHttpError(404, 'User not found');
    }
  
    const encryptedPassword = await bcrypt.hash(payload.password, 10);
  
    await UsersCollection.updateOne(
      { _id: user._id },
      { password: encryptedPassword },
    );
  };