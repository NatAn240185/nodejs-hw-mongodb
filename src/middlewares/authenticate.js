import createHttpError from 'http-errors';
import { sessionMon } from '../models/session.js';
import { userMon } from '../models/user.js';

export async function authenticate(req, res, next) {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return next(createHttpError(401, "Authorization header is missing"));
        }

        const [bearer, accessToken] = authorization.split(" ");

        if (bearer !== "Bearer" || !accessToken) {
            return next(createHttpError(401, "Invalid token format"));
        }

        const session = await sessionMon.findOne({ accessToken });

        if (!session) {
            return next(createHttpError(401, "Session not found"));
        }

        if (session.accessTokenValidUntil < new Date()) {
            return next(createHttpError(401, "Access token expired"));
        }

        const user = await userMon.findById(session.userId);

        if (!user) {
            return next(createHttpError(401, "User not found"));
        }

        req.user = user;
        next();
    } catch (error) {
        next(createHttpError(500, "Internal server error"));
    }
}
