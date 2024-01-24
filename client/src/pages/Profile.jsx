import { useEffect, useRef, useState } from "react"
import {useSelector,useDispatch}from "react-redux"
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';

import {
    updateUserFailure,
    updateUserStart,
    updateUserSuccess,
    deleteUserFailure,
    deleteUserStart,
    deleteUserSuccess
}from "../redux/user/userSlice"

const Profile = () => {
    const{currentUser,error,loading}=useSelector(state=>state.user)
    const dispatch=useDispatch()
    const fileRef=useRef(null)
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const[updateSuccess,setUpdateSuccess]=useState(false)
    const [formData,setFormData]=useState({})

    useEffect(()=>{
        if (file) {
            handleFileUpload(file);
        }
    },[file])
    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
    
        uploadTask.on(
            'state_changed',
            (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePerc(Math.round(progress));
            },
            (error) => {
            setFileUploadError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                setFormData({ ...formData, avatar: downloadURL })
                );
            }
            );
        };
    const handleChange=(e)=>{
        setFormData({...formData,[e.target.id]:e.target.value})
    }
    const submitHanlder=async(e)=>{
        e.preventDefault()
        dispatch(updateUserStart())
        try {
            const res=await fetch(`/api/user/update/${currentUser._id}`,{
                method:"POST",
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data=await res.json()
            if(data.success===false){
                dispatch(updateUserFailure(data.message))
            }
            setUpdateSuccess(true)
            dispatch(updateUserSuccess(data))
        } catch (error) {
            dispatch(updateUserFailure(error.message))
        }
    }

    const handleDeleteUser=async()=>{
        try {
            dispatch(deleteUserStart())
            const res =await fetch(`/api/user/delete/${currentUser._id}`,{method:"DELETE"})
            const data=await res.json()
            if(data.success===false){
                dispatch(deleteUserFailure(data))
            }
            dispatch(deleteUserSuccess())
        } catch (error) {
            dispatch(deleteUserFailure(error.message))
        }
    }
    const handleSignOut =(e)=>{
        
    }

    return (
        <div className=" max-w-lg mx-auto p-2 bg-slate-200">
            <h1 className=" text-center"> Profile </h1>
            
            <div>
                <input 
                    type="file"  
                    hidden 
                    ref={fileRef} 
                    onChange={(e)=>setFile(e.target.files[0])} 
                    accept='image/*'
                />
                <img src={currentUser.avatar} alt="" 
                    className=" self-center rounded-full h-7 w-7" 
                    onClick={()=>fileRef.current.click()}
                />
            </div>
            <p className='text-sm self-center'>
                {fileUploadError ? (
                    <span className='text-red-700'>
                    Error Image upload (image must be less than 2 mb)
                    </span>
                ) : filePerc > 0 && filePerc < 100 ? (
                    <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
                ) : filePerc === 100 ? (
                    <span className='text-green-700'>Image successfully uploaded!</span>
                ) : (
                    ''
                )}
            </p>
            <form onSubmit={submitHanlder}>
                <input type="text" id="username" 
                onChange={handleChange} 
                placeholder="username"
                className=" w-3/4 mx-auto p-1 rounded-md "/>
                <input type="email" id="email" 
                placeholder="email"
                onChange={handleChange} 
                className=" w-3/4 mx-auto p-1 rounded-md "/>
                <input type="password" id="password" 
                onChange={handleChange}
                placeholder="password"
                className=" w-3/4 mx-auto p-1 rounded-md "/>
                <button disabled={loading} className="bg-green-400 w-3/4 mb-4 p-1 hover:opacity-90">
                    {loading ? "loading..." : "update"}
                </button>
            </form>
            <div className='flex justify-between mt-5'>
                <span
                onClick={handleDeleteUser}
                className='text-red-600 cursor-pointer'
                >
                Delete account
                </span>
                <span onClick={handleSignOut} className='text-red-600 cursor-pointer'>
                Sign out
                </span>
            </div>
            <p className="text-red-600 mt-5">{error? error :''}</p>
            <p className='text-green-700 mt-5'>
                {updateSuccess ? 'User is updated successfully!' : ''}
            </p>
        </div>
    )
}

export default Profile