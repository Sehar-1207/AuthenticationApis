import User from "../models/userModel.js";
import { validationResult } from "express-validator";
import { sendMail } from "../helper/sendMail.js"; 

export const mailVerification = async (req, res) => {
    try {
        if (req.query.id == undefined) {
            return res.render("404");
        }

        const userData = await User.findOne({ _id: req.query.id });

        if (userData) {
            if (userData.is_verified == 1) {
                return res.render('mailVerification', { message: 'Mail is already verified Successfully!' });
            }

            await User.findByIdAndUpdate({ _id: req.query.id }, {
                $set: { is_verified: 1 }
            });

            return res.render('mailVerification', { message: 'Email verified successfully! You can now login.' });
        } else {
            return res.render('mailVerification', { message: "User not found!" });
        }

    } catch (error) {
        console.log(error);
        return res.render("404");
    }
};

export const sendMailVerification = async (req, res) => {
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
        const userData = await User.findOne({ email });

        if (!userData) {
            return res.status(400).json({
                success: false,
                msg: 'Email does not exist!'
            });
        }

        if (userData.is_verified == 1) {
            return res.status(400).json({
                success: false,
                msg: 'Email is already verified!'
            });
        }

        // ✅ actually send the verification email
        const message = `
            <p>Hi <strong>${userData.name}</strong>!</p>
            <p>Please verify your email by clicking the link below:</p>
            <a href="http://localhost:4000/api/mailVerification?id=${userData._id}">Verify Email</a>
        `;

        await sendMail({
            to: userData.email,        // ✅ send to the user's email from DB
            subject: "Email Verification",
            content: message
        });

        return res.status(200).json({
            success: true,
            msg: 'Verification email sent successfully! Please check your inbox.'
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
};