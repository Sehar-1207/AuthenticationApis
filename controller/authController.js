import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { validationResult } from "express-validator";
import { generateAccessToken } from "../helper/generatingTokens.js";
import { deleteProfileImage } from "../helper/deleteProfileImage.js";
import blacklistToken from "../models/blackListToken.js";
import { sendMail } from "../helper/sendMail.js";
import Otp from "../models/otp.js";
import { expiryOtp } from "../helper/otpValidate.js";

export const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.status(401).json({
        success: false,
        message: "User not found!",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid! Check your email and password and try again.",
      });
    }

    if (userData.is_verified === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Your account is not verified yet. Please verify your account to login.",
        error: "Account not verified",
      });
    }

    const accesstoken = generateAccessToken({ user: userData });
    const refreshtoken = generateAccessToken({ user: userData });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: userData,
      accesstoken: accesstoken,
      refreshtoken: refreshtoken,
      tokenType: "Bearer",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};
export const profile = async (req, res) => {
  try {
    const userProfileData = req.user.user;
    return res.status(200).json({
      success: true,
      message: "User profile data retrivedd in request successfully",
      data: userProfileData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "User profile not found!",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.array(),
      });
    }

    const { name, mobile } = req.body;

    const data = {
      name,
      mobile,
    };

    // If image uploaded, attach it
    if (req.file) {
      data.image = "images/" + req.file.filename;
      const oldUser = await User.findOne({ _id: req.user.user._id });
      const oldImagePath = path.join(__dirname, "../public/" + oldUser.image);
      await deleteProfileImage(oldImagePath);
    }

    await User.findByIdAndUpdate(
      req.user.user._id,
      { $set: data },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "User Profile Updated Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const refreshToken = async (req, res) => {
  try {
    const userId = req.user.user._id;
    User.findOne({ _id: userId });
    const accessToken = await generateAccessToken({ user: userId });
    const refreshToken = await generateAccessToken({ user: userId });
    return res.status(200).json({
      success: true,
      msg: "Token refresh",
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["authorization"];
    const bearer = token.split(" ");
    const bearerToken = bearer[1];
    const blacklist = new blacklistToken({
      token: bearerToken,
    });
    await blacklist.save();
    res.setHeader("Clear-Site-Data", '"cookies", "storage"');
    return res.status(200).json({
      success: true,
      message: "User Logout successfully!",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const generateRandomOtp = async () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const otPVerification = async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation errors",
        error: error.array(),
      });
    }

    const { email } = req.body;
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.status(400).json({
        success: false,
        msg: "Email does not exist!",
      });
    }

    if (userData.is_verified == 1) {
      return res.status(400).json({
        success: false,
        msg: "Email is already verified!",
      });
    }
    const otp = await generateRandomOtp();

    const oldOtp = await Otp.findOne({ user_id: userData._id });
    if (oldOtp) {
      const sendNextOtp = await expiryOtp(oldOtp.timestamp());
      if (!sendNextOtp) {
        return res.status(400).json({
          success: false,
          msg: "Please try again after 1 minute to get new otp!",
        });
      }
    }

    const currentTime = new Date();
    Otp.findByIdAndUpdate(
      { user_id: userData._id },
      { otp: otp, timestamp: new Date(currentTime.getTime()) },
      { upsert: true, new: true, setDefaultOnInsert: true },
    );

    const enterOtp = new Otp({
      user_id: userData._id,
      otp: otp,
    });
    await enterOtp.save();

    // ✅ actually send the verification email
    const message = `
             <p>Hi <strong>${userData.name}</strong>!</p><br/>
             <h4>Otp Verification</h4>
             <p>Please verify your account using the given otp.</p>
             <h2>${otp}</h2>
         `;

    await sendMail({
      to: userData.email, // ✅ send to the user's email from DB
      subject: "Otp through Email Verified",
      content: message,
    });

    return res.status(200).json({
      success: true,
      msg: "Verification email sent successfully! Please check your inbox.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};


export const otPVerify = async (req, res) => {
try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation errors",
        error: error.array(),
      });
    }
    const {user_id, otp} = req.body;
   const OptData= await Otp.findOne({ user_id: user_id, otp: otp });
    if(!OtpData){
      return res.status(400).json({
        success: false,
        msg: "Otp Incorrect!",
      });
    }
     const expiry= await expiryOtp(OtpData.timestamp);
     if(!expiry){
      return res.status(400).json({
        success: false,
        msg: "Otp has been expired!",
      });
     }
     User.findByIdAndUpdate({_id:user_id},{
      $set:{
        is_verified:1
      }
     });
      return res.status(200).json({
        success: truee,
        msg: "Account has been Verified successfully!",
      });


} catch (error) {
  return res.status(400).json({
      success: false,
      msg: error.message,
    });
}

};
