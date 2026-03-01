import bcryptjs from "bcryptjs"; 
import User from "../models/userModel.js";
import { validationResult } from "express-validator"; 
import { sendMail } from "../helper/sendMail.js";  
import randomString from "randomstring";
import passwordReset from "../models/passwordReset.js";

export const forgotPassword = async (req, res) => {
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Validation errors',
                error: error.array()
            });
        }

        const { email } = req.body;
console.log("Forgot password requested for:", email); // ✅ add this
        const userData = await User.findOne({ email });

        if (!userData) {
            return res.status(400).json({
                success: false,
                msg: 'Email does not exist!'
            });
        }

        const randomStringList = randomString.generate(10);
        
      const message = `
    <p>Hi <strong>${userData.name}</strong>!</p>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="http://localhost:4000/api/resetPassword?token=${randomStringList}">Reset Password</a>
`;

        await passwordReset.deleteMany({ user_id: userData._id });

        const passwordResetDoc = new passwordReset({
            user_id: userData._id,
            token: randomStringList
        });
        await passwordResetDoc.save();

        await sendMail({ to: email, subject: "Password Reset Request", content: message }); // ✅ content: message

        return res.status(200).json({
            success: true,
            msg: 'Password reset email sent successfully! Please check your inbox.'
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
};


export const resetPassword = async (req, res) => {
    try {
        if (req.query.token == undefined) {
            return res.render("404");
        }

        const token = req.query.token;
        const passwordResetData = await passwordReset.findOne({ token });

        if (passwordResetData) {
            return res.render("resetPassword", { token }); // ✅ pass token to form
        } else {
            return res.render("404");
        }

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
};

export const resetUpdatePassword = async (req, res) => {
    try {
        const { token, password, c_password } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                msg: "Token is missing!"
            });
        }

        if (password !== c_password) {
            return res.render('resetPassword', {
                token,
                error: "Passwords do not match!"
            });
        }

        const passwordResetData = await passwordReset.findOne({ token }); // ✅ fixed

        if (passwordResetData) {
            const hashedPassword = await bcryptjs.hash(password, 10);
            await User.updateOne(
                { _id: passwordResetData.user_id },
                { $set: { password: hashedPassword } }
            );
            await passwordReset.deleteMany({ user_id: passwordResetData.user_id });
            return res.redirect('/api/resetSuccess'); // ✅ redirects on success
        } else {
            return res.status(400).json({
                success: false,
                msg: "Invalid or expired token!"
            });
        }

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
};

export const resetSuccess = (req, res) => {
    try {
        return res.render('/api/resetSuccess'); // ✅ render success page
        
    } catch (error) {
        return res.render("404");
    }
}