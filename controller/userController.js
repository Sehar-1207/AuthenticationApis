import bcryptjs from "bcryptjs";
import User from "../models/userModel.js";
import { validationResult } from "express-validator";

export const userRegister = async (req, res) => {
    try {
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.status(400).json({
            success: false,
            msg: "Error Occured!",
            errors:errors.array()
        });
        }
        const { name, email, password, mobile } = req.body;
        const emailExist = await User.findOne({email});
        if(emailExist){
            return res.status(400).json({
            success: false,
            msg: "Email already exists",
        });
        } 
        const hashPassword = await bcryptjs.hash(password,10);
        const userData = await User.create({
            name,
            email,
            password:hashPassword,
            mobile,
            image: req.file ? "images/" + req.file.filename : "default.png"
        });
        return res.status(200).json({
            success:true,
            msg:"Successfully Created and saved record!",
            user:userData
        })
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message,
        });
    }
};
