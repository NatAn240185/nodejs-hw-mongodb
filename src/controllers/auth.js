import { loginUser, logoutUser, refreshSession, registerUser, requestResetToken, resetPassword } from "../services/auth.js";
import { sendEmail } from '../utils/sendMail.js';



export async function requestResetEmailController(req, res) {
    try {
        const { email } = req.body;
        console.log("EMAIL REQUEST:", email); // Додаємо логування

        const resetToken = await requestResetToken(email); // Отримуємо токен

        const mailOptions = {
            from: process.env.SMTP_FROM, // Адреса відправника
            to: email,
            subject: "Password Reset Request",
            text: `Here is your password reset link: https://yourfrontend.com/reset-password?token=${resetToken}`,
        };

        await sendEmail(mailOptions);

        res.status(200).json({
            message: "Reset token sent to email!",
            status: 200,
        });
    } catch (error) {
        console.error("EMAIL SENDING ERROR:", error);
        res.status(500).json({
            message: "Failed to send reset email",
        });
    }
}
  
export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};

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

