import Listing from "../models/listing.model.js"

export const createListing=async(req,res)=>{
    try {

        const listing=await new Listing.create(req.body)
        res.status(201).json(listing)


    } catch (error) {
        next(error)
    }
}