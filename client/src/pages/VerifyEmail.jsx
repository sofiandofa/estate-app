import {  useState } from "react";
import {FaHandPointDown} from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux";
import {signOut} from "../redux/user/signUpSlice"
import { useNavigate } from "react-router-dom"

const VerifyEmail = () => {
    const{email,username,password}=useSelector(state=>state.signUp)
    const [loading,setLoading]= useState(false)
    const [error,setError]=useState(false)
    const [formData,setFormData] =useState('')
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const submitHandler=async(e)=>{
        e.preventDefault();
        try {
            setLoading(true)
            const res=await fetch("/api/auth/sign-up",{
                method:"POST",
                body:JSON.stringify({otp:formData,email,password,username}),
                headers: {
                    'Content-Type': 'application/json',
                },
                
            })
            const data=res.json()
            if(data.success===false){
                setError(data.message)
                return
            }
            navigate('/sign-in')
            setLoading(false)
            setError(null)
            
            dispatch(signOut())
        } catch (error) {
            setLoading(false)
            setError(error.message)
        }
    }
    return (
    <div className="verify-bg">
        <div className="absolute top-1/2 left-1/2  translate-x-[-50%] translate-y-[-50%] ">
                    <div className=" max-w-2xl mx-auto flex flex-col bg-slate-100 shadow-slate-400 shadow-md justify-center items-center p-6 rounded-lg py-10">
                            <div className="px-2 pt-2 mb-7 flex flex-col items-center gap-2">
                                <h1 className=" text-lg font-medium text-gray-500  text-center ">
                                    {`pass here  the verification code from your email:${email} `}  
                                </h1>
                                <FaHandPointDown className="text-green-500  text-xl"/>
                            </div>
                            <form onSubmit={submitHandler} className="flex flex-col gap-4">
                                <input 
                                    onChange={(e)=>setFormData(e.target.value)}
                                    value={formData}
                                    type="text" 
                                    className="focus:outline-none rounded-md py-1 px-2 text-lg  font-medium text-center" />
                                <div className="flex items-center gap-3 flex-wrap justify-center">
                                    <button disabled={loading}  
                                        className=" bg-[#56d6bfee] font-semibold text-white px-2 py-1 rounded-md w-fit mx-auto disabled:opacity-75 ">
                                            {loading ? 'verifying...' :'verify Now'} 
                                    </button>
                                        
                                    <button type="button" className=" bg-[#ff6ffa] font-semibold text-gray-100 px-2 py-1 rounded-md w-fit mx-auto disabled:opacity-75"> resend the code </button>
                                </div>
                            </form>
        
                            {error && <p className="text-red-500 font-medium mt-3"> {error} </p>}
                    </div>
        </div>
    </div>
    )
}

export default VerifyEmail