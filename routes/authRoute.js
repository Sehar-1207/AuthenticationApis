import express from 'express';
import {mailVerification, sendMailVerification,forgotPassword, resetPassword,resetUpdatePassword, resetSuccess } from '../controller/authController.js';
import {passwordResetValidation, sendMailVerificationValidation} from '../middleware/validation.js';
import bodyParser from 'body-parser';

const jsonParser = bodyParser.json();
const authRouter = express();
authRouter.use(express.json());
authRouter.use(jsonParser);
authRouter.use(express.urlencoded({ extended: true }));

authRouter.get('/mailVerification', mailVerification);
authRouter.post('/sendMailVerification', sendMailVerificationValidation, sendMailVerification);
authRouter.post('/forgotPassword', passwordResetValidation, forgotPassword);
authRouter.get('/resetPassword', resetPassword);
authRouter.post('/resetUpdatePassword', resetUpdatePassword); // ✅ matches form action
authRouter.get('/resetSuccess', resetSuccess); // ✅ fixed typo
export default authRouter;

