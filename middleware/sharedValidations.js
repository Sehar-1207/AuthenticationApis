import { check} from "express-validator";
export const mailValidation = [
  check('email', 'Please provide email properly.')
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
];
export const passwordValidation = [
   check('password', 'Password should be greater than 6 characters and contain 1 lowercase, 1 uppercase, and 1 number')
    .isStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1 }),
];