import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { signInStart, signInFailure, signInSuccess } from '../redux/user/userSlice'
import OAuth from "../components/OAuth"

function SignIn() {
    const { error, loading } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate=useNavigate()
    const [formData, setFormData] = useState({})

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(signInStart())
            const res = await fetch("/api/auth/sign-in", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = await res.json()
            if (data.success === false) {
                dispatch(signInFailure(data.message))
                return
            }
            dispatch(signInSuccess(data))
            navigate("/")
        } catch (error) {
            dispatch(signInFailure(error.message))

        }
    }
    return (
        <div className="sign-up sm:pt-24 pt-5 ">
        <div className="w-3/4  mx-auto  border-white border-8  md:w-1/2 pt-10 pb-8  rounded-xl shadow-md bg-[#066ac169]">
            <h2 className=" font-semi-bold mx-auto text-white w-fit  pt-4 text-3xl pb-6 ">welcom back</h2>
            <form onSubmit={submitHandler} className="flex flex-col items-center gap-7">
                <input type="email"
                    id="email"
                    placeholder="email"
                    className=" w-3/4 mx-auto p-2 rounded-md outline-none"
                    onChange={handleChange} />
                <input type="password"
                    id="password"
                    placeholder="password"
                    className=" w-3/4 mx-auto p-2 rounded-md outline-none"
                    onChange={handleChange} />
                <button disabled={loading} className="bg-[#a2fcecab] rounded-md w-3/4 mb-0 p-2 hover:opacity-90">
                    {loading ? "loading..." : "sign in"}
                </button>
                <OAuth/>
                <span className=" text-lg font-semi-bold text-white mb-2">
                    you dont have account !!
                    <Link to='/sign-up' className="text-red-600 hover:opacity-80"> sign up </Link>
                </span>
            </form>
            {error && <p className="bg-red-500/80 text-center text-gray-100 mx-1 rounded-md py-1"> {error} </p>}
        </div>
        </div>
    )
}

export default SignIn