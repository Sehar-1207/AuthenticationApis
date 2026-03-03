import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import generateAccessToken from "../helper/generateAccessToken.js";

//User request verifier
export const verifyToken = async (req, res, next) => {
    try {

        const token = req.body.token || req.query.token || req.headers["authorization"];
        if (!token) {
            return res.status(403).json({
                success: false,
                message: "A token is required for authenticaton which is not found!",
            });
        }
        const bearer = token.split(" ");
        const bearerToken = bearer[1];
        const decorder = jwt.verify(bearerToken,
            process.env.Token_Secret
        );
        req.user = decorder;

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: "Invalid token"
        });
    }
    return next();
};