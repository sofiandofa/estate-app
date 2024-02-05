import bcryptjs from 'bcryptjs';
import User from "../models/user.model.js"
import  handleErorr from '../utils/error.js'
import jwt from 'jsonwebtoken'

export const signUp=async(req,res,next)=>{
    const{username,email,password}=req.body;
    const hashedPassword=bcryptjs.hashSync(password,11)
    try {
        const newUser=User.create({username,email,password:hashedPassword})
        await newUser.save
        res.status(200).json("the user created succesfully")

    } catch (error) {
        next(error)
    }
} 

export const signIn=async(req,res,next)=>{
    const {email,password}=req.body;
    try {
        const valideUser=await User.findOne({email})        
        if(!valideUser) return next(handleErorr(404,"the user is not exist"));
        const validPassword=bcryptjs.compare(password,valideUser.password)
        if(!validPassword) return next(handleErorr(404,'Wrong credentials!'));
        const {password:pass,...rest}=valideUser._doc
        const token=jwt.sign({id:valideUser._id},process.env.JWT_SECRET)
        res.cookie('access_token',token,{httpOnly:true,maxAge:14*20*3600000}).status(201).json(rest)
    } catch (error) {
        next(error)
    }
}

export const google =async(req,res,next)=>{
    
    const{username,email,avatar}=req.body
    try {
        const validUser=await User.findOne({email})
        if(validUser){
            const token=jwt.sign({id:validUser._id},process.env.JWT_SECRET)
            const{password:pass,...rest}=validUser._doc
            res.cookie('access_token',token,{httpOnly:true}).status(201).json(rest)
        }else{
            const generatedPassword =
            Math.random().toString(36).slice(-8) +
            Math.random().toString(36).slice(-8);
            const hashedPassword=bcryptjs.hashSync(generatedPassword,10)
            const newUser=new User.create({
                username:username.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-3),
                email,
                password:hashedPassword,
                avatar
            })
            await newUser.save()

            const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET)
            const{password:pass,...rest}=newUser._doc
            res.cookie('access_token',token,{httpOnly:true}).status(201).json(rest)
        }
    } catch (error) {
        next(error)
    }
}   
export const signOut =(req,res,next)=>{
    try {
        res.clearCookie("access_token")
        res.json('the user sign out ')
    } catch (error) {
        next(error)
    }
}