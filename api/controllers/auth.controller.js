import bcryptjs from 'bcryptjs';
import User from "../models/user.model.js"
import  handleErorr from '../utils/error.js'
import jwt from 'jsonwebtoken'

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

export const signIn=async(req,res)=>{
    const {email,password}=req.body;
    try {
        const valideUser=await User.findOne({email})        
        if(!valideUser) return next(handleErorr(404,"the user is not exist"));
        const validPassword=bcryptjs.compare(password,valideUser.password)
        if(!validPassword) return next(handleErorr(404,'Wrong credentials!'));
        const {password:pass,...rest}=valideUser._doc
        const token=jwt.sign({id:valideUser._id},process.env.JWT_SECRET)
        res.status(201).json(rest).cookie('access_token',token,{httpOnly:true})
    } catch (error) {
        next(error)
    }
}

export const google =async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
}   