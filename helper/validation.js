import { check } from "express-validator";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export const registerUserValidation = [
    check('name', 'Please enter your name').not().isEmpty().isLength({ min: 3, max: 20 }),

    check('email', 'Please provide email properly.').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),

    check('password','Password should be greater than 6 digits hsould have 1 lower case , 1 upper case letter and 1 numeric value').isStrongPassword({
        minLength: 6,
        minLowercase:1,
        minUppercase: 1,
        minNumbers:1
    }),

    check('mobile').custom((value) => {
            const phoneNumber = parsePhoneNumberFromString(value);
            if (!phoneNumber || !phoneNumber.isValid()) {
                throw new Error('Enter a valid phone number.');
            }
            return true;
        }).customSanitizer((value) => {
            const phoneNumber = parsePhoneNumberFromString(value);
            return phoneNumber ? phoneNumber.number : value;
        }),
    checck('image').custom((req,res)=>{
        if(req.file.mimetype ==='image/jpeg' || req.file.mimetype === 'image/jpg' || req.file.mimetype ==='image/png'){
            return true;
        }
        else{
            return false;
        }
        
    }).withMessage("Please upload Jpeg, Jpg or Png.")    
];