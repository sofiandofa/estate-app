import jwt from 'jsonwebtoken';
import  handleErorr  from './error.js';

export const verifyToken=async (req,res,next)=>{
    const token = req.cookies.access_token;
    if (!token) return next(handleErorr(401, 'Unauthorized'));
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(handleErorr(403, 'Forbidden'));
    
        req.user = user;
        next();
    }
)}