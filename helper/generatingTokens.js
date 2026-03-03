import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.Token_Secret, { expiresIn: "12h" });
};

export const generateRefreshToken = (user) => {
    return jwt.sign(user, process.env.Token_Secret, { expiresIn: "24h" });
};
