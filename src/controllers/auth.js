import { loginUser, logoutUser, refreshSession, registerUser, resetPassword, sendResetPassword } from "../services/auth.js";

export async function registerController(req, res) {
    const payload = {
        name: req.body.name,
        email: req.body.email, 
        password: req.body.password,
    };
    
    const registeredUser = await registerUser(payload);
        
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user',
      data: registeredUser,
    });
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
        message: 'Successfully logged in an user!',
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
        message: 'Successfully refreshed a session!!',
        data: {
            accessToken: session.accessToken,
        }
    });
    
}

export async function sendResetPasswordController(req, res) {
    const { email } = req.body;
     
    await sendResetPassword(email);
    
    res.send({
        status: 200,
        message: 'Reset password email has been successfully sent.',
        data: {}
     });
}

export async function resetPasswordController(req, res) {
    const { password, token } = req.body;

    await resetPassword( password, token );
    
    res.send({
        status: 200,
        message: 'Password has been successfully reset.',
        data: {}
     });
}