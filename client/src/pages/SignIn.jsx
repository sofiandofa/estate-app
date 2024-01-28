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
            const data = res.json()
            if (data.success === false) {
                dispatch(signInFailure(data.message))
                return
            }
            dispatch(signInSuccess(data.message))
            navigate("/")
        } catch (error) {
            dispatch(signInFailure(error.message))

        }
    }
    return (
        <div className="w-1/2 mx-auto  bg-slate-100 my-20 shadow-md">
            <h2 className=" font-medium mx-auto  w-fit  py-5  text-lg ">sign in</h2>
            <form onSubmit={submitHandler} className="flex flex-col items-center gap-6">
                <input type="email"
                    id="email"
                    placeholder="email"
                    className=" w-3/4 mx-auto p-1 rounded-md outline-none"
                    onChange={handleChange} />
                <input type="password"
                    id="password"
                    placeholder="password"
                    className=" w-3/4 mx-auto p-1 rounded-md outline-none"
                    onChange={handleChange} />
                <button disabled={loading} className="bg-gray-300 w-3/4 mb-4 p-1 hover:opacity-90">
                    {loading ? "loading..." : "sign in"}
                </button>
                <OAuth/>
            </form>
            <span className=" ml-1 text-xs">
                you dont have account 
                <Link to='/sign-up' className="text-red-500 hover:opacity-80"> sign up </Link>
            </span>
            {error && <p className="text-red-500"> {error} </p>}
        </div>
    )
}

export default SignIn