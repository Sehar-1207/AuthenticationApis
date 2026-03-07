import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import User from "../models/userModel.js";
import {generateAccessToken} from "../helper/generatingTokens.js";
import {deleteProfileImage} from "../helper/deleteProfileImage.js";
import blacklistToken from "../models/blackListToken.js";

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
        token:bearerToken,
    });
    await blacklist.save();
    res.headers('Clear-Site-Data','"cookies","storage","executionContexts"');
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
