import express from 'express';
import authRouter from './routes/auth.route.js';
import mongoose from 'mongoose';
import dotenv from "dotenv"
dotenv.config()



mongoose
.connect(process.env.MONGO_URI)
.then(()=>console.log("mongodb connected succesfully"))
.catch((error)=>{console.log(error)})

const app=express();
app.use(express.json())

app.listen(3000,()=>{
    console.log("the server is lestinin in port 3000")
})

app.use("/api/auth",authRouter)


app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||"internal server error";
    return  res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    })
})