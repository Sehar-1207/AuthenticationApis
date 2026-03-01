import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" }); // Load .env variables
import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/dbConfig.js';
import userRoute from './routes/userRouter.js'
import authRouter from "./routes/authRoute.js";
import { mailVerification } from "./controller/authController.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const PORT = process.env.Server_Port || 5000;
connectDB();
app.use('/api', userRoute);
app.get('/mailVerification', mailVerification);
app.use('/api',authRouter);


app.listen(PORT,()=>{
    console.log(`The server is listening at http://localhost:${PORT}`)
});
