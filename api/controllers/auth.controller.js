import bcryptjs from 'bcryptjs';
import User from "../models/user.model.js"
import  handleErorr from '../utils/error.js'
import jwt from 'jsonwebtoken'
import OTP from "../models/otp.model.js"
import otpGenerator  from 'otp-generator'


export const isRegister=async(req,res,next)=>{
    const {username, email, password}= req.body

    // Check if All Details are there or not
    if (!username ||
        !email ||
        !password
    ) {
        next(handleErorr(405,'All Fields are required'))
    }

    //check if use already exists?
    const existingUser = await User.findOne({email})
    if(existingUser){
        next(handleErorr(400,'User already exists'))
    }
    return res.status(200).json({
        success: true,
        message: "the user doesn't register ✅"
    })
}



export const signUp=async(req,res,next)=>{
    try {
        //get input data
        const {username, email, password, otp}= req.body


        // Find the most recent OTP for the email
		const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
		console.log(response);
		if (response.length === 0) {
			// OTP not found for the email
			next(handleErorr(400,"The OTP is not valid"))
		} else if (otp !== response[0].otp) {
			// Invalid OTP
			next(handleErorr(400,"The OTP is not valid"))
		}

        //secure password
        let hashedPassword
        try {
            hashedPassword = await bcryptjs.hash(password,10)
        } catch (error) {
            next(handleErorr(500, `Hashing pasword error for ${password}: `+error.message))
        }

        const user = await User.create({
            username, email, password:hashedPassword
        })

        return res.status(200).json({
            success: true,
            user,
            message: "user created successfully ✅"
        })
    } catch (error) {
        return next(error)
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



// Send OTP For Email Verification
export const sendotp = async (req, res,next) => {
    const { email } = req.body;
	try {
        
		var otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});
		const result = await OTP.findOne({ otp });
		while (result) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
			});
		}
		const otpPayload = { email, otp };
		const otpBody = await OTP.create(otpPayload);
		res.status(200).json({
			success: true,
			message: `OTP Sent Successfully`,
			otp,
		});
	} catch (error) {
		next(error)
	}
};