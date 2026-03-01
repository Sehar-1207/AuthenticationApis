import User from "../models/userModel.js";
export const mailVerification = async (req, res) => {
    try {
        if (req.query.id == undefined) {          // ✅ fixed typo
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

            return res.render('mailVerification', { message: 'Email verified successfully! You can now login.' }); // ✅ added
        } else {
            return res.render('mailVerification', { message: "User not found!" }); // ✅ fixed slash
        }

    } catch (error) {
        console.log(error);
        return res.render("404");
    }
};

export const sendMailVerification = async () => {

    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Errors',
                error: error.array()
            });
        }

        const { email } = req.body;
        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(400).json({
                success: false,
                msg: 'Errors! Email does not exist !'
            });
        }

        if (userData.is_verified == 1) {
            return res.status(400).json({
                success: false,
                msg: 'Mail already verified!'
            });
        }

          const content = `
            <p>Hi <strong>${userData.name}</strong>!</p>
            <p>Please verify your email by clicking the link below:</p>
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
            msg: 'Errors'
        });
    }
};