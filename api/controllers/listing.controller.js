import Listing from "../models/listing.model.js"
import handleErorr from "../utils/error.js"

export const createListing=async(req,res)=>{
    try {
        const listing=await new Listing.create(req.body)
        res.status(201).json(listing)
    } catch (error) {
        next(error)
    }
}

export const deleteListing=async(req,res,next)=>{
    const listing=await Listing.findById(req.params.id)
    if(!listing){
        return next(handleErorr(404,"Listing not found!"))
    }
    if(req.user.id!==listing.userRef){
        return next(handleErorr(401,"You can only delete your own listings!"))
    }
    
    try {
        const listings=await Listing.findByIdAndDelete(req.params.id)
        res.status(200).json("listing has been deleted successfully!!")
    } catch (error) {
        next(error)
    }
        

}

export const updateListing=async(req,res,next)=>{
    const listing=await findById(req.params.id)
    if(req.user.id!==listing.userRef){
        return next(handleErorr(401,"you can only update your listing"))
    }
    if(!listing){
        return next(handleErorr(404,"the listing not found"))
    }
    try {
        const updatedListing=await Listing.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.status(201).json(updatedListing)
    } catch (error) {
        next(error)
    }
}

export const getListing =async(req,res,next)=>{
    const listing=await Listing.findById(req.params.id)
    if(!listing) return next(handleErorr(404,"the listing not found"))

    try {
        res.status(201).json(listing)
    } catch (error) {
        next(error)
    }

}