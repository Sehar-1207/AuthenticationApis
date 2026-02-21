import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" }); // Load .env variables
import express from 'express';
import connectDB from './config/dbConfig.js';
import userRoute from './routes/userRouter.js'

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.Server_Port || 5000;
connectDB();
app.use('/api', userRoute);

app.listen(PORT,()=>{
    console.log(`The server is listening at http://localhost:${PORT}`)
});
