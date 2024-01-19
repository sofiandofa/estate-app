import bcryptjs from 'bcryptjs';
import User from "../models/user.model"

export const signUp=async(req,res,next)=>{
    const{username,email,password}=req.body;
    const hashedPassword=bcryptjs.hashSync(password,10)
    const newUser=User.create({username,email,password:hashedPassword})
    try {
        await newUser.save()
        res.status(200).json("the user created succesfully")

    } catch (error) {
        next(error)
    }
} 

