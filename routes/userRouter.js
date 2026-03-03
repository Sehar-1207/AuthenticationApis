import express from 'express';
import multer from 'multer';
import path, { dirname } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { userRegister } from '../controller/userController.js';
import { registerUserValidation, validateImageFile } from '../middleware/validation.js';

const userRouter = express.Router();
userRouter.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 1. Multer Configuration (Memory Storage)

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, JPG and PNG images are allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// 2. Save Image ONLY If Validation Passed

const saveImageOnSuccess = (req, res, next) => {

    if (!req.file) return next(); 

    const imageName = Date.now() + '-' + req.file.originalname;
    const imagePath = path.join(__dirname, '../public/images', imageName);

    fs.writeFile(imagePath, req.file.buffer, (err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error saving image file'
            });
        }

        req.body.image = 'images/' + imageName;

        next();
    });
};

userRouter.post(
    '/register',
    upload.single('image'),        // Step 1: Upload to memory
    registerUserValidation,        // Step 2: Validate form fields
    validateImageFile,             // Step 3: Validate image existence & type
    saveImageOnSuccess,            // Step 4: Save image only if valid
    userRegister                   // Step 5: Save user to DB
);

export default userRouter;