import { userMon } from "../models/user.js";
import createHttpError from 'http-errors';
import bcrypt from "bcrypt";
import { sessionMon } from "../models/session.js";
import crypto from "node:crypto";

export async function registerUser(payload) {
    const user = await userMon.findOne({ email: payload.email });
    
    if (user !== null) {
        throw createHttpError(409, "Email in use");
    }

    payload.password = await bcrypt.hash(payload.password, 10);

    return userMon.create(payload);
}


export async function loginUser(email, password) {
    const user = await userMon.findOne({ email });
    
    if (user === null) {
        throw createHttpError(401, "Email or password is incorrect");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch !== true) {
    throw createHttpError(401, "Email or password is incorrect");
    }

    await sessionMon.deleteOne({ userId: user._id });

    return sessionMon.create({
        userId: user._id,
        accessToken: crypto.randomBytes(30).toString("base64"),
        refreshToken: crypto.randomBytes(30).toString("base64"),
        accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
        refreshTokenValidUntil: new Date(Date.now() + 720 * 60 * 60 + 1000),
    });
}

export async function logoutUser(sessionId) {
    await sessionMon.deleteOne({ _id: sessionId }); 
}

export async function refreshSession(sessionId, refreshToken) {
    const session = await sessionMon.findById(sessionId);

    if (session === null) {
        throw createHttpError(401, "Session not found");
    }

    if (session.refreshToken !== refreshToken) {
        throw createHttpError(401, "Session not found");
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
        refreshTokenValidUntil: new Date(Date.now() + 720 * 60 * 60 + 1000),
        });
    
}