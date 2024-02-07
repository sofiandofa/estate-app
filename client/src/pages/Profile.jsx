/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react"
import {useSelector,useDispatch}from "react-redux"
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {FaTrash,FaSignOutAlt} from 'react-icons/fa'
import {
    updateUserFailure,updateUserStart,updateUserSuccess,
    deleteUserFailure,deleteUserStart,deleteUserSuccess,
    signOutUserFailure,signOutUserStart,signOutUserSuccess
}from "../redux/user/userSlice"
import {signOut} from '../redux/user/signUpSlice'
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
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>{
                    setFormData({ ...formData, avatar: downloadURL })
                    
                }
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
            dispatch(signOut())
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
            const res=await fetch(`/api/user/listings/${currentUser._id}`)
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
            setUserListings(prev=> prev.filter(listing=> listing._id!==listingId ))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className=" max-w-3xl mx-auto p-2 bg-slate-100 flex flex-col items-center my-4 shadow-sm rounded-md     ">
            <h1 className="text-center  text-4xl font-semibold  my-4 text-slate-600"> Profile </h1>
            
            <div className="mb-2">
                <input 
                    type="file"  
                    hidden 
                    ref={fileRef} 
                    onChange={(e)=>setFile(e.target.files[0])} 
                    accept='image/*'
                />
                <img src={currentUser.avatar} alt="" 
                    className=" self-center rounded-full h-14 w-14 object-cover" 
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
            <form onSubmit={submitHanlder} className="flex flex-col items-center  justify-center gap-5 w-full">
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
                <button disabled={loading} className="bg-gray-400 w-2/4 rounded-md text-white font-semibold mb-4 p-1 hover:opacity-90">
                    {loading ? "loading..." : "update"}
                </button>
            </form>
            <Link to={"/create-listing"} className="bg-gray-400 text-white font-semibold  w-2/4 mb-4 p-1 rounded-md hover:opacity-90 text-center">
                    create lising
            </Link>
            <div className='flex justify-between items-center mt-2 w-3/4'>
                <span
                onClick={handleDeleteUser}
                className='text-red-400  cursor-pointer border font-medium border-slate-500 px-2 py-1 text-sm rounded-md flex items-center gap-2  hover:bg-red-500 hover:text-white hover:border-none'>
                
                <FaTrash className=" text-slate-500"/>
                Delete account
                </span>
                <span onClick={handleSignOut} 
                className='text-red-400 cursor-pointer border font-medium border-slate-500 px-2  py-1 text-sm rounded-md flex items-center gap-2 hover:bg-red-500 hover:text-white hover:border-none'>
                <FaSignOutAlt className=" text-slate-500"/>
                Sign out
                </span>
            </div>
            <p className="text-red-600 mt-5">{error? error :''}</p>
            <p className='text-green-700 mt-5'>
                {updateSuccess ? 'User is updated successfully!' : ''}
            </p>
            <button 
            onClick={handleShowListings}
                className=" bg-slate-600 text-white font-semibold px-3 py-1 rounded-md">
                    show listings
            </button>
            <p className='text-red-700 mt-5'>
                {showListingsError ? 'Error showing listings' : ''}
            </p>
            {userListings && userListings.length > 0 && (
                    <div className='flex flex-col gap-4 w-full'>
                            <h1 className='text-center mt-7 text-2xl font-semibold'>
                                Your Listings
                            </h1>
                            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3   justify-center ">
                                {userListings.map((listing) => (
                                    <div
                                        key={listing._id}
                                        className=' shadow-md rounded-lg p-3 flex flex-col  justify-between items-center gap-4 w-30  bg-white'
                                    >
                                        <Link to={`/listing/${listing._id}`}>
                                            <img
                                            src={listing.imageUrls[0]}
                                            alt='listing cover'
                                            className='h-16 w-full object-contain'
                                            />
                                        </Link>
                                        <Link
                                            className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                                            to={`/listing/${listing._id}`}
                                        >
                                            <p>{listing.name}</p>
                                        </Link>

                                        <div className='flex flex-row gap-2 item-center'>
                                            <button
                                            onClick={() => handleListingDelete(listing._id)}
                                            className='text-white px-2 py-1 w-20 border bg-red-600 '
                                            >
                                            Delete
                                            </button>
                                            <Link to={`/update-listing/${listing._id}`}>
                                            <button className='text-white px-2 py-1 w-20 uppercase bg-green-500'>Edit</button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                    </div>
                )}
        </div>
    )
}

export default Profile