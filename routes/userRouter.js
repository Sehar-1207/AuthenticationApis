import express from 'express';
import path, { dirname } from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { userRegister } from '../controller/userController.js';
import {registerUserValidation} from '../helper/validation.js';

const userRouter = express.Router();

// Parse JSON bodies
userRouter.use(express.json());

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Multer setup
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if(file.mimetype ==='image/jpeg' || file.mimetype === 'image/jpg' ||file.mimetype ==='image/png'){
            cb(null, path.join(__dirname, '../public/images'));
        }
        else{
            console.log("Upload only png jpg or jpeg file please!");
        }
    },
    filename: function(req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});
const fileFiltering =(req, file , callback)=>{
     if(file.mimetype ==='image/jpeg' || file.mimetype === 'image/jpg' ||file.mimetype ==='image/png'){
        callback(null, true);
     }
     else{
        callback(null, false);
    }
}
const upload = multer({ storage: storage,
    fileFilter:fileFiltering
 });

userRouter.post("/register", upload.single('image'), registerUserValidation, userRegister);

export default userRouter;