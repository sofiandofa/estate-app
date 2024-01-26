import User from '../models/user.model.js'
import Listing from "../models/listing.model.js"
import handleErorr from '../utils/error.js'
import bcryptjs from 'bcryptjs';


export const updateUser=async (req,res,next)=>{
    if(req.params.id!==req.user.id) return next(handleErorr(401,"You can only update your own account!"))
    try {
        if(req.body.password){
            req.body.password=bcryptjs.hashSync(req.body.password,10)
        }
        const updatedUser=await User.findByIdAndUpdate(
            req.params.id,
            {
            $set:{
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
            },
        },
        {new:true}
        )
        const{password:pass,...rest}=updatedUser._doc
        res.status(201).json(rest)


    } catch (error) {
        next(error)
    }
}

export const deleteUser=async(req,res,next)=>{
    if(req.params.id!==req.user.id) return next(handleErorr(401,"you can only delete you account"))
    try {
        await User.findByIdAndDelete(req.params.id)
        res.clearCookie("access_token")
        res.status(201).json("user deleted succesfully")
        
    } catch (error) {
        next(error)
    }

}

export const getUserListings=async(req,res,next)=>{
    try {
        if(req.user.id===req.params.id){
            const listings= await Listing.find({userRef:req.params.id})
            res.status(200).json(listings)
        }
    } catch (error) {
        next(error)
    }
}
