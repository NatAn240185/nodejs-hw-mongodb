import { userMon } from "../models/user.js";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import { sessionMon } from "../models/session.js";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/sendMail.js";


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
        accessTokenValidUntil: new Date(Date.now() + 180 * 60 * 1000),
        refreshTokenValidUntil: new Date(Date.now() + 720 * 60 * 60 + 1000),
        });
    
}

export async function sendResetPassword(email) {
    const user = await userMon.findOne({ email });
    
    if (user === null) {
        throw createHttpError(404, "User not found!");
    }

    const resetToken = jwt.sign({ sub: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "5m"
    });

    await sendMail({
        from: "lilihichka@seznam.cz",
        to: user.email,
        subject: "Reset password", 
        html: `<p>To reset your password please visit this <a href="http://localhost:3000/reset-password?token=${resetToken}">link</a></p>`
    });
    
}

export async function resetPassword(newPassword, token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userMon.findOne({ _id: decoded.sub, email: decoded.email });

        if (user === null) {
            throw createHttpError(404, "User not found!");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await userMon.findByIdAndUpdate(user._id, { password: hashedPassword });
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            throw createHttpError(401, "Token is expired or invalid");
        }
        throw error;
    }
    
};