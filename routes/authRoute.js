import express from 'express';
import bodyParser from 'body-parser';
import {loginUser } from '../controller/authController.js';
import {mailVerification, sendMailVerification} from '../controller/mailVerification.js';
import {forgotPassword, resetPassword,resetUpdatePassword, resetSuccess } from '../controller/passwordController.js';
import {LoginValidation, passwordResetValidation, sendMailVerificationValidation} from '../middleware/validation.js';

const jsonParser = bodyParser.json();
const authRouter = express();
authRouter.use(express.json());
authRouter.use(jsonParser);
authRouter.use(express.urlencoded({ extended: true }));

//Mail when registered
authRouter.get('/mailVerification', mailVerification);
authRouter.post('/sendMailVerification', sendMailVerificationValidation, sendMailVerification);

//Forgot password
authRouter.post('/forgotPassword', passwordResetValidation, forgotPassword);
authRouter.get('/resetPassword', resetPassword);
authRouter.post('/resetUpdatePassword', resetUpdatePassword); 
authRouter.get('/resetSuccess', resetSuccess); 

//Login
authRouter.post('/login',LoginValidation,loginUser);

export default authRouter;

