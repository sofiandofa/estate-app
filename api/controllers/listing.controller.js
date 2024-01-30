import Listing from "../models/listing.model.js"
import handleErorr from "../utils/error.js"

export const createListing=async(req,res,next)=>{
    try {
        const listing=await  Listing.create(req.body)
        
        return res.status(201).json(listing)
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

export const getListings=async(req,res,next)=>{
    try {
        const limit =parseInt(req.query.limit)||9
        const offer=req.query.offer
        const satrtIndex=parseInt(req.query.satrtIndex)||0
        if(req.query.offer==="false"||req.query.offer===undefined){
            offer={$in:[false,true]}
        }
        const furnished=req.query.furnished
        if(req.query.furnished==="false"||req.query.furnished===undefined){
            furnished={$in:[false,true]}
        }
        const parking=req.query.parking;
        if(req.query.parking==="false"||req.query.parking===undefined){
            parking={$in:[false,true]}
        }
        const type=req.query.type
        if(req.query.type==="false"||req.query.type==='all'){
            type={$in:["sale","rent"]}
        }
        const searchTerm=req.query.searchTerm||""

        const sort=req.query.sort|| "createdAt"
        const order=req.query.sort||"desc"
        const updatedListing=await Listing.find({
            name:{$regex:searchTerm,$option:'i'},
            type,
            parking,
            furnished,
            offer,
        }).sort({[sort]:order}).skip(satrtIndex)
        res.status(201).json(updatedListing)
    } catch (error) {
        next(error)
    }
}