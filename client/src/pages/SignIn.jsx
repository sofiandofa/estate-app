import {useState} from "react"
import {useSelector,useDispatch} from "react-redux"
import {signInStart,signInFailure, signInSuccess} from '../redux/user/authSlice'
function SignIn() {
    const[error,loading]=useSelector(state=>state.user)
    const dispatch=useDispatch()

    const [formData,setFormData]=useState({})

    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.id]:e.target.value
        })
    }
    const submitHandler=async(e)=>{
        e.preventDefault();
        try {
            dispatch(signInStart())
            const res=await fetch("/sign-in",{
                method:"POST",
                body:JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data=res.json()
            if(data.success===false){
                dispatch(signInFailure(data.message))
                return
            }
            dispatch(signInSuccess(data))
        } catch (error) {
            dispatch(signInFailure(error))
            
        }
    }
    return (
        <div className="w-1/2 mx-auto  bg-slate-100 my-20 shadow-md">
            <h2 className=" font-medium mx-auto  w-fit  py-5  text-lg ">sign up</h2>
            <from onSubmit={submitHandler} className="flex flex-col items-center gap-6">
                <input type="email" 
                        placeholder="email" 
                        className=" w-3/4 mx-auto p-1 rounded-md" 
                        onChange={handleChange} />
                <input type="password" 
                        placeholder="password" 
                        className=" w-3/4 mx-auto p-1 rounded-md" 
                        onChange={handleChange} />
                <button disabled={loading} className="bg-gray-300 w-3/4 mb-4 p-1 hover:opacity-90">
                    {loading? "loading..." :"sign in" }
                </button>
            </from>
            {error && <p className="text-red-500"> {error} </p> }
        </div>
    )
}

export default SignIn