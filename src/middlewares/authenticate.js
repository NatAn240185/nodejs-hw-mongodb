import createHttpError from 'http-errors';
import { sessionMon } from '../models/session.js';
import { userMon } from '../models/user.js';

export async function authenticate(req, res, next) {
    const { authorization } = req.headers;

    if (typeof authorization !== "string") {
        return next(createHttpError(401, "Access token expired"));
    }

    const [bearer, accessToken] = authorization.split(" ", 2);

    if (bearer !== "Bearer" || typeof accessToken !== "string") {
        return next(createHttpError(401, "Access token expired"));
    }

    const session = await sessionMon.findOne({ accessToken });
    
    if (session === null) {
        return next(createHttpError(401, "Session not found"));
    }

    if (session.accessTokenValidUntil < new Date()) {
        return next(createHttpError(401, "Access token expired"));
    }

        const user = await userMon.findById(session.userId);

        if (user === null) {
            return next(createHttpError(401, "User not found"));
        }

        req.user = user;
        
        next();
    }