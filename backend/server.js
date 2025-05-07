import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import {connectDb} from './config/connectDB.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
const app = express();

const port = process.env.PORT || 3000

connectDb();
app.use(cors({ origin: "https://verify-u.vercel.app", credentials: true}));
app.use(express.json())
app.use(cookieParser());

app.use("/api/auth", authRoutes)
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server Listening at port ${port}`)
})
