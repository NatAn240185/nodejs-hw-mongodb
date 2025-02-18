import { userMon } from "../models/user.js";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import { sessionMon } from "../models/session.js";
import crypto from "node:crypto";

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
