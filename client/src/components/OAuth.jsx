import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/authSlice';
import { useNavigate } from 'react-router-dom';


function OAuth() {
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const handleGoogleClick=async()=>{
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            const res=fetch("api/auth/google",{
                method:"post",
                headers:{

                },
                body:JSON.stringify({
                    username:result.user.displayName,
                    email:result.user.email,
                    avatar:result.user.photoURL,
                })
            })
            const data= await res.json();
            dispatch(signInSuccess(data))
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <button onClick={handleGoogleClick} type='button' 
        className='bg-red-400 w-3/4  p-1 hover:opacity-90 mb-2'>
                continue with google
        </button>
    )
}

export default OAuth