import { useEffect, useRef, useState } from "react"
import {useSlector}from "react-redux"
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';



const Profile = () => {
    const{currentUser}=useSlector(state=>state.user)
    const fileRef=useRef(null)
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
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

    return (
        <div className=" max-w-lg mx-auto p-2 bg-slate-200">
            <h1 className=" text-center"> Profile </h1>
            
            <div>
                <input type="file" name="" id="" hidden ref={fileRef} onChange={(e)=>setFile(e.target.files[0])} />
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
            <form>
                <input type="text" id="username"  />
            </form>
        </div>
    )
}

export default Profile