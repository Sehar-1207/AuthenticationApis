import bcryptjs from "bcryptjs";
import User from "../models/userModel.js";
import { validationResult } from "express-validator";
import { sendMail } from '../helper/sendMail.js'; // use the utility instead of transporter directly

export const userRegister = async (req, res) => {
    try {
        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: "Error Occurred!",
                error: error.array()
            });
        }

        const { name, email, password, mobile } = req.body;

        const emailExist = await User.findOne({ email });
        if (emailExist) {
            return res.status(400).json({
                success: false,
                msg: "Email already exists",
            });
        }

        const hashPassword = await bcryptjs.hash(password, 10);

        const userData = await User.create({
            name,
            email,
            password: hashPassword,
            mobile,
            image: req.body.image || "default.png" // use req.body.image set
        });

        // ✅ Send verification email using the sendMail utility
        const content = `
            <p>Hi <strong>${name}</strong>!</p>
            <p>Thank you for registering. Please verify your email by clicking the link below:</p>
            <a href="http://localhost:4000/mailVerification?id=${userData._id}">Verify Email</a>
        `;

        try {
            await sendMail({
                to: email,
                subject: "Mail Verification",
                content
            });
            console.log("Verification email sent to:", email);
        } catch (mailError) {
            console.error("Failed to send verification email:", mailError.message);
            return res.status(200).json({
                success: true,
                msg: "User registered but verification email could not be sent. Please contact support.",
                user: userData
            });
        }

        return res.status(200).json({
            success: true,
            msg: "Successfully registered! Please check your email to verify your account.",
            user: userData
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message,
        });
    }
};

