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
    updateUserFailure,updateUserStart,updateUserSuccess,
    deleteUserFailure,deleteUserStart,deleteUserSuccess,
    signOutUserFailure,signOutUserStart,signOutUserSuccess
}from "../redux/user/userSlice"
import { Link } from "react-router-dom";

const Profile = () => {
    const{currentUser,error,loading}=useSelector(state=>state.user)
    const dispatch=useDispatch()
    const fileRef=useRef(null)
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const[updateSuccess,setUpdateSuccess]=useState(false)
    const [formData,setFormData]=useState({})
    const [userListings,setUserListings]=useState([])
    const[showListingsError,setShowListingsError]=useState(false)

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
                return
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
    const handleSignOut =async()=>{
        try {
            dispatch(signOutUserStart())
            const res=await fetch(`/api/auth/sign-out`)
            const data=await res.json()

            if(data.success===false){
                dispatch(signOutUserFailure(data.message))
                return
            }
            dispatch(signOutUserSuccess())
        } catch (error) {
            dispatch(signOutUserFailure(error.message))
        }
    }
    const handleShowListings=async(e)=>{
        e.preventDefault()
        try {
            const res=fetch(`/api/user/listings/${currentUser._id}`)
            const data=await res.json()
            if(data.success===false){
                setShowListingsError(true)
            }
            setShowListingsError(false)
            setUserListings(data)
        } catch (error) {
            setShowListingsError(true)
        }
    }

    const handleListingDelete=async(listingId)=>{
        try {
            const res=await fetch(`/api/listing/delete/${listingId}`,{
                method:"DELETE",
                headers:{

                },
            })
            const data=await res.json()
            if(data.success===false){
                console.log(data.message)
            }
            setUserListings(prev=>prev.filter(listing=> listing.id!==listingId ))
        } catch (error) {
            console.log(error)
        }
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
            <Link to={"/create-listing"} className="bg-green-700 text-white font-semibold  w-3/4 mb-4 p-1 hover:opacity-90">
                    create lising
            </Link>
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
            <button 
            onClick={handleShowListings}
                className=" bg-green-500 text-white font-semibold px-2 py-1 rounded-md">
                    show listings
            </button>
            <p className='text-red-700 mt-5'>
                {showListingsError ? 'Error showing listings' : ''}
            </p>
            {userListings && userListings.length > 0 && (
                    <div className='flex flex-col gap-4'>
                    <h1 className='text-center mt-7 text-2xl font-semibold'>
                        Your Listings
                    </h1>
                    {userListings.map((listing) => (
                        <div
                        key={listing._id}
                        className='border rounded-lg p-3 flex justify-between items-center gap-4'
                        >
                        <Link to={`/listing/${listing._id}`}>
                            <img
                            src={listing.imageUrls[0]}
                            alt='listing cover'
                            className='h-16 w-16 object-contain'
                            />
                        </Link>
                        <Link
                            className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                            to={`/listing/${listing._id}`}
                        >
                            <p>{listing.name}</p>
                        </Link>

                        <div className='flex flex-col item-center'>
                            <button
                            onClick={() => handleListingDelete(listing._id)}
                            className='text-red-700 uppercase'
                            >
                            Delete
                            </button>
                            <Link to={`/update-listing/${listing._id}`}>
                            <button className='text-green-700 uppercase'>Edit</button>
                            </Link>
                        </div>
                        </div>
                    ))}
                    </div>
                )}
        </div>
    )
}

export default Profile