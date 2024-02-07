import {useState} from "react"
import OAuth from "../components/OAuth"
import { useDispatch } from "react-redux"
import {signUp} from "../redux/user/signUpSlice"
import { useNavigate } from "react-router-dom"
function SignUp() {
    const[loading,setLoading]=useState(false)
    const[error,setError]=useState(false)
    const dispatch =useDispatch()
    const navigate=useNavigate()
    const [formData,setFormData]=useState({})
    const submitHandler=async(e)=>{
        e.preventDefault()
        try {
            setLoading(true)
            const res= await fetch('/api/auth/isRegister',{
                method:"POST",
                body:JSON.stringify(formData),
                headers:{
                    'Content-Type': 'application/json',
                }
            })
            setLoading(false)
            const data=await res.json()
            if(data.success===false){
                setError(data.message)
            }
            dispatch(signUp({
                email:formData.email,
                username:formData.username,
                password:formData.password,
            }))
            if(data.success!==false){
                const resOtp= await fetch("/api/auth/sentOtp",{
                    method:"POST",
                    headers:{
                        'Content-Type': 'application/json',
                    },
                    body:JSON.stringify(formData)
                })
                const dataOtp=await resOtp.json()
                if(dataOtp.success===false){
                    setError(dataOtp.message)
                }
                navigate("/sign-up/verify-email")
            }
        } catch (error) {
            setError(error.message)
        }
    }
    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.id]:e.target.value
        })
    }

    return (
            <div className="sign-up sm:pt-24 pt-5 ">
                <div className="w-3/4  mx-auto  border-white border-8  md:w-1/2 py-10 rounded-lg shadow-md bg-[#066ac169]" >
                    <h2 className=" font-semi-bold mx-auto text-slate-200   w-fit  py-5  text-2xl ">sign up</h2>
                    <form onSubmit={submitHandler} className="flex flex-col items-center gap-6">
                        <input type="text" 
                                id="username"
                                placeholder="username" 
                                className=" w-3/4 mx-auto p-2 rounded-md " 
                                onChange={handleChange} />
                        <input type="email" 
                                id="email"
                                placeholder="email" 
                                className=" w-3/4 mx-auto p-2 rounded-md  " 
                                onChange={handleChange} />
                        <input type="password" 
                                id="password"
                                placeholder="password" 
                                className=" w-3/4 mx-auto p-2 rounded-md " 
                                onChange={handleChange} />
                        <button disabled={loading} className="bg-[#a2fcecab] w-3/4  p-2 hover:opacity-90 rounded-md">
                            {loading? "loading..." :"sign up" }
                        </button>
                        <OAuth/>
                    </form>
                    {error && <p className="text-red-500 text-center"> {error} </p> }
                </div>
            </div>
    )
}

export default SignUp