
import express from 'express';
import path, { dirname } from 'path';
import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { validationResult } from 'express-validator';
import { userRegister } from '../controller/userController.js';
import { registerUserValidation, validateImageFile } from '../middleware/validation.js';

const userRouter = express.Router();
userRouter.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPEG and PNG images are allowed'), false);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

const saveImageOnSuccess = (req, res, next) => {
    if (!req.file) return next();

    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(); // skip saving if validation failed

    const imageName = Date.now() + '-' + req.file.originalname;
    const imagePath = path.join(__dirname, '../public/images', imageName);

    fs.writeFile(imagePath, req.file.buffer, (err) => {
        if (err) return next(err);
        req.body.image = 'images/' + imageName; // ✅ attach image path to req.body for controller
        next();
    });
};

userRouter.post(
    '/register',
    upload.single('image'),       // Step 1: upload to memory
    registerUserValidation,       // Step 2: validate fields
    validateImageFile,            // Step 3: validate image file
    saveImageOnSuccess,           // Step 4: save image to disk if validations pass
    userRegister                  // Step 5: save user to DB and send email
);


export default userRouter;