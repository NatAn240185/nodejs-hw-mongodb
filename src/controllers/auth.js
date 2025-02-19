import { loginUser, logoutUser, refreshSession, registerUser } from "../services/auth.js";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import { sessionMon } from "../models/session.js";

export async function registerController(req, res) {
    const payload = {
        name: req.body.name,
        email: req.body.email, 
        password: req.body.password,
    };
    
    const registeredUser = await registerUser(payload);

    res.send({ status: 201, message: 'Successfully registered a user', data: registeredUser });
}

export async function loginController(req, res) {
    const { email, password } = req.body;
     
    const session = await loginUser(email, password);
    
    res.cookie("sessionId", session._id, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });

    res.cookie("refreshToken", session.refreshToken, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });
    
    res.send({
        status: 200,
        message: 'Successfully logged in a user!',
        data: {
            accessToken: session.accessToken,
        }
     });
}

export async function logoutController(req, res) {
    const {sessionId} = req.cookies;
    
    if (typeof sessionId === "string") {
        await logoutUser(sessionId);
    }

    res.clearCookie("sessionId");
    res.clearCookie("refreshToken");

    res.status(204).end();
}

export async function refreshController(req, res) {
    const {sessionId, refreshToken} = req.cookies;
    const session = await refreshSession(sessionId, refreshToken);

    res.cookie("sessionId", session._id, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });

    res.cookie("refreshToken", session.refreshToken, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });
    
    res.send({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: {
            accessToken: session.accessToken,
        }
    });
}

//  Додаємо новий контролер для скидання пароля
export async function resetPasswordController(req, res, next) {
    try {
        const { token, password } = req.body;

        // Перевіряємо, чи є токен
        if (!token) {
            throw createHttpError(401, "Token is expired or invalid.");
        }

        // Розшифровуємо токен
        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw createHttpError(401, "Token is expired or invalid.");
        }

        // Шукаємо користувача за email, який записаний у токені
        const user = await User.findOne({ email: payload.email });

        if (!user) {
            throw createHttpError(404, "User not found!");
        }

        // Хешуємо новий пароль
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        // Видаляємо всі сесії користувача
        await Session.deleteMany({ userId: user._id });

        res.json({
            status: 200,
            message: "Password has been successfully reset.",
            data: {}
        });
    } catch (error) {
        next(error);
    }
}
