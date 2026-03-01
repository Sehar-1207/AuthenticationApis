import { check, validationResult } from "express-validator";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// Express-validator for form fields
export const registerUserValidation = [
  check('name', 'Please enter your name')
    .notEmpty()
    .isLength({ min: 3, max: 20 }),

  check('email', 'Please provide email properly.')
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),

  check('password', 'Password should be greater than 6 characters and contain 1 lowercase, 1 uppercase, and 1 number')
    .isStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1 }),

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
export const sendMailVerificationValidation =[
 check('email', 'Please provide email properly.')
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),

];
 