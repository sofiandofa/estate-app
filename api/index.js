import express from 'express';
import authRouter from './routes/auth.route.js';
import userRouter from "./routes/user.route.js"
import mongoose from 'mongoose';
import dotenv from "dotenv"
import cookieParser from 'cookie-parser';
import listingRouter from "./routes/listing.route.js"
dotenv.config()



mongoose
.connect(process.env.MONGO_URI)
.then(()=>console.log("mongodb connected succesfully"))
.catch((error)=>{console.log(error)})

const __dirname = path.resolve();

const app=express();

app.use(express.json())
app.use(cookieParser())
app.listen(3000,()=>{
    console.log("the server is lestinin in port 3000")
})

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/listing",listingRouter)

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||"internal server error";
    return  res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    })
})