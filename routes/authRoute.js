import express from 'express';
import {mailVerification, sendMailVerification} from '../controller/authController.js';
import {sendMailVerificationValidation} from '../middleware/validation.js';

const authRouter = express();
authRouter.use(express.json());
authRouter.get('/mailVerification', mailVerification);
authRouter.post('/sendMailVerification', sendMailVerificationValidation, sendMailVerification);

export default authRouter;

