import { check } from "express-validator";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { mailValidation, passwordValidation } from "./sharedValidations.js";

// Express-validator for form fields
export const registerUserValidation = [
  check('name', 'Please enter your name')
    .notEmpty()
    .isLength({ min: 3, max: 20 }),

  mailValidation,
  passwordValidation,

  check('mobile')
    .custom((value) => {
      const phoneNumber = parsePhoneNumberFromString(value);
      if (!phoneNumber || !phoneNumber.isValid()) {
        throw new Error('Enter a valid phone number.');
      }
      return true;
    })
    .customSanitizer((value) => {
      const phoneNumber = parsePhoneNumberFromString(value);
      return phoneNumber ? phoneNumber.number : value;
    })
];

// Custom middleware for validating the uploaded file
export const validateImageFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      msg: 'Error Occurred!',
      error: [
        {
          type: 'field',
          msg: 'Please upload Jpeg, Jpg or Png.',
          path: 'image',
          location: 'body'
        }
      ]
    });
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      success: false,
      msg: 'Error Occurred!',
      error: [
        {
          type: 'field',
          msg: 'Please upload Jpeg, Jpg or Png.',
          path: 'image',
          location: 'body'
        }
      ]
    });
  }

  next();
};
export const sendMailVerificationValidation = [
  mailValidation,
];
export const passwordResetValidation = [
  mailValidation,
];
export const LoginValidation = [
  mailValidation,
  passwordValidation,

];

export const updateProfileValidation=[
  check('name', 'Please enter your name')
    .notEmpty()
    .isLength({ min: 3, max: 20 }),
  passwordValidation,

  check('mobile')
    .custom((value) => {
      const phoneNumber = parsePhoneNumberFromString(value);
      if (!phoneNumber || !phoneNumber.isValid()) {
        throw new Error('Enter a valid phone number.');
      }
      return true;
    })
    .customSanitizer((value) => {
      const phoneNumber = parsePhoneNumberFromString(value);
      return phoneNumber ? phoneNumber.number : value;
    })
];

export const otpVerificationValididations=[
 mailValidation,
];

export const otpVerification=[
 check('user_id', 'user Id is required.').not().isEmpty(),
 check('otp', 'OTP is required').not().isEmpty(),
];

