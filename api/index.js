import express from 'express';
import authRouter from './routes/auth.route';
import mongoose from 'mongoose';
import dotenv from "dotenv"
dotenv.config()


const app=express();
mongoose
.connect(process.env.MONGO_URI)
.then(()=>console.log("mongodb connected "))
.catch((error)=>{console.log(error)})


app.listen(3000,()=>{
    console.log("the server is lestning in port 3000")
})
app.use(express.json())

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